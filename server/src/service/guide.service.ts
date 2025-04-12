import HttpException from "../utils/HttpException.utils";
import { passwordRegex } from "../utils/regex.utils";
import { emailRegex } from "../utils/regex.utils";
import { GuideDTO } from "../dto/guide.dto";
import { AppDataSource } from "../config/database.config";
import { Guide } from "../entities/guide/guide.entity";
import bcryptService from "./bcrypt.service";
import GuideKYC from "../entities/guide/guideKyc.entity";
import OtpService from "../utils/otp.utils";
import { HashService } from "./hash.service";
import { Gender, MediaType, ReportStatus, RequestStatus, Role } from "../constant/enum";
import { Location } from "../entities/location/location.entity";
import { GuideDetails } from "../entities/guide/guideDetails.entity";
import { LocationDTO } from "../dto/location.dto";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { io } from "../socket/socket";
import { LoginDTO } from "../dto/login.dto";
import { Message, rejectRequest } from "../constant/message";
import { In, Not } from "typeorm";
import { Notification } from "../entities/notification/notification.entity";
import { User } from "../entities/user/user.entity";
import ReportFile from "../entities/user/reportFile.entity";
import { Report } from "../entities/user/report.entity";
const hashService = new HashService();
const otpService = new OtpService();
class GuideService {
  constructor(
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly locationRepo = AppDataSource.getRepository(Location),
    private readonly guideDetailsrepo = AppDataSource.getRepository(
      GuideDetails,
    ),
    private readonly guideRequestRepo = AppDataSource.getRepository(
      RequestGuide,
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification,
    ),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly guideKycRepo = AppDataSource.getRepository(GuideKYC),
    private readonly reportRepo = AppDataSource.getRepository(Report),
    private readonly reportFileRepo = AppDataSource.getRepository(ReportFile),
  ) {}

  async create(image: any[], data: GuideDTO): Promise<Guide> {
    console.log("🚀 ~ GuideService ~ create ~ data:", data);
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          const emailExist = await transactionalEntityManager.findOne(
            this.guideRepo.target,
            { where: { email: data.email } },
          );
          if (emailExist)
            throw HttpException.badRequest(
              "Entered email is already registered",
            );

          if (!data.email || !data.firstName || !data.lastName)
            throw HttpException.badRequest(
              "Please fill all the required fields",
            );

          if (!emailRegex.test(data.email))
            throw HttpException.badRequest("Please enter a valid email");

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

          const guide = transactionalEntityManager.create(
            this.guideRepo.target,
            {
              email: data.email,
              password: await bcryptService.hash(data.password),
              firstName: data.firstName,
              middleName: data?.middleName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              gender: Gender[data.gender as keyof typeof Gender],
              otp: newOtp,
            },
          );

          const saves = await transactionalEntityManager.save(
            this.guideRepo.target,
            guide,
          );

          const guidedetails = transactionalEntityManager.create(
            this.guideDetailsrepo.target,
            {
              DOB: data.DOB,
              nationality: data.nationality,
              province: data.province,
              district: data.district,
              municipality: data.municipality,
              licenseNumber: data.licenseNumber,
              licenseValidityFrom: data.licenseValidityFrom,
              licenseValidityTo: data.licenseValidityTo,
              citizenshipId: data?.citizenshipId,
              citizenshipIssueDate: data?.citizenshipIssueDate,
              citizenshipIssueFrom: data?.citizenshipIssueFrom,
              passportId: data?.passportId,
              passportIssueDate: data?.passportIssueDate,
              passportExpiryDate: data?.passportExpiryDate,
              passportIssueFrom: data?.passportIssueFrom,
              voterId: data?.voterId,
              voterAddress: data?.voterAddress,
              guide: saves,
            },
          );

          await transactionalEntityManager.save(
            this.guideDetailsrepo.target,
            guidedetails,
          );

          if (!saves) throw HttpException.badRequest("Error Occurred");

          if (image) {
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
            for (const key in image) {
              const file = image[key];
              console.log(file, "-----------------------------");
              console.log(file.mimetype);
              if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error(
                  "Invalid image type. Only jpg, jpeg, and png are accepted.",
                );
              }
              const kyc = transactionalEntityManager.create(
                this.guideKycRepo.target,
                {
                  name: file.name,
                  mimetype: file.mimetype,
                  type: file.type,
                  fileType: file.fileType,
                  guide: saves,
                },
              );

              const savedImage = await transactionalEntityManager.save(
                this.guideKycRepo.target,
                kyc,
              );

              console.log("Saved Image:", savedImage);
              savedImage.transferKycToUpload(saves.id, savedImage.type);
            }

            const location = transactionalEntityManager.create(
              this.locationRepo.target,
              {
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                guide: saves,
              },
            );

            await transactionalEntityManager.save(
              this.locationRepo.target,
              location,
            );

            await otpService.sendOtp(saves.email, otp, expires);
          } else {
            throw HttpException.badRequest(
              "Please provide all necessary items.",
            );
          }

