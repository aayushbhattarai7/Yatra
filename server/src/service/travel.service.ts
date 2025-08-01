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
import { ActiveStatus, FileType, Gender, MediaType, ReportStatus, RequestStatus, Role } from "../constant/enum";
import { TravelDetails } from "../entities/travels/travelDetails.entity";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { User } from "../entities/user/user.entity";
import { LocationDTO } from "../dto/location.dto";
import { Location } from "../entities/location/location.entity";
import { acceptRequest, Message, registeredMessage, rejectRequest, updatedMessage } from "../constant/message";
import { LoginDTO } from "../dto/login.dto";
import { In, Not } from "typeorm";
import { Notification } from "../entities/notification/notification.entity";
import { io } from "../socket/socket";
import ReportFile from "../entities/user/reportFile.entity";
import { Report } from "../entities/user/report.entity";
import { Chat } from "../entities/chat/chat.entity";
import { GuideProfileDTO } from "../dto/guideProfile.dto";
import { transferTravelImageFromUploadToTemp } from "../utils/path.utils";

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
    private readonly chatRepo = AppDataSource.getRepository(Chat),

    private readonly reportRepo = AppDataSource.getRepository(Report),
    private readonly reportFileRepo = AppDataSource.getRepository(ReportFile),
  ) { }

  async create(image: any[], data: TravelDTO): Promise<string> {
    console.log("🚀 ~ TravelService ~ create ~ data:", data)
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

  async updateProfile(
    id: string,
    data: GuideProfileDTO,
    images: any
  ) {
    try {
      const travel = await this.travelrepo.findOne({
        where: { id },
      });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      await this.travelrepo.update(
        { id },
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          gender: Gender[data.gender as keyof typeof Gender],
        },
      );
      if (images) {
        console.log("🚀 ~ UserService ~ signup ~ images:", images);
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

          const profileImage = images;
          if (!allowedMimeTypes.includes(profileImage.mimetype)) {
            throw HttpException.badRequest(
              "Invalid profile image type. Only jpg, jpeg, and png are accepted.",
            );
          }
          const profileImages = await this.travelKycRepo.findOneBy({
            travels: { id },
            fileType: FileType.PASSPHOTO,
          });
          console.log("🚀 ~ GuideService ~ profileImages:", profileImages)
          if (!profileImages) {
            const image = this.travelKycRepo.create({
              name: profileImage.name,
              mimetype: profileImage.mimetype,
              fileType: FileType.PASSPHOTO,
              travels: travel,
            });
            await this.travelKycRepo.save(image);
            image.transferTravelKycToUpload(travel.id, MediaType.PROFILE);
          } else {
            transferTravelImageFromUploadToTemp(
              profileImages.id,
              profileImages.name,
              profileImages.type,
            );
            profileImages.name = profileImage.name;
            profileImages.mimetype = profileImage.mimetype;
            await this.travelKycRepo.save(profileImages);
            profileImages.transferTravelKycToUpload(travel.id, MediaType.PROFILE);
          }
        }
      return updatedMessage("Profile");
    } catch (error: unknown) {
      console.log("🚀 ~ UserService ~ updateProfile ~ error:", error);
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async sendOtpToChangeEmail(id: string, email: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id });
      if (!travel) throw HttpException.unauthorized("You are not authorized");
      const otp = await otpService.generateOTP();
      const expires = Date.now() + 5 * 60 * 1000;
      const payload = `${id}.${otp}.${expires}`;
      const hashedOtp = hashService.hashOtp(payload);
      const newOtp = `${hashedOtp}.${expires}`;

      await this.travelrepo.update({ id }, { otp: newOtp });
      await otpService.sendOtp(email, otp, expires);
      return "Otp has been sent to your new email please verify your otp";
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async verifyEmail(id: string, email: string, otp: string) {
    console.log("🚀 ~  ero ~ verifyEmail ~ id:", id);
    try {
      const travel = await this.travelrepo.findOneBy({ id });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      const [hashedOtp, expires] = travel?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException.badRequest("Otp is expired");
      const payload = `${id}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid) throw HttpException.badRequest("Invalid OTP");
      await this.travelrepo.update({ id }, { email });
      return "Email changed successfully!.";
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async reSendOtp(email: string): Promise<string> {
    try {
      if (!email) {
        throw HttpException.notFound("Email not found");
      }
      const travel = await this.travelrepo.findOneBy({ email });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

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

  async changePassword(
    password: string,
    confirmPassword: string,
    email: string,
  ): Promise<string> {
    try {
      const user = await this.travelrepo.findOneBy({ email });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      if (password !== confirmPassword)
        throw HttpException.badRequest("passowrd must be same in both field");
      const hashPassword = await bcryptService.hash(password);
      await this.travelrepo.update({ email }, { password: hashPassword });
      return `Your password is updated successfully!.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async updatePassword(
    id: string,
    password: string,
    confirmPassword: string,
    currentPassword: string,
  ): Promise<string> {
    try {
      const travel = await this.travelrepo.findOne({
        where: { id },
        select: ["password"],
      });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      const passwordMatched = await bcryptService.compare(
        currentPassword,
        travel.password,
      );
      if (!passwordMatched)
        throw HttpException.badRequest("Incorrect current password");
      if (password !== confirmPassword)
        throw HttpException.badRequest("passowrd must be same in both field");
      const hashPassword = await bcryptService.hash(password);
      await this.travelrepo.update({ id }, { password: hashPassword });
      return `Your password is updated successfully!.`;
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
          "status"
        ],
      });

      if (!travel)
        throw HttpException.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );


      if (travel.status === ActiveStatus.BANNED) {
        throw HttpException.badRequest(
          "You have been banned from using Yatra, If you have any help contact Yatra support team",
        );
      }
      if (travel.status === ActiveStatus.BLOCKED) {
        throw HttpException.badRequest(
          "You have been temporarily blocked from using Yatra,If you have any help contact Yatra support team",
        );
      }

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
      console.log("🚀 ~ TravelService ~ getTravelDetails ~ travel:", travel)
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

  async completeTravelService(travel_id: string, user_id: string) {
    try {
      const travel = await this.travelrepo.findOne({
        where: {
          id: travel_id,
        },
      });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.notFound("User not found");

      return await AppDataSource.transaction(
        async (transactionEntityManager) => {
          const findTravelService = await transactionEntityManager.findOne(
            this.travelRequestRepo.target,
            {
              where: {
                travel: { id: travel_id },
                user: { id: user_id },
                status: RequestStatus.ACCEPTED,
              },
            },
          );

          if (!findTravelService)
            throw HttpException.notFound("Request not found");

          const update = await transactionEntityManager.update(
            RequestTravel,
            { id: findTravelService.id },
            {
              status: RequestStatus.CONFIRMATION_PENDING,
              lastActionBy: Role.TRAVEL,
            },
          );
          if (update) {
            io.to(user_id).emit("request-travel", findTravelService);
          }
          return `Please wait for user to confirm it`;
        },
      );
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
      const newPrice = parseFloat(price);
      const advancePrice = newPrice * 0.25;

      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          advancePrice: advancePrice,
          lastActionBy: Role.TRAVEL,
          travelBargain: requests.travelBargain + 1,
        },
      );

      if (data) {
        const request = await this.travelRequestRepo.findOne({
          where: {
            travel: { id: travel_id },
            id: requestId,
          },
          relations: ["user"],
        });
        io.to(requests.user.id).emit("request-travel", request);

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
        isRead: false,
      });
      if (!notifications) {
        throw HttpException.notFound("No notifications yet");
      }
      const notificationCount = notifications.length;
      io.to(travelId).emit("notification-count", notificationCount);
      return notificationCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getUnreadChatCount(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.badRequest("You are not authorized");
      const chatCount = await this.chatRepo.find({
        where: {
          receiverTravel: { id: travelId },
          read: false,
        },
      });
      io.to(travelId).emit("chat-count", chatCount.length);
      return chatCount.length;
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
      const updateResult = await this.notificationRepo.update(
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
          status:RequestStatus.PENDING
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          lastActionBy: Role.TRAVEL,
        },
      );
      io.to(requests.user.id).emit("request-travel", data);

      return acceptRequest("Travel");

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
        relations: ["user", "travel", "travel.ratings"],
      });
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

  async getBookings(travelId: string) {
    try {
      const booking = await this.travelRequestRepo.find({
        where: { travel: { id: travelId } },
        relations: ["travel", "user"],
      });
      if (booking.length === 0)
        throw HttpException.notFound("Booking not found");

      return booking;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTotalEarnings(travel_id: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException.unauthorized("you are not authorized");
      }

      const completedRequests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: RequestStatus.COMPLETED,
        },
        relations: ["travel", "user"],
      });

      const total = completedRequests.reduce((sum, request) => {
        const price = parseFloat(request.price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        totalEarnings: total,
        completedRequests,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async purchaseConnects(travelId: string, price: string) {
    try {
      const booking = await this.travelRequestRepo.find({
        where: { travel: { id: travelId } },
        relations: ["travel", "user"],
      });
      if (booking.length === 0)
        throw HttpException.notFound("Booking not found");

      return booking;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async reportUser(id: string, userId: string, message: string, images: any[]) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.notFound("user not found")

      const isReportAlreadyExist = await this.reportRepo.findOne({
        where: {
          reporterTravel: { id },
          reportedUser: user,
          status: ReportStatus.PENDING
        }, relations: ["reportedUser", "reporterTravel"]
      })

      if (isReportAlreadyExist) throw HttpException.badRequest("You have already reported this user recently")

      const report = this.reportRepo.create({
        message,
        reporterTravel: { id },
        reportedUser: user
      })

      await this.reportRepo.save(report)
      if (images) {
        for (const file of images) {

          const files = this.reportFileRepo.create({
            name: file.name,
            mimetype: file.mimetype,
            report: report

          })
          const saveFiles = await this.reportFileRepo.save(files)
          saveFiles.transferImageToUpload(files.id, MediaType.REPORT)
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTotalbookedUsers(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.badRequest("You are not authorized");
      const requests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travelId },
          status: RequestStatus.COMPLETED
        }, relations: ["user", "user.image"]
      });
      return requests;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTravelTotalRevenue(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.badRequest("Travel not found");

      const completedRequests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travelId },
          status: RequestStatus.COMPLETED,
        },
        select: ["price"],
      });

      const prices = completedRequests.map((req) => parseFloat(req.price));
      const totalRevenue = prices.reduce((sum, price) => sum + price, 0);

      return parseFloat(totalRevenue.toFixed(2));
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Failed to fetch guide revenue",
      );
    }
  }

  async getTravelGroupedRevenue(travelId: string) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.badRequest("Travel not found");

      const completedRequests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travelId },
          status: RequestStatus.COMPLETED,
        },
      });

      const daily: Record<string, number> = {};
      const weekly: Record<string, number> = {};
      const monthly: Record<string, number> = {};
      const yearly: Record<string, number> = {};

      completedRequests.forEach((req) => {
        const date = new Date(req.updatedAt);
        const price = parseFloat(req.price);

        const day = date.toISOString().split("T")[0];
        const week = `${this.getStartOfWeek(date)} to ${this.getEndOfWeek(date)}`;
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const year = String(date.getFullYear());

        daily[day] = (daily[day] || 0) + price;
        weekly[week] = (weekly[week] || 0) + price;
        monthly[month] = (monthly[month] || 0) + price;
        yearly[year] = (yearly[year] || 0) + price;
      });

      return {
        daily: Object.entries(daily).map(([name, revenue]) => ({ name, revenue })),
        weekly: Object.entries(weekly).map(([name, revenue]) => ({ name, revenue })),
        monthly: Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })),
        yearly: Object.entries(yearly).map(([name, revenue]) => ({ name, revenue })),
      };
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Failed to fetch grouped guide revenue"
      );
    }
  }
  getStartOfWeek(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  }

  getEndOfWeek(date: Date): string {
    const start = new Date(this.getStartOfWeek(date));
    const sunday = new Date(start);
    sunday.setDate(start.getDate() + 6);
    return sunday.toISOString().split("T")[0];
  }
}
export default new TravelService();
