import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import bcryptService from "./bcrypt.service";
import HttpException from "../utils/HttpException.utils";
import { jwtDecode } from "jwt-decode";
import { LocationDTO } from "../dto/location.dto";
import { Location } from "../entities/location/location.entity";
import {
  Gender,
  PaymentType,
  RequestStatus,
  Role,
} from "../constant/enum";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { EmailService } from "./email.service";
import { DotenvConfig } from "../config/env.config";
import Stripe from "stripe";
import { LoginDTO } from "../dto/login.dto";

import {
  booked,
  bookRequestMessage,
  cancelRequest,
  Message,
  registeredMessage,
} from "../constant/message";
import axios from "axios";
import { In, MoreThan, Not } from "typeorm";
import esewaService from "./esewa.service";
import { io } from "../socket/socket";
import { Notification } from "../entities/notification/notification.entity";
import khaltiService from "./khalti.service";
import { RoomService } from "./room.service";
import { Chat } from "../entities/chat/chat.entity";
const roomService = new RoomService();
const emailService = new EmailService();

interface RequestGuides {
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
}
interface RequestTravels {
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  vehicleType: string;
}

interface Signup {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  password: string;
}
class UserService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly locationRepo = AppDataSource.getRepository(Location),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly travelrepo = AppDataSource.getRepository(Travel),
    private readonly guideRequestRepo = AppDataSource.getRepository(
      RequestGuide,
    ),
    private readonly travelRequestRepo = AppDataSource.getRepository(
      RequestTravel,
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification,
    ),
    private readonly chatRepo = AppDataSource.getRepository(Chat),

  ) { }

  async signup(data: Signup) {
    try {
      const emailExist = await this.userRepo.findOneBy({ email: data.email });
      if (emailExist)
        throw HttpException.notFound("Entered Email is already registered");

      const hashPassword = await bcryptService.hash(data.password);
      const addUser = this.userRepo.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: Gender[data.gender as keyof typeof Gender],
        password: hashPassword,
      });
      await this.userRepo.save(addUser);
      return registeredMessage("User");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async login(data: LoginDTO): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: [{ email: data.email }],
        select: [
          "id",
          "email",
          "password",
          "role",
          "firstName",
          "middleName",
          "lastName",
          "location",
          "gender",
          "phoneNumber",
          "verified",
        ],
      });

      if (!user)
        throw HttpException.notFound(
          "The email you provided is not registered yet, please try with the registered one or create new account",
        );

      if (!user.verified)
        throw HttpException.badRequest(
          "You are not verified user, please verify your otp",
        );
      const passwordMatched = await bcryptService.compare(
        data.password,
        user.password,
      );
      if (!passwordMatched) {
        throw HttpException.badRequest("Password didnot matched");
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async googleLogin(googleId: string) {
    try {
      const decoded: any = jwtDecode(googleId);
      const user = await this.userRepo.findOne({
        where: { email: decoded.email },
      });
      if (!user) {
        try {
          const saveUser = this.userRepo.create({
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            gender: Gender.NONE,
            phoneNumber: decoded.jti,
            password: await bcryptService.hash(decoded?.sub),
          });
          const save = await this.userRepo.save(saveUser);
          return save;
        } catch (error: any) {
          throw HttpException.badRequest(error.message);
        }
      } else {
        return await this.getByid(user.id);
      }
    } catch (error: any) { }
  }

  async debugFBToken(userAccessToken: string) {
    if (!DotenvConfig.FACEBOOK_APP_ID || !DotenvConfig.FACEBOOK_SECRET) {
      throw HttpException.internalServerError(
        "Facebook App ID and App Secret must be set in environment variables.",
      );
    }

    try {
      const fields = "id,first_name,middle_name,last_name,email";
      const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${userAccessToken}`;

      console.log("🚀 ~ UserService ~ debugFBToken ~ url:", url);
      const response = await axios.get(url);
      console.log("🚀 ~ UserService ~ debugFBToken ~ response:", response);
      const data = response.data;

      if (data) {
        return data;
      } else {
      }
    } catch (error: any) {
      throw error;
    }
  }

  async facebookLogin(userInfo: string) {
    try {
      const decoded: any = await this.debugFBToken(userInfo);
      console.log("🚀 ~ UserService ~ facebookLogin ~ decoded:", decoded);
      const user = await this.userRepo.findOne({
        where: { email: decoded.email },
      });
      console.log("🚀 ~ UserService ~ facebookLogin ~ user:", user);
      if (!user) {
        try {
          const saveUser = this.userRepo.create({
            email: decoded.email,
            firstName: decoded.first_name,
            lastName: decoded.last_name,
            middleName: decoded.middle_name,
            gender: Gender.NONE,
            role: Role.USER,
            phoneNumber: decoded.id,
            password: await bcryptService.hash(decoded?.id),
          });
          console.log("🚀 ~ UserService ~ facebookLogin ~ saveUser:", saveUser);
          const save = await this.userRepo.save(saveUser);
          return save;
        } catch (error: any) {
          throw HttpException.badRequest(error.message);
        }
      } else {
        return await this.getByid(user.id);
      }
    } catch (error: any) { }
  }

  async addLocation(user_id: string, data: LocationDTO) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.unauthorized("you are not authorized");
      const isLocation = await this.locationRepo.findOneBy({
        user: { id: user_id },
      });

      if (isLocation) {
        const location = this.locationRepo.update(
          {
            user: user,
          },
          {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        );
        return location;
      } else {
        const addLocation = this.locationRepo.create({
          latitude: data.latitude,
          longitude: data.longitude,
          user: user,
        });
        await this.locationRepo.save(addLocation);
        return addLocation;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getByid(id: string) {
    try {
      const user = this.userRepo
        .createQueryBuilder("user")
        .where("user.id =:id", { id })
        .getOne();

      console.log("🚀 ~ UserService ~ getByid ~ users:", user);
      return user;
    } catch (error) {
      throw HttpException.notFound("User not found");
    }
  }

  async getLocation(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("you are not authorized");
      const isLocation = await this.locationRepo.findOneBy({
        user: { id: userId },
      });
      if (!isLocation) {
        throw HttpException.badRequest("Location not found");
      }
      return isLocation;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async findGuide(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.unauthorized("you are not authorized");
      const guides = await this.guideRepo.find({
        where: { verified: true, approved: true, connects: MoreThan(0) },
        relations: ["details", "location", "kyc"],
      });
      if (!guides) {
        throw HttpException.notFound("Guide not found");
      }
      return guides;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async findTravel(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.unauthorized("you are not authorized");
      const travel = await this.travelrepo.find({
        where: {
          verified: true,
          approved: true,
          connects: MoreThan(0),
        },
        relations: ["details", "location", "kyc"],
      });
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }
      return travel;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async findHotel(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.unauthorized("you are not authorized");
      const travel = await this.travelrepo.find({
        where: { verified: true, approved: true },
        relations: ["details", "location", "kyc"],
      });
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }
      return travel;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async requestGuide(user_id: string, guide_id: string, data: RequestGuides) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized user");
      }
      const guide = await this.guideRepo.findOneBy({
        id: guide_id,
        approved: true,
        verified: true,
        connects: MoreThan(0),
      });

      if (!guide) {
        throw HttpException.notFound("Guide not found");
      }
      const findRequest = await this.guideRequestRepo.find({
        where: {
          users: { id: user_id },
          guide: { id: guide_id },
        },
      });
      if (findRequest.length > 0) {
        throw HttpException.badRequest(
          "Request already sent to this guide, Please wait a while for the guide response",
        );
      }

      const request = this.guideRequestRepo.create({
        from: data.from,
        to: data.to,
        totalDays: data.totalDays,
        totalPeople: data.totalPeople,
        users: user,
        guide: guide,
      });
      await this.guideRequestRepo.save(request);
      await emailService.sendMail({
        to: guide.email,
        text: "Request Incomming",
        subject: `${user.firstName} sent you a guide booking request`,
        html: `Hey ${user.firstName} ${user.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
      });
      return bookRequestMessage("Guide");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }

  async requestTravel(
    user_id: string,
    travel_id: string,
    data: RequestTravels,
  ) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      console.log(user, "jjjjjjaaaa");
      if (!user) {
        throw HttpException.unauthorized("You are not authorized user");
      }

      const travel = await this.travelrepo.findOneBy({
        id: travel_id,
        connects: MoreThan(0),
      });
      const findRequest = await this.travelRequestRepo.find({
        where: {
          user: { id: user_id },
          travel: { id: travel_id },
          status: Not(
            In([
              RequestStatus.CANCELLED,
              RequestStatus.COMPLETED,
              RequestStatus.REJECTED,
            ]),
          ),
        },
      });

      // if (findRequest.length > 0) {
      //   throw HttpException.badRequest(
      //     "Request already sent to this travel, Please wait a while for the travel response",
      //   );
      // }
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }

      const request = this.travelRequestRepo.create({
        from: data.from,
        to: data.to,
        totalDays: parseInt(data.totalDays),
        totalPeople: parseInt(data.totalPeople),
        vehicleType: data.vehicleType,
        user: user,
        travel: travel,
      });
      await this.travelRequestRepo.save(request);
      if (request) {
        io.to(travel_id).emit("request-travel", request);
      }
      const notification = this.notificationRepo.create({
        message: `${user.firstName} sent you a travel booking request `,
        senderUser: user,
        receiverTravel: request.travel,
      });
      await this.notificationRepo.save(notification);
      if (notification) {
        const notifications = await this.notificationRepo.findBy({
          receiverTravel: { id: request.travel.id },
        });
        io.to(notification.receiverTravel.id).emit(
          "notification",
          notifications,
        );
      }
      await emailService.sendMail({
        to: travel.email,
        text: "Request Incomming",
        subject: `${user.firstName} sent you a travel booking request`,
        html: `Hey ${user.firstName} ${user.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
      });
      return bookRequestMessage("Travel");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }

  async getOwnTravelRequests(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized");
      }
      const data = await this.travelRequestRepo
        .createQueryBuilder("requestTravel")
        .leftJoinAndSelect("requestTravel.travel", "travel")
        .leftJoinAndSelect("travel.kyc", "kyc")
        .leftJoinAndSelect("requestTravel.user", "user")
        .where("requestTravel.user_id =:user_id", { user_id })
        .andWhere("requestTravel.status NOT IN (:...statuses)", {
          statuses: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
        })
        .getMany();
      if (!data)
        throw HttpException.notFound(
          "You do not requested any travels for booking",
        );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }
  async getTravelRequestsHistory(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized");
      }
      const data = await this.travelRequestRepo
        .createQueryBuilder("requestTravel")
        .leftJoinAndSelect("requestTravel.travel", "travel")
        .leftJoinAndSelect("travel.kyc", "kyc")
        .leftJoinAndSelect("requestTravel.user", "user")
        .where("requestTravel.user_id =:user_id", { user_id })
        .andWhere("requestTravel.status IN (:...statuses)", {
          statuses: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
        })
        .getMany();

      if (!data)
        throw HttpException.notFound(
          "You do not requested any travels for booking",
        );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }
  async getOwnGuideRequests(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized");
      }
      const data = await this.guideRequestRepo
        .createQueryBuilder("requestGuide")
        .leftJoinAndSelect("requestGuide.guide", "guide")
        .leftJoinAndSelect("guide.kyc", "kyc")
        .leftJoinAndSelect("requestGuide.users", "user")
        .where("requestGuide.user_id = :user_id", { user_id })
        .andWhere("requestGuide.status NOT IN (:...statuses)", {
          statuses: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
        })
        .getMany();

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }

  async sendTravelPrice(price: string, user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          user: { id: user_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }

      if (requests.userBargain > 2)
        throw HttpException.badRequest("Bargain limit exceed");
      await this.travelRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          lastActionBy: Role.USER,
          userBargain: requests.userBargain + 1,
        },
      );
      return Message.priceSent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async sendGuidePrice(price: string, user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          users: { id: user_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          lastActionBy: Role.USER,
        },
      );
      return Message.priceSent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async acceptTravelRequest(user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }

      const travel = await this.travelrepo.findOneBy({
        id: requestId,
      });
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel.id },
          user: { id: user.id },
          status: RequestStatus.PENDING,
        },
      });

      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.ACCEPTED,
          lastActionBy: Role.USER,
        },
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async acceptGuideRequest(user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const requests = await this.guideRequestRepo.findOne({
        where: {
          users: { id: user_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.ACCEPTED,
          lastActionBy: Role.USER,
        },
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async cancelGuideRequest(user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const requests = await this.guideRequestRepo.findOne({
        where: {
          users: { id: user_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      await this.guideRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.CANCELLED,
          lastActionBy: Role.USER,
        },
      );
      return cancelRequest("Guide");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async cancelTravelRequest(user_id: string, requestId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          user: { id: user_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      await this.travelRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.CANCELLED,
          lastActionBy: Role.USER,
        },
      );
      return cancelRequest("Travel");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async getTravelLocation(user_id: string, travel_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const travel = await this.travelrepo.findOneBy({
        id: travel_id,
      });
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }

      const isAccepted = await this.travelRequestRepo.findOneBy({
        user: { id: user_id },
        travel: { id: travel_id },
        status: RequestStatus.ACCEPTED,
      });
      if (!isAccepted) {
        throw HttpException.notFound("The request is not completed");
      }
      const data = await this.locationRepo.findOneBy({
        travel: { id: travel_id },
      });

      if (!data) {
        throw HttpException.notFound("Travel location not found");
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async getGuideLocation(user_id: string, guide_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const guide = await this.guideRepo.findOneBy({
        id: guide_id,
      });
      if (!guide) {
        throw HttpException.notFound("Guide not found");
      }

      const isAccepted = await this.guideRequestRepo.findOneBy({
        users: { id: user_id },
        guide: { id: guide_id },
        status: RequestStatus.ACCEPTED,
      });
      if (!isAccepted) {
        throw HttpException.notFound("The request is not completed");
      }
      const data = await this.locationRepo.findOneBy({
        guide: { id: guide_id },
      });

      if (!data) {
        throw HttpException.notFound("Guide location not found");
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async getGuideProfile(user_id: string, guide_id: string) {
    try {
      const user = await this.userRepo.findOneBy({
        id: user_id,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const guide = await this.guideRepo.findOne({
        where: {
          id: guide_id,
        },
        relations: ["details", "kyc"],
      });
      if (!guide) {
        throw HttpException.notFound("Guide not found");
      }

      return guide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async advancePaymentForTravel(
    userId: string,
    requestId: string,
    amount: number,
  ) {
    try {
      const totalAmount = amount * 100;
      const user = await this.userRepo.findOneBy({
        id: userId,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const request = await this.travelRequestRepo.findOneBy({
        id: requestId,
      });
      if (!request) {
        throw HttpException.notFound("Travel not found");
      }

      const stripe = new Stripe(DotenvConfig.STRIPE_SECRET);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "npr",
        payment_method_types: ["card"],
      });
      if (paymentIntent) {
        await this.travelRequestRepo.update(
          {
            id: request.id,
          },
          {
            status: RequestStatus.ACCEPTED,
          },
        );
      }
      const room = await roomService.checkRoomWithTravel(
        userId,
        request.travel.id,
      );

      return paymentIntent.client_secret;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async advancePaymentForTravelWithEsewa(
    userId: string,
    requestId: string,
    token: string,
  ) {
    console.log("🚀 ~ UserService ~ userId:", userId);
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const request = await this.travelRequestRepo.findOne({
        where: { id: requestId },
        relations: ["travel"],
      });
      if (!request) {
        throw HttpException.notFound("Request not found");
      }

      const payment = await esewaService.verifyPayment(token);

      console.log(payment?.verifiedData);
      if (payment) {
        await this.travelRequestRepo.update(
          { id: request.id },
          { status: RequestStatus.ACCEPTED, paymentType: PaymentType.ESEWA },
        );

        const room = await roomService.checkRoomWithTravel(
          userId,
          request.travel.id,
        );
        const notification = this.notificationRepo.create({
          message: `${user.firstName} ${user.middleName} ${user.lastName} has accepted the price check it out! `,
          senderUser: user,
          receiverTravel: request.travel,
        });

        await this.notificationRepo.save(notification);
        io.to(notification.receiverTravel.id).emit(
          "notification",
          notification,
        );
        return booked("Travel");
      } else {
        throw HttpException.badRequest("Payment unsuccessful");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occurred");
      }
    }
  }

  async advancePaymentForTravelWithKhalti(
    userId: string,
    requestId: string,
    id: string,
  ) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }

      const request = await this.travelRequestRepo.findOne({
        where: { id: requestId },
        relations: ["travel"],
      });
      if (!request) {
        throw HttpException.notFound("Request not found");
      }
      const payment = await khaltiService.verifyPayment(id);
      if (payment) {
        await this.travelRequestRepo.update(
          { id: request.id },
          { status: RequestStatus.ACCEPTED, paymentType: PaymentType.KHALTI },
        );
        const notification = this.notificationRepo.create({
          message: `${user.firstName} ${user?.middleName} ${user.lastName} has accepted the price check it out! `,
          senderUser: user,
          receiverTravel: request.travel,
        });
        const room = await roomService.checkRoomWithTravel(
          userId,
          request.travel.id,
        );

        const saveNotification = await this.notificationRepo.save(notification);
        console.log(saveNotification);
        const notifications = await this.notificationRepo.find({
          where: {
            receiverTravel: { id: request.travel.id },
          },
        });
        io.to(saveNotification.receiverTravel.id).emit(
          "notification",
          notifications,
        );
        return booked("Travel");
      } else {
        throw HttpException.badRequest("Payment unsuccessful");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occurred");
      }
    }
  }

  async getAllNotifications(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const notifications = await this.notificationRepo.findBy({
        receiverUser: { id: userId },
      });
      if (!notifications) {
        throw HttpException.notFound("No notifications yet");
      }
      return notifications;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async readNotification(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.notificationRepo.update(
        { receiverUser: { id: userId } },
        { isRead: true },
      );

      const notifications = await this.notificationRepo.findBy({
        receiverUser: { id: userId },
      });
      io.to(userId).emit("notification", notifications);
      return notifications;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async advancePaymentForGuideWithEsewa(
    userId: string,
    requestId: string,
    token: string,
  ) {
    console.log("🚀 ~ UserService ~ userId:", requestId);
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }

      const request = await this.guideRequestRepo.findOne({
        where: { id: requestId },
        relations: ["guide"],
      });
      if (!request) {
        throw HttpException.notFound("Request not found");
      }
      console.log("🚀 ~ UserService ~ request:", request);
      const payment = await esewaService.verifyPayment(token);
      console.log(payment?.verifiedData);
      if (payment) {
        console.log("done 1");
        await this.guideRequestRepo.update(
          { id: request.id },
          { status: RequestStatus.ACCEPTED, paymentType: PaymentType.ESEWA },
        );
        console.log("done 2");

        await roomService.checkRoomWithGuide(userId, request.guide.id);
        console.log("done 3");

        return booked("Guide");
      } else {
        throw HttpException.badRequest("Payment unsuccessful");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occurred");
      }
    }
  }

  async advancePaymentForGuide(
    userId: string,
    requestId: string,
    amount: number,
  ) {
    try {
      const totalAmount = amount * 100;
      const user = await this.userRepo.findOneBy({
        id: userId,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const request = await this.guideRequestRepo.findOneBy({
        id: requestId,
      });
      if (!request) {
        throw HttpException.notFound("Travel not found");
      }

      const stripe = new Stripe(DotenvConfig.STRIPE_SECRET);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "npr",
        payment_method_types: ["card"],
      });
      if (paymentIntent) {
        await this.guideRequestRepo.update(
          {
            id: request.id,
          },
          {
            status: RequestStatus.ACCEPTED,
          },
        );
      }
      return paymentIntent.client_secret;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async activeUser(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.userRepo.update({ id: userId }, { available: true });

      io.to(userId).emit("user-active", { userId, active: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async offlineUser(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.userRepo.update({ id: userId }, { available: false });

      io.to(userId).emit("user-active", { userId, active: false });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getUnreadChatCount(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.badRequest("You are not authorized");
      const chatCount = await this.chatRepo.findAndCount({where:{
        receiverUser:user
      }})
      console.log("🚀 ~ UserService ~ getUnreadChatCount ~ chatCount:", chatCount)
      io.to(userId).emit("chat-count", chatCount)
      return

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}

export default new UserService();
