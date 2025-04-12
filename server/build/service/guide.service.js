"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const regex_utils_1 = require("../utils/regex.utils");
const regex_utils_2 = require("../utils/regex.utils");
const database_config_1 = require("../config/database.config");
const guide_entity_1 = require("../entities/guide/guide.entity");
const bcrypt_service_1 = __importDefault(require("./bcrypt.service"));
const guideKyc_entity_1 = __importDefault(require("../entities/guide/guideKyc.entity"));
const otp_utils_1 = __importDefault(require("../utils/otp.utils"));
const hash_service_1 = require("./hash.service");
const enum_1 = require("../constant/enum");
const location_entity_1 = require("../entities/location/location.entity");
const guideDetails_entity_1 = require("../entities/guide/guideDetails.entity");
const RequestGuide_entities_1 = require("../entities/user/RequestGuide.entities");
const socket_1 = require("../socket/socket");
const message_1 = require("../constant/message");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("../entities/notification/notification.entity");
const user_entity_1 = require("../entities/user/user.entity");
const hashService = new hash_service_1.HashService();
const otpService = new otp_utils_1.default();
class GuideService {
    guideRepo;
    locationRepo;
    guideDetailsrepo;
    guideRequestRepo;
    notificationRepo;
    userRepo;
    guideKycRepo;
    constructor(guideRepo = database_config_1.AppDataSource.getRepository(guide_entity_1.Guide), locationRepo = database_config_1.AppDataSource.getRepository(location_entity_1.Location), guideDetailsrepo = database_config_1.AppDataSource.getRepository(guideDetails_entity_1.GuideDetails), guideRequestRepo = database_config_1.AppDataSource.getRepository(RequestGuide_entities_1.RequestGuide), notificationRepo = database_config_1.AppDataSource.getRepository(notification_entity_1.Notification), userRepo = database_config_1.AppDataSource.getRepository(user_entity_1.User), guideKycRepo = database_config_1.AppDataSource.getRepository(guideKyc_entity_1.default)) {
        this.guideRepo = guideRepo;
        this.locationRepo = locationRepo;
        this.guideDetailsrepo = guideDetailsrepo;
        this.guideRequestRepo = guideRequestRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.guideKycRepo = guideKycRepo;
    }
    async create(image, data) {
        console.log("🚀 ~ GuideService ~ create ~ data:", data);
        return await database_config_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            try {
                const emailExist = await transactionalEntityManager.findOne(this.guideRepo.target, { where: { email: data.email } });
                if (emailExist)
                    throw HttpException_utils_1.default.badRequest("Entered email is already registered");
                if (!data.email || !data.firstName || !data.lastName)
                    throw HttpException_utils_1.default.badRequest("Please fill all the required fields");
                if (!regex_utils_2.emailRegex.test(data.email))
                    throw HttpException_utils_1.default.badRequest("Please enter a valid email");
                if (!regex_utils_1.passwordRegex.test(data.password)) {
                    throw HttpException_utils_1.default.badRequest("Password requires an uppercase, digit, and special char.");
                }
                const otp = await otpService.generateOTP();
                const expires = Date.now() + 5 * 60 * 1000;
                const payload = `${data.email}.${otp}.${expires}`;
                const hashedOtp = hashService.hashOtp(payload);
                const newOtp = `${hashedOtp}.${expires}`;
                const guide = transactionalEntityManager.create(this.guideRepo.target, {
                    email: data.email,
                    password: await bcrypt_service_1.default.hash(data.password),
                    firstName: data.firstName,
                    middleName: data?.middleName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    gender: enum_1.Gender[data.gender],
                    otp: newOtp,
                });
                const saves = await transactionalEntityManager.save(this.guideRepo.target, guide);
                const guidedetails = transactionalEntityManager.create(this.guideDetailsrepo.target, {
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
                });
                await transactionalEntityManager.save(this.guideDetailsrepo.target, guidedetails);
                if (!saves)
                    throw HttpException_utils_1.default.badRequest("Error Occurred");
                if (image) {
                    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
                    for (const key in image) {
                        const file = image[key];
                        console.log(file, "-----------------------------");
                        console.log(file.mimetype);
                        if (!allowedMimeTypes.includes(file.mimetype)) {
                            throw new Error("Invalid image type. Only jpg, jpeg, and png are accepted.");
                        }
                        const kyc = transactionalEntityManager.create(this.guideKycRepo.target, {
                            name: file.name,
                            mimetype: file.mimetype,
                            type: file.type,
                            fileType: file.fileType,
                            guide: saves,
                        });
                        const savedImage = await transactionalEntityManager.save(this.guideKycRepo.target, kyc);
                        console.log("Saved Image:", savedImage);
                        savedImage.transferKycToUpload(saves.id, savedImage.type);
                    }
                    const location = transactionalEntityManager.create(this.locationRepo.target, {
                        latitude: parseFloat(data.latitude),
                        longitude: parseFloat(data.longitude),
                        guide: saves,
                    });
                    await transactionalEntityManager.save(this.locationRepo.target, location);
                    await otpService.sendOtp(saves.email, otp, expires);
                }
                else {
                    throw HttpException_utils_1.default.badRequest("Please provide all necessary items.");
                }
                return saves;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    throw HttpException_utils_1.default.badRequest(error?.message);
                }
                else {
                    throw HttpException_utils_1.default.internalServerError;
                }
            }
        });
    }
    async reSendOtp(email) {
        try {
            if (!email) {
                throw HttpException_utils_1.default.notFound("Email not found");
            }
            const guide = await this.guideRepo.findOneBy({ email });
            if (!guide)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            if (guide.verified)
                throw HttpException_utils_1.default.badRequest("You are already verified please wait for the approval");
            const otp = await otpService.generateOTP();
            const expires = Date.now() + 5 * 60 * 1000;
            const payload = `${email}.${otp}.${expires}`;
            const hashedOtp = hashService.hashOtp(payload);
            const newOtp = `${hashedOtp}.${expires}`;
            await this.guideRepo.update({ email }, { otp: newOtp });
            await otpService.sendOtp(guide.email, otp, expires);
            return `Otp sent to ${email} successfully`;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async verifyUser(email, otp) {
        try {
            const guide = await this.guideRepo.findOneBy({ email });
            if (!guide)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            if (guide.verified === true) {
                throw HttpException_utils_1.default.badRequest("You are already verified please wait for the approval");
            }
            const [hashedOtp, expires] = guide?.otp?.split(".");
            if (Date.now() > +expires)
                throw HttpException_utils_1.default.badRequest("Otp ie expired");
            const payload = `${email}.${otp}.${expires}`;
            const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
            if (!isOtpValid)
                throw HttpException_utils_1.default.badRequest("Invalid OTP");
            await this.guideRepo.update({ email }, { verified: true });
            return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async loginGuide(data) {
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
                throw HttpException_utils_1.default.notFound("Invalid Email, Entered Email is not registered yet");
            if (!guide.verified) {
                throw HttpException_utils_1.default.badRequest("You are not verified, please verify your email first");
            }
            if (!guide.approved) {
                throw HttpException_utils_1.default.badRequest("Your account is not approved yet please wait less than 24 hours to get approval");
            }
            const passwordMatched = await bcrypt_service_1.default.compare(data.password, guide.password);
            if (!passwordMatched) {
                throw HttpException_utils_1.default.badRequest("Password didnot matched");
            }
            return guide;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async addLocation(guide_id, data) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const isLocation = await this.locationRepo.findOneBy({
                guide: { id: guide_id },
            });
            if (isLocation) {
                const updateLocation = await this.locationRepo.update({
                    id: isLocation.id,
                    guide: { id: guide_id },
                }, {
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
                if (updateLocation) {
                    const guideLocation = await this.guideRepo.findOne({
                        where: { id: guide_id },
                        relations: ["location"],
                    });
                    socket_1.io.emit("guides", {
                        location: guideLocation?.location,
                        id: guideLocation?.id,
                    });
                }
                return message_1.Message.locationSent;
            }
            else {
                const addLocation = this.locationRepo.create({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    guide: guide,
                });
                await this.locationRepo.save(addLocation);
                return message_1.Message.locationSent;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getRequests(guide_id) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide) {
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            }
            const requests = await this.guideRequestRepo.find({
                where: {
                    guide: { id: guide_id },
                    status: (0, typeorm_1.Not)((0, typeorm_1.In)([
                        enum_1.RequestStatus.COMPLETED,
                        enum_1.RequestStatus.REJECTED,
                        enum_1.RequestStatus.CANCELLED,
                    ])),
                },
                relations: ["users"],
            });
            return requests;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getGuideDetails(guide_id) {
        try {
            const guide = await this.guideRepo.findOne({
                where: {
                    id: guide_id,
                },
                relations: ["details", "kyc"],
            });
            console.log("🚀 ~ GuideService ~ getGuideDetails ~ guide:", guide);
            if (!guide) {
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            }
            return guide;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getHistory(guide_id) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide) {
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            }
            const requests = await this.guideRequestRepo.find({
                where: {
                    guide: { id: guide_id },
                    status: enum_1.RequestStatus.COMPLETED,
                },
                relations: ["users"],
            });
            return requests;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async sendPrice(price, guide_id, requestId) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    guide: { id: guide_id },
                    id: requestId,
                },
                relations: ["users", "guide"]
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            if (requests.guideBargain > 2)
                throw HttpException_utils_1.default.badRequest("Bargain limit exceed");
            const newPrice = parseFloat(price);
            const advancePrice = newPrice * 0.25;
            const data = await this.guideRequestRepo.update({ id: requests.id }, {
                price: price,
                advancePrice: advancePrice,
                lastActionBy: enum_1.Role.GUIDE,
            });
            if (data) {
                const request = await this.guideRequestRepo.findOne({ where: { id: requestId }, relations: ["users", "guide"] });
                if (!request) {
                    throw HttpException_utils_1.default.notFound("guide request not found");
                }
                socket_1.io.to(request.users.id).emit("get-booking", request);
                const notification = this.notificationRepo.create({
                    senderGuide: guide,
                    receiverUser: { id: request.users.id },
                    message: `Guide ${guide.firstName} sent you the trip price ${price}`
                });
                await this.notificationRepo.save(notification);
                socket_1.io.to(request.users.id).emit("notification", notification);
            }
            return message_1.Message.priceSent;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async completeGuideService(guide_id, user_id) {
        try {
            const travel = await this.guideRepo.findOne({
                where: {
                    id: guide_id,
                }
            });
            if (!travel) {
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            }
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("User not found");
            return await database_config_1.AppDataSource.transaction(async (transactionEntityManager) => {
                const findTravelService = await transactionEntityManager.findOne(this.guideRequestRepo.target, {
                    where: {
                        guide: { id: guide_id },
                        users: { id: user_id },
                        status: enum_1.RequestStatus.ACCEPTED,
                        lastActionBy: enum_1.Role.GUIDE
                    }
                });
                if (!findTravelService)
                    throw HttpException_utils_1.default.notFound("Request not found");
                const update = await transactionEntityManager.update(RequestGuide_entities_1.RequestGuide, { id: findTravelService.id }, {
                    status: enum_1.RequestStatus.CONFIRMATION_PENDING,
                    lastActionBy: enum_1.Role.TRAVEL
                });
                if (update) {
                    socket_1.io.to(user_id).emit("request-travel", findTravelService);
                }
                return `Please wait for user to confirm it`;
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getAllNotifications(guideId) {
        try {
            const travel = await this.guideRepo.findOneBy({ id: guideId });
            if (!travel) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const notifications = await this.notificationRepo.findBy({
                receiverGuide: { id: guideId },
            });
            if (!notifications) {
                throw HttpException_utils_1.default.notFound("No notifications yet");
            }
            return notifications;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getUnreadNotificationsCount(guide_id) {
        try {
            const travel = await this.guideRepo.findOneBy({ id: guide_id });
            if (!travel) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const notifications = await this.notificationRepo.findBy({
                receiverGuide: { id: guide_id },
                isRead: false
            });
            if (!notifications) {
                throw HttpException_utils_1.default.notFound("No notifications yet");
            }
            const notificationCount = notifications.length;
            socket_1.io.to(guide_id).emit("notification-count", notificationCount);
            return notificationCount;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readNotification(guide_id) {
        try {
            const user = await this.guideRepo.findOneBy({ id: guide_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const updateResult = await this.notificationRepo.update({ receiverGuide: { id: guide_id } }, { isRead: true });
            if (updateResult.affected && updateResult.affected > 0) {
                socket_1.io.to(guide_id).emit("notification-updated", { unreadCount: 0 });
            }
            return updateResult;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async acceptRequest(guide_id, requestId) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    guide: { id: guide_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            const data = await this.guideRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.ACCEPTED,
                lastActionBy: enum_1.Role.GUIDE,
            });
            await this.guideRepo.update({ id: guide_id }, {
                available: false,
            });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occured");
            }
        }
    }
    async rejectRequest(guide_id, requestId) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    guide: { id: guide_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("Request not found");
            }
            await this.guideRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.REJECTED,
                lastActionBy: enum_1.Role.GUIDE,
            });
            return (0, message_1.rejectRequest)("Guide");
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occured");
            }
        }
    }
    async getAllActiveUsers() {
        const activeGuides = await this.guideRepo.findBy({ available: true });
        if (!activeGuides)
            return null;
        return activeGuides;
    }
    async activeUser(userId) {
        try {
            const user = await this.guideRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            await this.guideRepo.update({ id: userId }, { available: true });
            const activeGuides = await this.getAllActiveUsers();
            socket_1.io.to(userId).emit("active-guide", activeGuides);
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async offlineUser(userId) {
        try {
            const user = await this.guideRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            await this.guideRepo.update({ id: userId }, { available: false });
            socket_1.io.to(userId).emit("guide-active", { userId, active: false });
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getBookings(guideId) {
        try {
            const booking = await this.guideRequestRepo.find({ where: { guide: { id: guideId } }, relations: ["guide", "user"] });
            if (booking.length === 0)
                throw HttpException_utils_1.default.notFound("Booking not found");
            return booking;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
}
exports.default = GuideService;
