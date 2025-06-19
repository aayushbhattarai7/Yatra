"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_utils_1 = __importDefault(
  require("../utils/HttpException.utils"),
);
const regex_utils_1 = require("../utils/regex.utils");
const regex_utils_2 = require("../utils/regex.utils");
const database_config_1 = require("../config/database.config");
const bcrypt_service_1 = __importDefault(require("./bcrypt.service"));
const otp_utils_1 = __importDefault(require("../utils/otp.utils"));
const hash_service_1 = require("./hash.service");
const travel_entity_1 = require("../entities/travels/travel.entity");
const travelKyc_entity_1 = __importDefault(
  require("../entities/travels/travelKyc.entity"),
);
const enum_1 = require("../constant/enum");
const travelDetails_entity_1 = require("../entities/travels/travelDetails.entity");
const RequestTravels_entity_1 = require("../entities/user/RequestTravels.entity");
const user_entity_1 = require("../entities/user/user.entity");
const location_entity_1 = require("../entities/location/location.entity");
const message_1 = require("../constant/message");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("../entities/notification/notification.entity");
const socket_1 = require("../socket/socket");
const hashService = new hash_service_1.HashService();
const otpService = new otp_utils_1.default();
class TravelService {
  travelrepo;
  travelDetailsrepo;
  locationRepo;
  travelRequestRepo;
  travelKycRepo;
  userRepo;
  notificationRepo;
  constructor(
    travelrepo = database_config_1.AppDataSource.getRepository(
      travel_entity_1.Travel,
    ),
    travelDetailsrepo = database_config_1.AppDataSource.getRepository(
      travelDetails_entity_1.TravelDetails,
    ),
    locationRepo = database_config_1.AppDataSource.getRepository(
      location_entity_1.Location,
    ),
    travelRequestRepo = database_config_1.AppDataSource.getRepository(
      RequestTravels_entity_1.RequestTravel,
    ),
    travelKycRepo = database_config_1.AppDataSource.getRepository(
      travelKyc_entity_1.default,
    ),
    userRepo = database_config_1.AppDataSource.getRepository(
      user_entity_1.User,
    ),
    notificationRepo = database_config_1.AppDataSource.getRepository(
      notification_entity_1.Notification,
    ),
  ) {
    this.travelrepo = travelrepo;
    this.travelDetailsrepo = travelDetailsrepo;
    this.locationRepo = locationRepo;
    this.travelRequestRepo = travelRequestRepo;
    this.travelKycRepo = travelKycRepo;
    this.userRepo = userRepo;
    this.notificationRepo = notificationRepo;
  }
  async create(image, data) {
    return await database_config_1.AppDataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          const emailExist = await transactionalEntityManager.findOne(
            this.travelrepo.target,
            {
              where: { email: data.email },
            },
          );
          if (emailExist)
            throw HttpException_utils_1.default.badRequest(
              "Entered email is already registered",
            );
          if (!data.email || !data.firstName || !data.lastName)
            throw HttpException_utils_1.default.badRequest(
              "Please fill all the required fields",
            );
          if (!regex_utils_2.emailRegex.test(data.email)) {
            throw HttpException_utils_1.default.badRequest(
              "Please enter a valid email",
            );
          }
          if (!regex_utils_1.passwordRegex.test(data.password)) {
            throw HttpException_utils_1.default.badRequest(
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
              password: await bcrypt_service_1.default.hash(data.password),
              firstName: data.firstName,
              middleName: data?.middleName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              vehicleType: data.vehicleType,
              gender: enum_1.Gender[data.gender],
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
            throw HttpException_utils_1.default.badRequest("Error Occured");
          } else {
            if (image) {
              const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
              for (const key in image) {
                const file = image[key];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                  throw HttpException_utils_1.default.badRequest(
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
              throw HttpException_utils_1.default.badRequest(
                "Pleas provide all necessary items.",
              );
            }
          }
          return (0, message_1.registeredMessage)("Travel");
        } catch (error) {
          console.log(error);
          if (error instanceof Error) {
            throw HttpException_utils_1.default.badRequest(error?.message);
          } else {
            throw HttpException_utils_1.default.internalServerError;
          }
        }
      },
    );
  }
  async reSendOtp(email) {
    try {
      if (!email) {
        throw HttpException_utils_1.default.notFound("Email not found");
      }
      const travel = await this.travelrepo.findOneBy({ email });
      if (!travel)
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      if (travel.verified)
        throw HttpException_utils_1.default.badRequest(
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
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error?.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async verifyUser(email, otp) {
    try {
      const travel = await this.travelrepo.findOneBy({ email });
      if (!travel)
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      if (travel.verified === true) {
        throw HttpException_utils_1.default.badRequest(
          "You are already verified please wait for the approval",
        );
      }
      const [hashedOtp, expires] = travel?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException_utils_1.default.badRequest("Otp ie expired");
      const payload = `${email}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid)
        throw HttpException_utils_1.default.badRequest("Invalid OTP");
      await this.travelrepo.update({ email }, { verified: true });
      return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error?.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async loginTravel(data) {
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
        throw HttpException_utils_1.default.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );
      if (!travel.verified) {
        await this.reSendOtp(travel.email);
      }
      if (!travel.approved) {
        throw HttpException_utils_1.default.badRequest(
          "Your account is not approved yet please wait less than 24 hours to get approval",
        );
      }
      const passwordMatched = await bcrypt_service_1.default.compare(
        data.password,
        travel.password,
      );
      if (!passwordMatched) {
        throw HttpException_utils_1.default.badRequest(
          "Password didnot matched",
        );
      }
      return travel;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getRequests(travel_id) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
      }
      const requests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: (0, typeorm_1.Not)(
            (0, typeorm_1.In)([
              enum_1.RequestStatus.COMPLETED,
              enum_1.RequestStatus.REJECTED,
              enum_1.RequestStatus.CANCELLED,
            ]),
          ),
        },
        relations: ["user", "travel"],
      });
      console.log("🚀 ~ TravelService ~ getRequests ~ requests:", requests);
      return requests;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getTravelDetails(travel_id) {
    try {
      const travel = await this.travelrepo.findOne({
        where: {
          id: travel_id,
        },
        relations: ["details", "kyc"],
      });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
      }
      return travel;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async completeTravelService(travel_id, user_id) {
    try {
      const travel = await this.travelrepo.findOne({
        where: {
          id: travel_id,
        },
      });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
      }
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException_utils_1.default.notFound("User not found");
      return await database_config_1.AppDataSource.transaction(
        async (transactionEntityManager) => {
          const findTravelService = await transactionEntityManager.findOne(
            this.travelRequestRepo.target,
            {
              where: {
                travel: { id: travel_id },
                user: { id: user_id },
                status: enum_1.RequestStatus.ACCEPTED,
              },
            },
          );
          if (!findTravelService)
            throw HttpException_utils_1.default.notFound("Request not found");
          const update = await transactionEntityManager.update(
            RequestTravels_entity_1.RequestTravel,
            { id: findTravelService.id },
            {
              status: enum_1.RequestStatus.CONFIRMATION_PENDING,
              lastActionBy: enum_1.Role.TRAVEL,
            },
          );
          if (update) {
            socket_1.io.to(user_id).emit("request-travel", findTravelService);
          }
          return `Please wait for user to confirm it`;
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async sendPrice(price, travel_id, requestId) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
        relations: ["user"],
      });
      if (!requests) {
        throw HttpException_utils_1.default.notFound("no request found");
      }
      if (requests.travelBargain > 2)
        throw HttpException_utils_1.default.badRequest("Bargain limit exceed");
      const newPrice = parseFloat(price);
      const advancePrice = newPrice * 0.25;
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          advancePrice: advancePrice,
          lastActionBy: enum_1.Role.TRAVEL,
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
          throw HttpException_utils_1.default.notFound(
            "Notifications not found",
          );
        }
        socket_1.io.to(requests.user.id).emit("notification", notifications);
      }
      return message_1.Message.priceSent;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getAllNotifications(travelId) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      const notifications = await this.notificationRepo.findBy({
        receiverTravel: { id: travelId },
      });
      if (!notifications) {
        throw HttpException_utils_1.default.notFound("No notifications yet");
      }
      return notifications;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getUnreadNotificationsCount(travelId) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travelId });
      if (!travel) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      const notifications = await this.notificationRepo.findBy({
        receiverTravel: { id: travelId },
        isRead: false,
      });
      if (!notifications) {
        throw HttpException_utils_1.default.notFound("No notifications yet");
      }
      const notificationCount = notifications.length;
      socket_1.io.to(travelId).emit("notification-count", notificationCount);
      return notificationCount;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async readNotification(travel_id) {
    try {
      const user = await this.travelrepo.findOneBy({ id: travel_id });
      if (!user) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      const updateResult = await this.notificationRepo.update(
        { receiverTravel: { id: travel_id } },
        { isRead: true },
      );
      if (updateResult.affected && updateResult.affected > 0) {
        socket_1.io
          .to(travel_id)
          .emit("notification-updated", { unreadCount: 0 });
      }
      return updateResult;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async acceptRequest(travel_id, requestId) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      const requests = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException_utils_1.default.notFound("no request found");
      }
      const data = await this.travelRequestRepo.update(
        { id: requests.id },
        {
          status: enum_1.RequestStatus.ACCEPTED,
          lastActionBy: enum_1.Role.TRAVEL,
        },
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.badRequest("An error occured");
      }
    }
  }
  async rejectRequest(travel_id, requestId) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      }
      const request = await this.travelRequestRepo.findOne({
        where: {
          travel: { id: travel_id },
          id: requestId,
        },
      });
      if (!request) {
        throw HttpException_utils_1.default.notFound("Request not found");
      }
      await this.travelRequestRepo.update(
        { id: request.id },
        {
          status: enum_1.RequestStatus.REJECTED,
          lastActionBy: enum_1.Role.TRAVEL,
        },
      );
      return (0, message_1.rejectRequest)("Travel");
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.badRequest("An error occured");
      }
    }
  }
  async addLocation(travel_id, data) {
    try {
      console.log("yess");
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel)
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
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
          socket_1.io.emit("travels", {
            location: travelLocation?.location,
            id: travelLocation?.id,
          });
          console.log(
            "🚀 ~ TravelService ~ addLocation ~ travelLocation:",
            travelLocation,
          );
        }
        return message_1.Message.locationSent;
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
        socket_1.io.emit("travels", {
          location: travelLocation,
          id: travel_id,
        });
        return message_1.Message.locationSent;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getHistory(travel_id) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
      }
      console.log(travel);
      const requests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: (0, typeorm_1.In)([
            enum_1.RequestStatus.COMPLETED,
            enum_1.RequestStatus.REJECTED,
            enum_1.RequestStatus.CANCELLED,
          ]),
        },
        relations: ["user", "travel"],
      });
      console.log("🚀 ~ TravelService ~ getHistory ~ requests:", requests);
      return requests;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async activeUser(userId) {
    try {
      const user = await this.travelrepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      await this.travelrepo.update({ id: userId }, { available: true });
      const activeTravel = await this.getAllActiveUsers();
      socket_1.io.emit("active-travel", activeTravel);
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async offlineUser(userId) {
    try {
      const user = await this.travelrepo.findOneBy({ id: userId });
      if (!user) {
        throw HttpException_utils_1.default.badRequest(
          "You are not authorized",
        );
      }
      await this.travelrepo.update({ id: userId }, { available: false });
      const activeTravel = await this.getAllActiveUsers();
      socket_1.io.emit("active-travel", activeTravel);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getAllActiveUsers() {
    const activeTravel = await this.travelrepo.findBy({ available: true });
    if (!activeTravel) return null;
    return activeTravel;
  }
  async getBookings(travelId) {
    try {
      const booking = await this.travelRequestRepo.find({
        where: { travel: { id: travelId } },
        relations: ["travel", "user"],
      });
      if (booking.length === 0)
        throw HttpException_utils_1.default.notFound("Booking not found");
      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async getTotalEarnings(travel_id) {
    try {
      const travel = await this.travelrepo.findOneBy({ id: travel_id });
      if (!travel) {
        throw HttpException_utils_1.default.unauthorized(
          "you are not authorized",
        );
      }
      const completedRequests = await this.travelRequestRepo.find({
        where: {
          travel: { id: travel_id },
          status: enum_1.RequestStatus.COMPLETED,
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
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
  async purchaseConnects(travelId, price) {
    try {
      const booking = await this.travelRequestRepo.find({
        where: { travel: { id: travelId } },
        relations: ["travel", "user"],
      });
      if (booking.length === 0)
        throw HttpException_utils_1.default.notFound("Booking not found");
      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError;
      }
    }
  }
}
exports.default = new TravelService();
