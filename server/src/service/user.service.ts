import { UserDTO } from "../dto/user.dto";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import BcryptService from "./bcrypt.service";
const bcryptService = new BcryptService();
import HttpException from "../utils/HttpException.utils";
import { LocationDTO } from "../dto/location.dto";
import { Location } from "../entities/location/location.entity";
import { Gender, RequestStatus, Role } from "../constant/enum";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { GuideRequestDTO } from "../dto/requestGuide.dto";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { TravelRequestDTO } from "../dto/requestTravel.dto";
import { EmailService } from "./email.service";
import { DotenvConfig } from "../config/env.config";
import Stripe from "stripe";
const emailService = new EmailService();
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
  ) {}

  async signup(data: UserDTO) {
    try {
      const emailExist = await this.userRepo.findOneBy({ email: data.email });
      if (emailExist)
        throw HttpException.notFound("Entered Email is not registered yet");

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
      return addUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async login(data: UserDTO): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "password", "role"],
      });

      if (!user)
        throw HttpException.notFound(
          "The email you provided is not registered yet, please try with the registered one or create new account",
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
      const users = this.userRepo
        .createQueryBuilder("user")
        .where("user.id =:id", { id });
      const user = await users.getOne();
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
        where: { verified: true, approved: true },
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

  async requestGuide(user_id: string, guide_id: string, data: GuideRequestDTO) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized user");
      }
      console.log(guide_id);
      const guide = await this.guideRepo.findOneBy({
        id: guide_id,
        approved: true,
        verified: true,
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
        throw HttpException.badRequest("Request already sent to this guide");
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
        subject: `${user.firstName} sent you a travel request`,
        html: `Hey ${user.firstName} ${user.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
      });
      return request;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError("An unknown error occured");
      }
    }
  }

  async requestTravel(
    user_id: string,
    travel_id: string,
    data: TravelRequestDTO,
  ) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) {
        throw HttpException.unauthorized("You are not authorized user");
      }

      const travel = await this.travelrepo.findOneBy({
        id: travel_id,
      });

      const findRequest = await this.travelRequestRepo.find({
        where: {
          user: { id: user_id },
          travel: { id: travel_id },
        },
      });
      console.log("🚀 ~ UserService ~ findRequest:", findRequest);
      if (findRequest.length > 0) {
        throw HttpException.badRequest(
          "Request already sent to this travel, Please wait a while for your verification",
        );
      }
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }

      const request = this.travelRequestRepo.create({
        from: data.from,
        to: data.to,
        totalDays: data.totalDays,
        totalPeople: data.totalPeople,
        vehicletype: data.vehicleType,
        user: user,
        travel: travel,
      });
      await this.travelRequestRepo.save(request);
      await emailService.sendMail({
        to: travel.email,
        text: "Request Incomming",
        subject: `${user.firstName} sent you a travel request`,
        html: `Hey ${user.firstName} ${user.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
      });
      return;
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
      const data = await this.travelRequestRepo.find({
        where: {
          user: { id: user_id },
        },
        relations: ["travel"],
      });
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
      const data = await this.guideRequestRepo.find({
        where: {
          users: { id: user_id },
        },
        relations: ["guide"],
      });
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
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          lastActionBy: Role.USER,
        },
      );
      return data;
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
      console.log(price);
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
      return data;
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
          userStatus: RequestStatus.PENDING,
        },
      });
      console.log(
        "🚀 ~ UserService ~ acceptTravelRequest ~ requests:",
        requests,
      );
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          userStatus: RequestStatus.ACCEPTED,
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
          userStatus: RequestStatus.ACCEPTED,
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
        userStatus: RequestStatus.ACCEPTED,
        travelStatus: RequestStatus.ACCEPTED,
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
        userStatus: RequestStatus.ACCEPTED,
        guideStatus: RequestStatus.ACCEPTED,
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

  async advancePaymentForTravel(
    userId: string,
    travelId: string,
    amount: number,
  ) {
    try {

        const user = await this.userRepo.findOneBy({
        id: userId,
      });
      if (!user) {
        throw HttpException.unauthorized("User not found");
      }
      const travel = await this.travelrepo.findOneBy({
        id: travelId,
      });
      if (!travel) {
        throw HttpException.notFound("Travel not found");
      }

      const stripe = new Stripe(DotenvConfig.STRIPE_SECRET);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      if (paymentIntent) {
        await this.travelRequestRepo.update({
          user:{id:user.id}
        }, {
          userStatus:RequestStatus.ACCEPTED
        })
      }
      return paymentIntent!;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
}

export default UserService;
