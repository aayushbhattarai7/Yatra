"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = require("../config/database.config");
const user_entity_1 = require("../entities/user/user.entity");
const bcrypt_service_1 = __importDefault(require("./bcrypt.service"));
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const jwt_decode_1 = require("jwt-decode");
const location_entity_1 = require("../entities/location/location.entity");
const enum_1 = require("../constant/enum");
const guide_entity_1 = require("../entities/guide/guide.entity");
const travel_entity_1 = require("../entities/travels/travel.entity");
const RequestGuide_entities_1 = require("../entities/user/RequestGuide.entities");
const RequestTravels_entity_1 = require("../entities/user/RequestTravels.entity");
const email_service_1 = require("./email.service");
const env_config_1 = require("../config/env.config");
const stripe_1 = __importDefault(require("stripe"));
const message_1 = require("../constant/message");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
const esewa_service_1 = __importDefault(require("./esewa.service"));
const socket_1 = require("../socket/socket");
const notification_entity_1 = require("../entities/notification/notification.entity");
const khalti_service_1 = __importDefault(require("./khalti.service"));
const room_service_1 = require("./room.service");
const chat_entity_1 = require("../entities/chat/chat.entity");
const otp_utils_1 = __importDefault(require("../utils/otp.utils"));
const hash_service_1 = require("./hash.service");
const rating_entity_1 = require("../entities/ratings/rating.entity");
const userImage_entity_1 = __importDefault(require("../entities/user/userImage.entity"));
const path_utils_1 = require("../utils/path.utils");
const trekkingplace_entity_1 = require("../entities/place/trekkingplace.entity");
const mail_utils_1 = __importDefault(require("../utils/mail.utils"));
const roomService = new room_service_1.RoomService();
const emailService = new email_service_1.EmailService();
const otpService = new otp_utils_1.default();
const hashService = new hash_service_1.HashService();
class UserService {
    userRepo;
    userImage;
    locationRepo;
    guideRepo;
    travelrepo;
    guideRequestRepo;
    travelRequestRepo;
    notificationRepo;
    chatRepo;
    ratingsRepo;
    placeRepo;
    constructor(userRepo = database_config_1.AppDataSource.getRepository(user_entity_1.User), userImage = database_config_1.AppDataSource.getRepository(userImage_entity_1.default), locationRepo = database_config_1.AppDataSource.getRepository(location_entity_1.Location), guideRepo = database_config_1.AppDataSource.getRepository(guide_entity_1.Guide), travelrepo = database_config_1.AppDataSource.getRepository(travel_entity_1.Travel), guideRequestRepo = database_config_1.AppDataSource.getRepository(RequestGuide_entities_1.RequestGuide), travelRequestRepo = database_config_1.AppDataSource.getRepository(RequestTravels_entity_1.RequestTravel), notificationRepo = database_config_1.AppDataSource.getRepository(notification_entity_1.Notification), chatRepo = database_config_1.AppDataSource.getRepository(chat_entity_1.Chat), ratingsRepo = database_config_1.AppDataSource.getRepository(rating_entity_1.Rating), placeRepo = database_config_1.AppDataSource.getRepository(trekkingplace_entity_1.TrekkingPlace)) {
        this.userRepo = userRepo;
        this.userImage = userImage;
        this.locationRepo = locationRepo;
        this.guideRepo = guideRepo;
        this.travelrepo = travelrepo;
        this.guideRequestRepo = guideRequestRepo;
        this.travelRequestRepo = travelRequestRepo;
        this.notificationRepo = notificationRepo;
        this.chatRepo = chatRepo;
        this.ratingsRepo = ratingsRepo;
        this.placeRepo = placeRepo;
    }
    async signup(data, images) {
        console.log("🚀 ~ UserService ~ signup ~ data:", data);
        try {
            const emailExist = await this.userRepo.findOneBy({ email: data.email });
            if (emailExist)
                throw HttpException_utils_1.default.notFound("Entered Email is already registered");
            const hashPassword = await bcrypt_service_1.default.hash(data.password);
            const addUser = this.userRepo.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                gender: enum_1.Gender[data.gender],
                password: hashPassword,
            });
            await this.userRepo.save(addUser);
            if (images) {
                console.log("🚀 ~ UserService ~ signup ~ images:", images);
                const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (images.profile) {
                    const profileImage = images.profile;
                    if (!allowedMimeTypes.includes(profileImage.mimetype)) {
                        throw HttpException_utils_1.default.badRequest("Invalid profile image type. Only jpg, jpeg, and png are accepted.");
                    }
                    const savedProfileImage = this.userImage.create({
                        name: profileImage.name,
                        mimetype: profileImage.mimetype,
                        path: profileImage.path,
                        type: enum_1.MediaType.PROFILE,
                        user: addUser,
                    });
                    await this.userImage.save(savedProfileImage);
                    savedProfileImage.transferImageToUpload(addUser.id, enum_1.MediaType.PROFILE);
                }
                if (images.cover) {
                    const coverImage = images.cover;
                    if (!allowedMimeTypes.includes(coverImage.mimetype)) {
                        throw HttpException_utils_1.default.badRequest("Invalid cover image type. Only jpg, jpeg, and png are accepted.");
                    }
                    const savedCoverImage = this.userImage.create({
                        name: coverImage.name,
                        mimetype: coverImage.mimetype,
                        path: coverImage.path,
                        type: enum_1.MediaType.COVER,
                        user: addUser,
                    });
                    await this.userImage.save(savedCoverImage);
                    savedCoverImage.transferImageToUpload(addUser.id, enum_1.MediaType.COVER);
                }
            }
            return (0, message_1.registeredMessage)("User");
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
    async updateProfile(id, data, images) {
        try {
            const user = await this.userRepo.findOne({ where: { id }, relations: ["image"] });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            console.log("🚀 ~ UserService ~ updateProfile ~ user:", user);
            await this.userRepo.update({ id }, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                gender: enum_1.Gender[data.gender],
            });
            if (images) {
                console.log("🚀 ~ UserService ~ signup ~ images:", images);
                const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (images.profile) {
                    const profileImage = images.profile;
                    if (!allowedMimeTypes.includes(profileImage.mimetype)) {
                        throw HttpException_utils_1.default.badRequest("Invalid profile image type. Only jpg, jpeg, and png are accepted.");
                    }
                    const profileImages = await this.userImage.findOneBy({ user: { id }, type: enum_1.MediaType.PROFILE });
                    if (!profileImages) {
                        const image = this.userImage.create({
                            name: profileImage.name,
                            mimetype: profileImage.mimetype,
                            type: enum_1.MediaType.PROFILE,
                            user: user,
                        });
                        await this.userImage.save(image);
                        image.transferImageToUpload(user.id, enum_1.MediaType.PROFILE);
                    }
                    else {
                        (0, path_utils_1.transferImageFromUploadToTemp)(profileImages.id, profileImages.name, profileImages.type);
                        profileImages.name = profileImage.name;
                        profileImages.mimetype = profileImage.mimetype;
                        await this.userImage.save(profileImages);
                        profileImages.transferImageToUpload(user.id, enum_1.MediaType.PROFILE);
                    }
                }
                if (images.cover) {
                    const coverImage = images.cover;
                    if (!allowedMimeTypes.includes(coverImage.mimetype)) {
                        throw HttpException_utils_1.default.badRequest("Invalid cover image type. Only jpg, jpeg, and png are accepted.");
                    }
                    const coverImages = await this.userImage.findOneBy({ user: { id }, type: enum_1.MediaType.COVER });
                    if (!coverImages) {
                        const savedCoverImage = this.userImage.create({
                            name: coverImage.name,
                            mimetype: coverImage.mimetype,
                            path: coverImage.path,
                            type: enum_1.MediaType.COVER,
                            user: user,
                        });
                        await this.userImage.save(savedCoverImage);
                        savedCoverImage.transferImageToUpload(user.id, enum_1.MediaType.COVER);
                    }
                    else {
                        (0, path_utils_1.transferImageFromUploadToTemp)(coverImages.id, coverImages.name, coverImages.type);
                        coverImages.name = coverImage.name;
                        coverImages.mimetype = coverImage.mimetype;
                        await this.userImage.save(coverImages);
                        coverImages.transferImageToUpload(user.id, enum_1.MediaType.COVER);
                    }
                }
            }
            return (0, message_1.updatedMessage)("Profile");
        }
        catch (error) {
            console.log("🚀 ~ UserService ~ updateProfile ~ error:", error);
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async login(data) {
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
                throw HttpException_utils_1.default.notFound("The email you provided is not registered yet, please try with the registered one or create new account");
            if (!user.verified)
                throw HttpException_utils_1.default.badRequest("You are not verified user, please verify your otp");
            const passwordMatched = await bcrypt_service_1.default.compare(data.password, user.password);
            if (!passwordMatched) {
                throw HttpException_utils_1.default.badRequest("Password didnot matched");
            }
            return user;
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
    async reSendOtp(email) {
        try {
            const user = await this.userRepo.findOneBy({ email });
            if (!user)
                throw HttpException_utils_1.default.notFound("Entered email is not registered yet");
            const otp = await otpService.generateOTP();
            const expires = Date.now() + 5 * 60 * 1000;
            const payload = `${email}.${otp}.${expires}`;
            const hashedOtp = hashService.hashOtp(payload);
            const newOtp = `${hashedOtp}.${expires}`;
            await this.userRepo.update({ email }, { otp: newOtp });
            await otpService.sendOtp(user.email, otp, expires);
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
    async sendOtpToChangeEmail(id, email) {
        try {
            const user = await this.userRepo.findOneBy({ id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const otp = await otpService.generateOTP();
            const expires = Date.now() + 5 * 60 * 1000;
            const payload = `${id}.${otp}.${expires}`;
            const hashedOtp = hashService.hashOtp(payload);
            const newOtp = `${hashedOtp}.${expires}`;
            await this.userRepo.update({ id }, { otp: newOtp });
            await otpService.sendOtp(email, otp, expires);
            return "Otp has been sent to your new email please verify your otp";
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
    async verifyEmail(id, email, otp) {
        console.log("🚀 ~  ero ~ verifyEmail ~ id:", id);
        try {
            const user = await this.userRepo.findOneBy({ id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const [hashedOtp, expires] = user?.otp?.split(".");
            if (Date.now() > +expires)
                throw HttpException_utils_1.default.badRequest("Otp is expired");
            const payload = `${id}.${otp}.${expires}`;
            const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
            if (!isOtpValid)
                throw HttpException_utils_1.default.badRequest("Invalid OTP");
            await this.userRepo.update({ id }, { email });
            return "Email changed successfully!.";
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
    async googleLogin(googleId) {
        try {
            const decoded = (0, jwt_decode_1.jwtDecode)(googleId);
            console.log("🚀 ~ UserService ~ googleLogin ~ decoded:", decoded);
            const user = await this.userRepo.findOne({
                where: { email: decoded.email },
            });
            if (!user) {
                try {
                    const saveUser = this.userRepo.create({
                        email: decoded.email,
                        firstName: decoded.given_name,
                        lastName: decoded.family_name ? decoded.family_name : decoded.name,
                        gender: enum_1.Gender.NONE,
                        phoneNumber: decoded.jti,
                        password: await bcrypt_service_1.default.hash(decoded?.sub),
                    });
                    const save = await this.userRepo.save(saveUser);
                    return save;
                }
                catch (error) {
                    throw HttpException_utils_1.default.badRequest(error.message);
                }
            }
            else {
                return await this.getByid(user.id);
            }
        }
        catch (error) {
            console.log("🚀 ~ UserService ~ googleLogin ~ error:", error);
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async debugFBToken(userAccessToken) {
        if (!env_config_1.DotenvConfig.FACEBOOK_APP_ID || !env_config_1.DotenvConfig.FACEBOOK_SECRET) {
            throw HttpException_utils_1.default.internalServerError("Facebook App ID and App Secret must be set in environment variables.");
        }
        try {
            const fields = "id,first_name,middle_name,last_name,email";
            const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${userAccessToken}`;
            console.log("🚀 ~ UserService ~ debugFBToken ~ url:", url);
            const response = await axios_1.default.get(url);
            console.log("🚀 ~ UserService ~ debugFBToken ~ response:", response);
            const data = response.data;
            if (data) {
                return data;
            }
            else {
            }
        }
        catch (error) {
            throw error;
        }
    }
    async facebookLogin(userInfo) {
        try {
            const decoded = await this.debugFBToken(userInfo);
            const user = await this.userRepo.findOne({
                where: { email: decoded.email },
            });
            console.log("🚀 ~ UserService ~ facebookLogin ~ user:", user);
            if (!user) {
                try {
                    console.log('first');
                    const saveUser = this.userRepo.create({
                        email: decoded.email,
                        firstName: decoded.first_name,
                        lastName: decoded.last_name,
                        middleName: decoded.middle_name,
                        gender: enum_1.Gender.NONE,
                        role: enum_1.Role.USER,
                        phoneNumber: decoded.id,
                        password: await bcrypt_service_1.default.hash(decoded?.id),
                    });
                    const save = await this.userRepo.save(saveUser);
                    console.log("🚀 ~ UserService ~ facebookLogin ~ saveUser:", saveUser);
                    return save;
                }
                catch (error) {
                    throw HttpException_utils_1.default.badRequest(error.message);
                }
            }
            else {
                return await this.getByid(user.id);
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
    async addLocation(user_id, data) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const isLocation = await this.locationRepo.findOneBy({
                user: { id: user_id },
            });
            if (isLocation) {
                const location = this.locationRepo.update({
                    user: user,
                }, {
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
                return location;
            }
            else {
                const addLocation = this.locationRepo.create({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    user: user,
                });
                await this.locationRepo.save(addLocation);
                return addLocation;
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
    async getByid(id) {
        try {
            const user = await this.userRepo
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.image", "image")
                .where("user.id =:id", { id })
                .getOne();
            return user;
        }
        catch (error) {
            console.log("🚀 ~ UserService ~ getByid ~ error:", error);
            throw HttpException_utils_1.default.notFound("User not found");
        }
    }
    async getLocation(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const isLocation = await this.locationRepo.findOneBy({
                user: { id: userId },
            });
            if (!isLocation) {
                throw HttpException_utils_1.default.notFound("Location not found");
            }
            return isLocation;
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
    async getPlaces(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const places = await this.placeRepo.find({ relations: ["image"] });
            if (!places) {
                throw HttpException_utils_1.default.notFound("Places not found");
            }
            return places;
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
    async findGuide(user_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const guides = await this.guideRepo.find({
                relations: ["details", "location", "kyc"],
            });
            if (!guides) {
                throw HttpException_utils_1.default.notFound("Guide not found");
            }
            return guides;
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
    async findTravel(user_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const travel = await this.travelrepo.find({
                where: {
                    verified: true,
                    approved: true,
                },
                relations: ["details", "location", "kyc"],
            });
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            return travel;
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
    async verifyUser(email, otp) {
        try {
            const user = await this.userRepo.findOneBy({ email });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const [hashedOtp, expires] = user?.otp?.split(".");
            if (Date.now() > +expires)
                throw HttpException_utils_1.default.badRequest("Otp is expired");
            const payload = `${email}.${otp}.${expires}`;
            const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
            if (!isOtpValid)
                throw HttpException_utils_1.default.badRequest("Invalid OTP");
            await this.userRepo.update({ email }, { verified: true });
            return `Your verification was successful!.`;
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
    async changePassword(password, confirmPassword, email) {
        try {
            const user = await this.userRepo.findOneBy({ email });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            if (password !== confirmPassword)
                throw HttpException_utils_1.default.badRequest("passowrd must be same in both field");
            const hashPassword = await bcrypt_service_1.default.hash(password);
            await this.userRepo.update({ email }, { password: hashPassword });
            return `Your password is updated successfully!.`;
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
    async updatePassword(id, password, confirmPassword, currentPassword) {
        try {
            const user = await this.userRepo.findOne({ where: { id }, select: ["password"] });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const passwordMatched = await bcrypt_service_1.default.compare(currentPassword, user.password);
            if (!passwordMatched)
                throw HttpException_utils_1.default.badRequest("Incorrect current password");
            if (password !== confirmPassword)
                throw HttpException_utils_1.default.badRequest("passowrd must be same in both field");
            const hashPassword = await bcrypt_service_1.default.hash(password);
            await this.userRepo.update({ id }, { password: hashPassword });
            return `Your password is updated successfully!.`;
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
    async findHotel(user_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("you are not authorized");
            const travel = await this.travelrepo.find({
                where: { verified: true, approved: true },
                relations: ["details", "location", "kyc"],
            });
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            return travel;
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
    async requestGuide(user_id, guide_id, data) {
        console.log("🚀 ~ UserService ~ requestGuide ~ guide_id:", guide_id);
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized user");
            }
            const guide = await this.guideRepo.findOneBy({
                id: guide_id,
                approved: true,
                verified: true,
            });
            if (!guide) {
                throw HttpException_utils_1.default.notFound("Guide not found");
            }
            const findRequest = await this.guideRequestRepo.find({
                where: {
                    users: { id: user_id },
                    guide: { id: guide_id },
                },
            });
            // if (findRequest.length > 0) {
            //   throw HttpException.badRequest(
            //     "Request already sent to this guide, Please wait a while for the guide response",
            //   );
            // }
            const request = this.guideRequestRepo.create({
                from: data.from,
                to: data.to,
                totalDays: data.totalDays,
                totalPeople: data.totalPeople,
                users: user,
                guide: guide,
            });
            await this.guideRequestRepo.save(request);
            if (request) {
                socket_1.io.to(guide_id).emit("request-guide", request);
            }
            const notification = this.notificationRepo.create({
                message: `${user.firstName} sent you a travel booking request `,
                senderUser: user,
                receiverGuide: request.guide,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(guide_id).emit("notification", notification);
            }
            const unreadNotificationCount = await this.notificationRepo.count({
                where: { receiverGuide: { id: guide_id }, isRead: false },
            });
            socket_1.io.to(guide_id).emit("notification-count", unreadNotificationCount);
            await emailService.sendMail({
                to: guide.email,
                text: "Request Incomming",
                subject: `${user.firstName} sent you a guide booking request`,
                html: `Hey ${user.firstName} ${user?.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
            });
            return (0, message_1.bookRequestMessage)("Guide");
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async requestTravel(user_id, travel_id, data) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized user");
            }
            const travel = await this.travelrepo.findOneBy({
                id: travel_id,
            });
            const findRequest = await this.travelRequestRepo.find({
                where: {
                    user: { id: user_id },
                    travel: { id: travel_id },
                    status: (0, typeorm_1.Not)((0, typeorm_1.In)([
                        enum_1.RequestStatus.CANCELLED,
                        enum_1.RequestStatus.COMPLETED,
                        enum_1.RequestStatus.REJECTED,
                    ])),
                },
            });
            // if (findRequest.length > 0) {
            //   throw HttpException.badRequest(
            //     "Request already sent to this travel, Please wait a while for the travel response",
            //   );
            // }
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
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
                socket_1.io.to(travel_id).emit("request-travel", request);
            }
            const notification = this.notificationRepo.create({
                message: `${user.firstName} sent you a travel booking request `,
                senderUser: user,
                receiverTravel: request.travel,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(travel_id).emit("notification", notification);
            }
            const unreadNotificationCount = await this.notificationRepo.count({
                where: { receiverTravel: { id: travel_id }, isRead: false },
            });
            socket_1.io.to(travel_id).emit("notification-count", unreadNotificationCount);
            await emailService.sendMail({
                to: travel.email,
                text: "Request Incomming",
                subject: `${user.firstName} sent you a travel booking request`,
                html: `Hey ${user.firstName} ${user.middleName || ""} ${user.lastName}! You've received a new travel request. Please check it out.`,
            });
            return (0, message_1.bookRequestMessage)("Travel");
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async completeTravelService(user_id, travel_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("You are not authorized");
            const travel = await this.travelrepo.findOne({
                where: {
                    id: travel_id,
                }
            });
            if (!travel) {
                throw HttpException_utils_1.default.unauthorized("Travel not found");
            }
            return await database_config_1.AppDataSource.transaction(async (transactionEntityManager) => {
                const findTravelService = await transactionEntityManager.findOne(this.travelRequestRepo.target, {
                    where: {
                        travel: { id: travel_id },
                        user: { id: user_id },
                        status: enum_1.RequestStatus.CONFIRMATION_PENDING
                    }
                });
                if (!findTravelService)
                    throw HttpException_utils_1.default.notFound("Request not found");
                await transactionEntityManager.update(RequestTravels_entity_1.RequestTravel, { id: findTravelService.id }, { status: enum_1.RequestStatus.COMPLETED, lastActionBy: enum_1.Role.USER });
                return `Your travel service has been successfully completed! Please take a moment to rate your travel service provider.`;
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
    async completeGuideService(user_id, guide_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("You are not authorized");
            const travel = await this.guideRepo.findOne({
                where: {
                    id: guide_id,
                }
            });
            if (!travel) {
                throw HttpException_utils_1.default.unauthorized("Travel not found");
            }
            const request = await this.guideRequestRepo.findOneBy({
                guide: { id: guide_id },
                users: { id: user_id },
                status: enum_1.RequestStatus.CONFIRMATION_PENDING
            });
            console.log("🚀 ~ UserService ~ completeGuideService ~ request:", request);
            if (!request)
                throw HttpException_utils_1.default.notFound("Request not found");
            await this.guideRequestRepo.update({ id: request.id }, { status: enum_1.RequestStatus.COMPLETED, lastActionBy: enum_1.Role.USER });
            return `Your guide service has been successfully completed! Please take a moment to rate your travel service provider.`;
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
    async rateTravel(user_id, travel_id, rating, message) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("You are not authorized");
            const travel = await this.travelrepo.findOne({
                where: {
                    id: travel_id,
                }
            });
            if (!travel) {
                throw HttpException_utils_1.default.unauthorized("Travel not found");
            }
            const addRatings = this.ratingsRepo.create({
                rating,
                message,
                user,
                travel
            });
            await this.ratingsRepo.save(addRatings);
            socket_1.io.to(travel_id).emit("travel-ratings", addRatings);
            return addRatings;
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
    async rateGuide(user_id, guide_id, rating, message) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("You are not authorized");
            const guide = await this.guideRepo.findOne({
                where: {
                    id: guide_id,
                }
            });
            if (!guide) {
                throw HttpException_utils_1.default.unauthorized("Guide not found");
            }
            const addRatings = this.ratingsRepo.create({
                rating,
                message,
                user,
                guide
            });
            await this.ratingsRepo.save(addRatings);
            socket_1.io.to(guide_id).emit("guide-ratings", addRatings);
            return addRatings;
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
    async getOwnTravelRequests(user_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            }
            const data = await this.travelRequestRepo
                .createQueryBuilder("requestTravel")
                .leftJoinAndSelect("requestTravel.travel", "travel")
                .leftJoinAndSelect("travel.kyc", "kyc")
                .leftJoinAndSelect("requestTravel.user", "user")
                .where("requestTravel.user_id =:user_id", { user_id })
                .andWhere("requestTravel.status NOT IN (:...statuses)", {
                statuses: [enum_1.RequestStatus.COMPLETED, enum_1.RequestStatus.CANCELLED],
            })
                .getMany();
            if (!data)
                throw HttpException_utils_1.default.notFound("You do not requested any travels for booking");
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async getTravelRequestsHistory(user_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            }
            const data = await this.travelRequestRepo
                .createQueryBuilder("requestTravel")
                .leftJoinAndSelect("requestTravel.travel", "travel")
                .leftJoinAndSelect("travel.kyc", "kyc")
                .leftJoinAndSelect("requestTravel.user", "user")
                .where("requestTravel.user_id =:user_id", { user_id })
                .andWhere("requestTravel.status IN (:...statuses)", {
                statuses: [enum_1.RequestStatus.COMPLETED, enum_1.RequestStatus.CANCELLED],
            })
                .getMany();
            if (!data)
                throw HttpException_utils_1.default.notFound("You do not requested any travels for booking");
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async getGuideRequestsHistory(user_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            }
            const data = await this.guideRequestRepo
                .createQueryBuilder("requestGuide")
                .leftJoinAndSelect("requestGuide.guide", "guide")
                .leftJoinAndSelect("guide.kyc", "kyc")
                .leftJoinAndSelect("requestGuide.users", "user")
                .where("requestGuide.user_id =:user_id", { user_id })
                .andWhere("requestGuide.status IN (:...statuses)", {
                statuses: [enum_1.RequestStatus.COMPLETED, enum_1.RequestStatus.CANCELLED],
            })
                .getMany();
            if (!data)
                throw HttpException_utils_1.default.notFound("You do not requested any travels for booking");
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async getOwnGuideRequests(user_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            }
            const data = await this.guideRequestRepo
                .createQueryBuilder("requestGuide")
                .leftJoinAndSelect("requestGuide.guide", "guide")
                .leftJoinAndSelect("guide.kyc", "kyc")
                .leftJoinAndSelect("requestGuide.users", "user")
                .where("requestGuide.user_id = :user_id", { user_id })
                .andWhere("requestGuide.status NOT IN (:...statuses)", {
                statuses: [enum_1.RequestStatus.COMPLETED, enum_1.RequestStatus.CANCELLED],
            })
                .getMany();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("An unknown error occured");
            }
        }
    }
    async sendTravelPrice(price, user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.travelRequestRepo.findOne({
                where: {
                    user: { id: user_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            if (requests.userBargain > 2)
                throw HttpException_utils_1.default.badRequest("Bargain limit exceed");
            const newPrice = parseFloat(price);
            const advancePrice = newPrice * 0.25;
            const data = await this.travelRequestRepo.update({ id: requests.id }, {
                price: price,
                lastActionBy: enum_1.Role.USER,
                advancePrice,
                userBargain: requests.userBargain + 1,
            });
            if (data) {
                const request = await this.travelRequestRepo.findOne({ where: { id: requestId }, relations: ["user", "travel"] });
                if (!request) {
                    throw HttpException_utils_1.default.notFound("Guide request not found");
                }
                const notification = this.notificationRepo.create({
                    senderUser: { id: user_id },
                    receiverTravel: { id: request.travel.id },
                    message: `User ${request.user.firstName} bargained with your price, check it out`
                });
                await this.notificationRepo.save(notification);
                socket_1.io.to(request.travel.id).emit("request-travel", request);
                socket_1.io.to(request.travel.id).emit("notification", notification);
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
    async sendGuidePrice(price, user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    users: { id: user_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            if (requests.userBargain > 2)
                throw HttpException_utils_1.default.badRequest("Bargain limit exceed");
            const newPrice = parseFloat(price);
            const advancePrice = newPrice * 0.25;
            const data = await this.guideRequestRepo.update({ id: requests.id }, {
                price: price,
                advancePrice: advancePrice,
                lastActionBy: enum_1.Role.USER,
                userBargain: requests.userBargain + 1,
            });
            if (data) {
                const request = await this.guideRequestRepo.findOne({ where: { id: requestId }, relations: ["users", "guide"] });
                if (!request) {
                    throw HttpException_utils_1.default.notFound("Guide request not found");
                }
                const notification = this.notificationRepo.create({
                    senderUser: { id: user_id },
                    receiverGuide: { id: request.guide.id },
                    message: `User ${request.users.firstName} bargained with your price, check it out`
                });
                await this.notificationRepo.save(notification);
                socket_1.io.to(request.guide.id).emit("request-guide", request);
                socket_1.io.to(request.guide.id).emit("notification", notification);
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
    async acceptTravelRequest(user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const travel = await this.travelrepo.findOneBy({
                id: requestId,
            });
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            const requests = await this.travelRequestRepo.findOne({
                where: {
                    travel: { id: travel.id },
                    user: { id: user.id },
                    status: enum_1.RequestStatus.PENDING,
                }, relations: ["travel", "user"]
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            const data = await this.travelRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.ACCEPTED,
                lastActionBy: enum_1.Role.USER,
            });
            if (data) {
                const request = await this.travelRequestRepo.findOne({ where: { id: requestId }, relations: ["user", "travel"] });
                if (!request) {
                    throw HttpException_utils_1.default.notFound("Travel request not found");
                }
                const notification = this.notificationRepo.create({
                    senderUser: { id: user_id },
                    receiverTravel: { id: request.travel.id },
                    message: `User ${request.user.firstName} accept your price, get ready for the trip`
                });
                await mail_utils_1.default.sendAcceptedMail(user.email, "Travel", user.firstName);
                await this.notificationRepo.save(notification);
                socket_1.io.to(request.travel.id).emit("request-travel", request);
                socket_1.io.to(request.travel.id).emit("notification", notification);
            }
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
    async acceptGuideRequest(user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    users: { id: user_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            const data = await this.guideRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.ACCEPTED,
                lastActionBy: enum_1.Role.USER,
            });
            if (data) {
                const request = await this.guideRequestRepo.findOne({ where: { id: requestId }, relations: ["users", "guide"] });
                if (!request) {
                    throw HttpException_utils_1.default.notFound("Guide request not found");
                }
                const notification = this.notificationRepo.create({
                    senderUser: { id: user_id },
                    receiverGuide: { id: request.guide.id },
                    message: `User ${request.users.firstName} accept your price, get ready for the trip`
                });
                await mail_utils_1.default.sendAcceptedMail(user.email, "Guide", user.firstName);
                await this.notificationRepo.save(notification);
                socket_1.io.to(request.guide.id).emit("request-guide", request);
                socket_1.io.to(request.guide.id).emit("notification", notification);
            }
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
    async cancelGuideRequest(user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.guideRequestRepo.findOne({
                where: {
                    users: { id: user_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            await this.guideRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.CANCELLED,
                lastActionBy: enum_1.Role.USER,
            });
            return (0, message_1.cancelRequest)("Guide");
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
    async cancelTravelRequest(user_id, requestId) {
        try {
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const requests = await this.travelRequestRepo.findOne({
                where: {
                    user: { id: user_id },
                    id: requestId,
                },
            });
            if (!requests) {
                throw HttpException_utils_1.default.notFound("no request found");
            }
            await this.travelRequestRepo.update({ id: requests.id }, {
                status: enum_1.RequestStatus.CANCELLED,
                lastActionBy: enum_1.Role.USER,
            });
            return (0, message_1.cancelRequest)("Travel");
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
    async getTravelLocation(user_id, travel_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const travel = await this.travelrepo.findOneBy({
                id: travel_id,
            });
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            const isAccepted = await this.travelRequestRepo.findOneBy({
                user: { id: user_id },
                travel: { id: travel_id },
                status: enum_1.RequestStatus.ACCEPTED,
            });
            if (!isAccepted) {
                throw HttpException_utils_1.default.notFound("The request is not completed");
            }
            const data = await this.locationRepo.findOneBy({
                travel: { id: travel_id },
            });
            if (!data) {
                throw HttpException_utils_1.default.notFound("Travel location not found");
            }
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
    async getGuideLocation(user_id, guide_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const guide = await this.guideRepo.findOneBy({
                id: guide_id,
            });
            if (!guide) {
                throw HttpException_utils_1.default.notFound("Guide not found");
            }
            const isAccepted = await this.guideRequestRepo.findOneBy({
                users: { id: user_id },
                guide: { id: guide_id },
                status: enum_1.RequestStatus.ACCEPTED,
            });
            if (!isAccepted) {
                throw HttpException_utils_1.default.notFound("The request is not completed");
            }
            const data = await this.locationRepo.findOneBy({
                guide: { id: guide_id },
            });
            if (!data) {
                throw HttpException_utils_1.default.notFound("Guide location not found");
            }
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
    async getGuideProfile(user_id, guide_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const guide = await this.guideRepo.findOne({
                where: {
                    id: guide_id,
                },
                relations: ["details", "kyc"],
            });
            if (!guide) {
                throw HttpException_utils_1.default.notFound("Guide not found");
            }
            return guide;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occured");
            }
        }
    }
    async getTravelProfile(user_id, travel_id) {
        try {
            const user = await this.userRepo.findOneBy({
                id: user_id,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const travel = await this.travelrepo.findOne({
                where: {
                    id: travel_id,
                },
                relations: ["details", "kyc"],
            });
            if (!travel) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            return travel;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occured");
            }
        }
    }
    async advancePaymentForTravel(userId, requestId, amount) {
        try {
            const totalAmount = amount * 100;
            const user = await this.userRepo.findOneBy({
                id: userId,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.travelRequestRepo.findOneBy({
                id: requestId,
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            const stripe = new stripe_1.default(env_config_1.DotenvConfig.STRIPE_SECRET);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: "npr",
                payment_method_types: ["card"],
            });
            if (paymentIntent) {
                await this.travelRequestRepo.update({
                    id: request.id,
                }, {
                    status: enum_1.RequestStatus.ACCEPTED,
                    lastActionBy: enum_1.Role.USER
                });
            }
            const room = await roomService.checkRoomWithTravel(userId, request.travel.id);
            return paymentIntent.client_secret;
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
    async advancePaymentForTravelWithEsewa(userId, requestId, token) {
        console.log("🚀 ~ UserService ~ userId:", requestId);
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.travelRequestRepo.findOne({
                where: { id: requestId },
                relations: ["travel"],
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Request not found");
            }
            const payment = await esewa_service_1.default.verifyPayment(token);
            console.log(payment?.verifiedData);
            if (payment) {
                const data = await this.travelRequestRepo.update({ id: request.id }, { status: enum_1.RequestStatus.ACCEPTED, paymentType: enum_1.PaymentType.ESEWA, lastActionBy: enum_1.Role.USER });
                const room = await roomService.checkRoomWithTravel(userId, request.travel.id);
                if (data) {
                    const request = await this.travelRequestRepo.findOne({ where: { id: requestId }, relations: ["user", "travel"] });
                    if (!request) {
                        throw HttpException_utils_1.default.notFound("Travel request not found");
                    }
                    const notification = this.notificationRepo.create({
                        senderUser: { id: userId },
                        receiverTravel: { id: request.travel.id },
                        message: `User ${request.user.firstName} accept your price, get ready for the trip`
                    });
                    await mail_utils_1.default.sendAcceptedMail(user.email, "Travel", user.firstName);
                    await this.notificationRepo.save(notification);
                    socket_1.io.to(request.travel.id).emit("request-travel", request);
                    socket_1.io.to(request.travel.id).emit("notification", notification);
                }
                return (0, message_1.booked)("Travel");
            }
            else {
                throw HttpException_utils_1.default.badRequest("Payment unsuccessful");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occurred");
            }
        }
    }
    async advancePaymentForTravelWithKhalti(userId, requestId, id) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.travelRequestRepo.findOne({
                where: { id: requestId },
                relations: ["travel"],
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Request not found");
            }
            const payment = await khalti_service_1.default.verifyPayment(id);
            if (payment) {
                await this.travelRequestRepo.update({ id: request.id }, { status: enum_1.RequestStatus.ACCEPTED, paymentType: enum_1.PaymentType.KHALTI, lastActionBy: enum_1.Role.USER });
                const notification = this.notificationRepo.create({
                    message: `${user.firstName} ${user?.middleName} ${user.lastName} has accepted the price check it out! `,
                    senderUser: user,
                    receiverTravel: request.travel,
                });
                const room = await roomService.checkRoomWithTravel(userId, request.travel.id);
                const saveNotification = await this.notificationRepo.save(notification);
                console.log(saveNotification);
                const notifications = await this.notificationRepo.find({
                    where: {
                        receiverTravel: { id: request.travel.id },
                    },
                });
                socket_1.io.to(saveNotification.receiverTravel.id).emit("notification", notifications);
                return (0, message_1.booked)("Travel");
            }
            else {
                throw HttpException_utils_1.default.badRequest("Payment unsuccessful");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occurred");
            }
        }
    }
    async getAllNotifications(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            const notifications = await this.notificationRepo.findBy({
                receiverUser: { id: userId },
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
    async readNotification(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            await this.notificationRepo.update({ receiverUser: { id: userId } }, { isRead: true });
            const notifications = await this.notificationRepo.findBy({
                receiverUser: { id: userId },
            });
            socket_1.io.to(userId).emit("notification", notifications);
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
    async advancePaymentForGuideWithEsewa(userId, requestId, token) {
        console.log("🚀 ~ UserService ~ userId:", requestId);
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.guideRequestRepo.findOne({
                where: { id: requestId },
                relations: ["guide"],
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Request not found");
            }
            console.log("🚀 ~ UserService ~ request:", request);
            const payment = await esewa_service_1.default.verifyPayment(token);
            console.log(payment?.verifiedData);
            if (payment) {
                const data = await this.guideRequestRepo.update({ id: request.id }, { status: enum_1.RequestStatus.ACCEPTED, paymentType: enum_1.PaymentType.ESEWA, lastActionBy: enum_1.Role.USER });
                await roomService.checkRoomWithGuide(userId, request.guide.id);
                if (data) {
                    const request = await this.guideRequestRepo.findOne({ where: { id: requestId }, relations: ["users", "guide"] });
                    if (!request) {
                        throw HttpException_utils_1.default.notFound("Guide request not found");
                    }
                    const notification = this.notificationRepo.create({
                        senderUser: { id: userId },
                        receiverGuide: { id: request.guide.id },
                        message: `User ${request.users.firstName} accept your price, get ready for the trip`
                    });
                    await mail_utils_1.default.sendAcceptedMail(user.email, "Guide", user.firstName);
                    await this.notificationRepo.save(notification);
                    socket_1.io.to(request.guide.id).emit("request-guide", request);
                    socket_1.io.to(request.guide.id).emit("notification", notification);
                }
                return (0, message_1.booked)("Guide");
            }
            else {
                throw HttpException_utils_1.default.badRequest("Payment unsuccessful");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occurred");
            }
        }
    }
    async advancePaymentForGuide(userId, requestId, amount) {
        try {
            const totalAmount = amount * 100;
            const user = await this.userRepo.findOneBy({
                id: userId,
            });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.guideRequestRepo.findOneBy({
                id: requestId,
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            const stripe = new stripe_1.default(env_config_1.DotenvConfig.STRIPE_SECRET);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: "npr",
                payment_method_types: ["card"],
            });
            if (paymentIntent) {
                await this.guideRequestRepo.update({
                    id: request.id,
                }, {
                    status: enum_1.RequestStatus.ACCEPTED,
                    lastActionBy: enum_1.Role.USER
                });
            }
            return paymentIntent.client_secret;
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
    async advancePaymentForGuideWithKhalti(userId, requestId, id) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.unauthorized("User not found");
            }
            const request = await this.guideRequestRepo.findOne({
                where: { id: requestId },
                relations: ["guide"],
            });
            if (!request) {
                throw HttpException_utils_1.default.notFound("Request not found");
            }
            const payment = await khalti_service_1.default.verifyPayment(id);
            if (payment) {
                await this.guideRequestRepo.update({ id: request.id }, { status: enum_1.RequestStatus.ACCEPTED, paymentType: enum_1.PaymentType.KHALTI, lastActionBy: enum_1.Role.USER });
                const notification = this.notificationRepo.create({
                    message: `${user.firstName} ${user?.middleName} ${user.lastName} has accepted the price check it out! `,
                    senderUser: user,
                    receiverGuide: request.guide,
                });
                const room = await roomService.checkRoomWithGuide(userId, request.guide.id);
                const saveNotification = await this.notificationRepo.save(notification);
                console.log(saveNotification);
                const notifications = await this.notificationRepo.find({
                    where: {
                        receiverGuide: { id: request.guide.id },
                    },
                });
                socket_1.io.to(saveNotification.receiverGuide.id).emit("notification", notifications);
                return (0, message_1.booked)("Guide");
            }
            else {
                throw HttpException_utils_1.default.badRequest("Payment unsuccessful");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.badRequest("An error occurred");
            }
        }
    }
    async activeUser(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            await this.userRepo.update({ id: userId }, { available: true });
            socket_1.io.to(userId).emit("user-active", { userId, active: true });
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
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            }
            await this.userRepo.update({ id: userId }, { available: false });
            socket_1.io.to(userId).emit("user-active", { userId, active: false });
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
    async getUnreadChatCount(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.badRequest("You are not authorized");
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: userId },
                    read: false
                }
            });
            socket_1.io.to(userId).emit("chat-count", chatCount.length);
            return chatCount.length;
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
exports.default = new UserService();