          return saves;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error);
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
      const guide = await this.guideRepo.findOneBy({ email });
      if (!guide) throw HttpException.unauthorized("You are not authorized");
      if (guide.verified)
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      const otp = await otpService.generateOTP();
      const expires = Date.now() + 5 * 60 * 1000;
      const payload = `${email}.${otp}.${expires}`;
      const hashedOtp = hashService.hashOtp(payload);
      const newOtp = `${hashedOtp}.${expires}`;

      await this.guideRepo.update({ email }, { otp: newOtp });
      await otpService.sendOtp(guide.email, otp, expires);
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
      const guide = await this.guideRepo.findOneBy({ email });
      if (!guide) throw HttpException.unauthorized("You are not authorized");

      if (guide.verified === true) {
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      }
      const [hashedOtp, expires] = guide?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException.badRequest("Otp ie expired");

      const payload = `${email}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid) throw HttpException.badRequest("Invalid OTP");
      await this.guideRepo.update({ email }, { verified: true });
      return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async loginGuide(data: LoginDTO) {
    console.log("uuaauau");
    try {
      const guide = await this.guideRepo.findOne({
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
      if (!guide)
        throw HttpException.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );
      if (!guide.verified) {
        throw HttpException.badRequest(
          "You are not verified, please verify your email first",
        );
      }

      if (!guide.approved) {
        throw HttpException.badRequest(
          "Your account is not approved yet please wait less than 24 hours to get approval",
        );
      }
      const passwordMatched = await bcryptService.compare(
        data.password,
        guide.password,
      );
      if (!passwordMatched) {
        throw HttpException.badRequest("Password didnot matched");
      }
      return guide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async addLocation(guide_id: string, data: LocationDTO) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) throw HttpException.unauthorized("you are not authorized");
      const isLocation = await this.locationRepo.findOneBy({
        guide: { id: guide_id },
      });
      if (isLocation) {
        const updateLocation = await this.locationRepo.update(
          {
            id: isLocation.id,
            guide: { id: guide_id },
          },
          {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        );
        if (updateLocation) {
          const guideLocation = await this.guideRepo.findOne({
            where: { id: guide_id },
            relations: ["location"],
          });
          io.emit("guides", {
            location: guideLocation?.location,
            id: guideLocation?.id,
          });
        }
        return Message.locationSent;
      } else {
        const addLocation = this.locationRepo.create({
          latitude: data.latitude,
          longitude: data.longitude,
          guide: guide,
        });
        await this.locationRepo.save(addLocation);
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

  async getRequests(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const requests = await this.guideRequestRepo.find({
        where: {
          guide: { id: guide_id },
          status: Not(
            In([
              RequestStatus.COMPLETED,
              RequestStatus.REJECTED,
              RequestStatus.CANCELLED,
            ]),
          ),
        },
        relations: ["users"],
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
  async getGuideDetails(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOne({
        where: {
          id: guide_id,
        },
        relations: ["details", "kyc"],
      });
      console.log("🚀 ~ GuideService ~ getGuideDetails ~ guide:", guide);
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      return guide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getHistory(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const requests = await this.guideRequestRepo.find({
        where: {
          guide: { id: guide_id },
          status: RequestStatus.COMPLETED,
        },
        relations: ["users"],
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

  async sendPrice(price: string, guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
          id: requestId,
        },
        relations: ["users", "guide"],
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      if (requests.guideBargain > 2)
        throw HttpException.badRequest("Bargain limit exceed");
      const newPrice = parseFloat(price);
      const advancePrice = newPrice * 0.25;
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          advancePrice: advancePrice,
          lastActionBy: Role.GUIDE,
        },
      );
      if (data) {
        const request = await this.guideRequestRepo.findOne({
          where: { id: requestId },
          relations: ["users", "guide"],
        });
        if (!request) {
          throw HttpException.notFound("guide request not found");
        }
        io.to(request.users.id).emit("get-booking", request);
        const notification = this.notificationRepo.create({
          senderGuide: guide,
          receiverUser: { id: request.users.id },
          message: `Guide ${guide.firstName} sent you the trip price ${price}`,
        });
        await this.notificationRepo.save(notification);
        io.to(request.users.id).emit("notification", notification);
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

  async completeGuideService(guide_id: string, user_id: string) {
    try {
      const travel = await this.guideRepo.findOne({
        where: {
          id: guide_id,
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
            this.guideRequestRepo.target,
            {
              where: {
                guide: { id: guide_id },
                users: { id: user_id },
                status: RequestStatus.ACCEPTED,
                lastActionBy: Role.GUIDE,
              },
            },
          );

          if (!findTravelService)
            throw HttpException.notFound("Request not found");

          const update = await transactionEntityManager.update(
            RequestGuide,
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

  async getAllNotifications(guideId: string) {
    try {
      const travel = await this.guideRepo.findOneBy({ id: guideId });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }
      const notifications = await this.notificationRepo.findBy({
        receiverGuide: { id: guideId },
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
  async getUnreadNotificationsCount(guide_id: string) {
    try {
      const travel = await this.guideRepo.findOneBy({ id: guide_id });
      if (!travel) {
        throw HttpException.badRequest("You are not authorized");
      }
      const notifications = await this.notificationRepo.findBy({
        receiverGuide: { id: guide_id },
        isRead: false,
      });
      if (!notifications) {
        throw HttpException.notFound("No notifications yet");
      }
      const notificationCount = notifications.length;
      io.to(guide_id).emit("notification-count", notificationCount);
      return notificationCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async readNotification(guide_id: string) {
    try {
      const user = await this.guideRepo.findOneBy({ id: guide_id });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      const updateResult = await this.notificationRepo.update(
        { receiverGuide: { id: guide_id } },
        { isRead: true },
      );

      if (updateResult.affected && updateResult.affected > 0) {
        io.to(guide_id).emit("notification-updated", { unreadCount: 0 });
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

  async acceptRequest(guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
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

          lastActionBy: Role.GUIDE,
        },
      );
      await this.guideRepo.update(
        { id: guide_id },
        {
          available: false,
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
  async rejectRequest(guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("Request not found");
      }
      await this.guideRequestRepo.update(
        { id: requests.id },
        {
          status: RequestStatus.REJECTED,
          lastActionBy: Role.GUIDE,
        },
      );
      return rejectRequest("Guide");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }

  async getAllActiveUsers() {
    const activeGuides = await this.guideRepo.findBy({ available: true });

    if (!activeGuides) return null;

    return activeGuides;
  }

  async activeUser(userId: string) {
    try {
      const user = await this.guideRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.guideRepo.update({ id: userId }, { available: true });
      const activeGuides = await this.getAllActiveUsers();
      io.to(userId).emit("active-guide", activeGuides);
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
      const user = await this.guideRepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException.badRequest("You are not authorized");
      }
      await this.guideRepo.update({ id: userId }, { available: false });

      io.to(userId).emit("guide-active", { userId, active: false });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getBookings(guideId: string) {
    try {
      const booking = await this.guideRequestRepo.find({
        where: { guide: { id: guideId } },
        relations: ["guide", "user"],
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

  async reportGuide(id: string, userId: string, message: string, images: any[]) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.notFound("user not found")

      const isReportAlreadyExist = await this.reportRepo.findOne({
        where: {
          reporterGuide: { id },
          reportedUser: user,
          status: ReportStatus.PENDING
        }, relations: ["reportedUser", "reporterGuide"]
      })

      if (isReportAlreadyExist) throw HttpException.badRequest("You have already reported this user recently")

      const reportGuide = this.reportRepo.create({
        message,
        reporterGuide: { id },
        reportedUser: user
      })

      await this.reportRepo.save(reportGuide)
      if (images) {
        for (const file of images) {
      
          const files = this.reportFileRepo.create({
            name: file.name,
            mimetype: file.mimetype,
            report: reportGuide

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
}
export default GuideService;
