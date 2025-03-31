import HttpException from "../utils/HttpException.utils";
import { passwordRegex } from "../utils/regex.utils";
import { emailRegex } from "../utils/regex.utils";
import { TravelDTO } from "../dto/travel.dto";
import { AppDataSource } from "../config/database.config";
import bcryptService from "./bcrypt.service";
import OtpService from "../utils/otp.utils";
import { HashService } from "./hash.service";
import { Travel } from "../entities/travels/travel.entity";
import TravelKyc from "../entities/travels/travelKyc.entity";
import { FileType, Gender, RequestStatus, Role } from "../constant/enum";
import { TravelDetails } from "../entities/travels/travelDetails.entity";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { User } from "../entities/user/user.entity";
import { LocationDTO } from "../dto/location.dto";
import { Location } from "../entities/location/location.entity";
import { Message, registeredMessage, rejectRequest } from "../constant/message";
import { LoginDTO } from "../dto/login.dto";
import { In, Not } from "typeorm";
import { Notification } from "../entities/notification/notification.entity";
import { io } from "../socket/socket";

const hashService = new HashService();
const otpService = new OtpService();
class TravelService {
  constructor(
    private readonly travelrepo = AppDataSource.getRepository(Travel),
    private readonly travelDetailsrepo = AppDataSource.getRepository(
      TravelDetails,
    ),
    private readonly locationRepo = AppDataSource.getRepository(Location),
    private readonly travelRequestRepo = AppDataSource.getRepository(
      RequestTravel,
    ),
    private readonly travelKycRepo = AppDataSource.getRepository(TravelKyc),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification,
    ),
  ) {}

  async create(image: any[], data: TravelDTO): Promise<string> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          const emailExist = await transactionalEntityManager.findOne(
            this.travelrepo.target,
            {
              where: { email: data.email },
            },
          );
          if (emailExist)
            throw HttpException.badRequest(
              "Entered email is already registered",
            );
          if (!data.email || !data.firstName || !data.lastName)
            throw HttpException.badRequest(
              "Please fill all the required fields",
            );

          if (!emailRegex.test(data.email)) {
            throw HttpException.badRequest("Please enter a valid email");
          }
          if (!passwordRegex.test(data.password)) {
            throw HttpException.badRequest(
              "Password requires an uppercase, digit, and special char.",
            );
          }
          const otp = await otpService.generateOTP();
          const expires = Date.now() + 5 * 60 * 1000;
          const payload = `${data.email}.${otp}.${expires}`;
          const hashedOtp = hashService.hashOtp(payload);
          const newOtp = `${hashedOtp}.${expires}`;
          const travel = transactionalEntityManager.create(
            this.travelrepo.target,
            {
              email: data.email,
              password: await bcryptService.hash(data.password),
              firstName: data.firstName,
              middleName: data?.middleName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              vehicleType: data.vehicleType,
              gender: Gender[data.gender as keyof typeof Gender],
              otp: newOtp,
            },
          );
          await transactionalEntityManager.save(this.travelrepo.target, travel);
          const traveldetails = transactionalEntityManager.create(
            this.travelDetailsrepo.target,
            {
              DOB: data.DOB,
              nationality: data.nationality,
              province: data.province,
              district: data.district,
              municipality: data.municipality,
              engineNumber: data.engineNumber,
              chasisNumber: data.chasisNumber,
              vehicleNumber: data.vehicleNumber,

              citizenshipId: data?.citizenshipId,
              citizenshipIssueDate: data?.citizenshipIssueDate,
              citizenshipIssueFrom: data?.citizenshipIssueFrom,
              passportId: data?.passportId,
              passportIssueDate: data?.passportIssueDate,
              passportExpiryDate: data?.passportExpiryDate,
              passportIssueFrom: data?.passportIssueFrom,
              voterId: data?.voterId,
              voterAddress: data?.voterAddress,
              travelz: travel,
            },
          );
          await transactionalEntityManager.save(
            this.travelDetailsrepo.target,
            traveldetails,
          );
          if (!travel) {
            throw HttpException.badRequest("Error Occured");
          } else {
            if (image) {
              const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
              for (const key in image) {
                const file = image[key];

                if (!allowedMimeTypes.includes(file.mimetype)) {
                  throw HttpException.badRequest(
                    "Invalid image type. Only jpg, jpeg, and png are accepted.",
                  );
                }

                const kyc = transactionalEntityManager.create(
                  this.travelKycRepo.target,
                  {
                    name: file.name,
                    mimetype: file.mimetype,
                    type: file.type,
                    fileType: file.fileType,
                    travels: travel,
                  },
                );

                const savedImage = await transactionalEntityManager.save(
                  this.travelKycRepo.target,
                  kyc,
                );
                savedImage.transferTravelKycToUpload(
                  travel.id,
                  savedImage.type,
                );
              }
              if (travel) {
                const location = transactionalEntityManager.create(
                  this.locationRepo.target,
                  {
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                    travel: travel,
                  },
                );

                await transactionalEntityManager.save(
                  this.locationRepo.target,
                  location,
                );
              }
              await otpService.sendOtp(travel.email, otp, expires);
            } else {
              throw HttpException.badRequest(
                "Pleas provide all necessary items.",
              );
            }
          }

          return registeredMessage("Travel");
        } catch (error: unknown) {
          console.log(error);
          if (error instanceof Error) {
            throw HttpException.badRequest(error?.message);
          } else {
            throw HttpException.internalServerError;
          }
        }
      },
    );
  }

  async reSendOtp(email: string): Promise<string> {
    try {
      if (!email) {
        throw HttpException.notFound("Email not found");
      }
      const travel = await this.travelrepo.findOneBy({ email });
      if (!travel) throw HttpException.unauthorized("You are not authorized");
      if (travel.verified)
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      const otp = await otpService.generateOTP();
      const expires = Date.now() + 5 * 60 * 1000;
      const payload = `${email}.${otp}.${expires}`;
      const hashedOtp = hashService.hashOtp(payload);
      const newOtp = `${hashedOtp}.${expires}`;

      await this.travelrepo.update({ email }, { otp: newOtp });
      await otpService.sendOtp(travel.email, otp, expires);
      return `Otp sent to ${email} successfully`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async verifyUser(email: string, otp: string): Promise<string> {
    try {
      const travel = await this.travelrepo.findOneBy({ email });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      if (travel.verified === true) {
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      }
      const [hashedOtp, expires] = travel?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException.badRequest("Otp ie expired");

      const payload = `${email}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid) throw HttpException.badRequest("Invalid OTP");
      await this.travelrepo.update({ email }, { verified: true });
      return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async loginTravel(data: LoginDTO) {
    try {
      const travel = await this.travelrepo.findOne({
        where: [{ email: data.email }],
        select: [
          "id",
          "email",
          "password",
          "phoneNumber",
          "approved",
          "verified",
          "firstName",
          "middleName",
          "lastName",
          "role",
        ],
      });

      if (!travel)
        throw HttpException.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );
      if (!travel.verified) {
        await this.reSendOtp(travel.email);
      }

      if (!travel.approved) {
        throw HttpException.badRequest(
          "Your account is not approved yet please wait less than 24 hours to get approval",
        );
      }
      const passwordMatched = await bcryptService.compare(
        data.password,
        travel.password,
      );
      if (!passwordMatched) {
        throw HttpException.badRequest("Password didnot matched");
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

  async getRequests(travel_id: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
      }

      const requests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: Not(
            In([
              RequestStatus.COMPLETED,
              RequestStatus.REJECTED,
              RequestStatus.CANCELLED,
            ]),
          ),
        },
        relations: ["user", "travel"],
      });
      console.log("🚀 ~ TravelService ~ getRequests ~ requests:", requests)
      return requests;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTravelDetails(travel_id: string) {
    try {
      const travel = await this.travelrepo.findOne({
        where: {
          id: travel_id,
        },
        relations: ["details", "kyc"],
      });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
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
  async completeTravelService(travel_id: string, user_id:string) {
    try {
      const travel = await this.travelrepo.findOne({
        where: {
          id: travel_id,
        }
      });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const user = await this.userRepo.findOneBy({id:user_id})
      if(!user) throw HttpException.notFound("User not found")

        return await AppDataSource.transaction(
          async (transactionEntityManager) => {
            const findTravelService = await transactionEntityManager.findOne(
              this.travelRequestRepo.target,{
                where:{
                  travel:{id:travel_id},
                  user:{id:user_id},
                  status:RequestStatus.ACCEPTED
                }
              }
            )

if(!findTravelService) throw HttpException.notFound("Request not found")

  const update =await transactionEntityManager.update(
    RequestTravel,
    { id: findTravelService.id }, 
    { status: RequestStatus.CONFIRMATION_PENDING, 
      lastActionBy:Role.TRAVEL
     } 
  );
if(update){

  io.to(user_id).emit("request-travel", findTravelService)
}
return `Please wait for user to confirm it`
  }
)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async sendPrice(price: string, travel_id: string, requestId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
        relations: ["user"],
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      if (requests.travelBargain > 2)
        throw HttpException.badRequest("Bargain limit exceed");

      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          lastActionBy: Role.TRAVEL,
          travelBargain: requests.travelBargain + 1,
        },
      );

      if (data) {
        const notification = this.notificationRepo.create({
          message: `Travel ${requests.user.firstName} sent you a price for the trip that you requested recently`,
          receiverUser: requests.user,
          senderTravel: requests.travel,
        });
        await this.notificationRepo.save(notification);
        const notifications = await this.notificationRepo.findBy({
          receiverUser: { id: requests.user.id },
        });
        if (!notifications) {
          throw HttpException.notFound("Notifications not found");
        }
        io.to(requests.user.id).emit("notification", notifications);
      }
      return Message.priceSent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getAllNotifications(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }
      const notifications = await this.notificationRepo.findBy({
        receiverTravel: { id: travelId },
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
  async getUnreadNotificationsCount(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }
      const notifications = await this.notificationRepo.findBy({
        receiverTravel: { id: travelId },
        isRead:false
      });
      if (!notifications) {
        throw HttpException.notFound("No notifications yet");
      }
      const notificationCount = notifications.length
io.to(travelId).emit("notification-count", notificationCount)
      return notificationCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async readNotification(travel_id: string) {
    try {
      const user = await this.travelrepo.findOneBy({ id: travel_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
    const updateResult =  await this.notificationRepo.update(
        { receiverTravel: { id: travel_id } },
        { isRead: true },
      );

      if (updateResult.affected && updateResult.affected > 0) {
        io.to(travel_id).emit("notification-updated", { unreadCount: 0 });
      }
  
      return updateResult;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async acceptRequest(travel_id: string, requestId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.ACCEPTED,
          lastActionBy: Role.TRAVEL,
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

  async rejectRequest(travel_id: string, requestId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.unauthorized("You are not authorized");
      }

      const request = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
      });
      if (!request) {
        throw HttpException.notFound("Request not found");
      }

      await this.travelRequestRepo.update(
        { id: request.id },
        {
          status: RequestStatus.REJECTED,
          lastActionBy: Role.TRAVEL,
        },
      );
      return rejectRequest("Travel");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async addLocation(travel_id: string, data: LocationDTO) {
    try {
      console.log("yess");
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) throw HttpException.unauthorized("you are not authorized");
      const isLocation = await this.locationRepo.findOneBy({
        travel: { id: travel_id },
      });
      if (isLocation) {
        const location = await this.locationRepo.update(
          {
            travel: travel,
          },
          {
            latitude: data.latitude,
            
            longitude: data.longitude,
          },
        );
        if (location) {
          const travelLocation = await this.travelrepo.findOne({
            where: { id: travel_id },
            relations: ["location"],
          });
          io.emit("travels", {
            location: travelLocation?.location,
            id: travelLocation?.id,
          });
          console.log(
            "🚀 ~ TravelService ~ addLocation ~ travelLocation:",
            travelLocation,
          );
        }
        return Message.locationSent;
      } else {
        const location = this.locationRepo.create({
          latitude: data.latitude,
          longitude: data.longitude,
          travel: travel,
        });
        await this.locationRepo.save(location);
        const travelLocation = await this.travelrepo.findOne({
          where: { id: travel_id },
          relations: ["location"],
        });

        io.emit("travels", { location: travelLocation, id: travel_id });

        return Message.locationSent;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getHistory(travel_id: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
      }
      console.log(travel);
      const requests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: In([
            RequestStatus.COMPLETED,
            RequestStatus.REJECTED,
            RequestStatus.CANCELLED,
          ]),
        },
        relations: ["user", "travel"],
      });
      console.log("🚀 ~ TravelService ~ getHistory ~ requests:", requests);

      return requests;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async activeUser(userId: string) {
    try {
      const user = await this.travelrepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.travelrepo.update({ id: userId }, { available: true });

      const activeTravel = await this.getAllActiveUsers();
      io.emit("active-travel", activeTravel);
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
      const user = await this.travelrepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.travelrepo.update({ id: userId }, { available: false });

      const activeTravel = await this.getAllActiveUsers();
      io.emit("active-travel", activeTravel);
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getAllActiveUsers() {
    const activeTravel = await this.travelrepo.findBy({ available: true });

    if (!activeTravel) return null;

    return activeTravel;
  }
}
export default new TravelService();
