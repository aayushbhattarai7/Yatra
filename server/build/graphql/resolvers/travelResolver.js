"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelResolver = void 0;
const type_graphql_1 = require("type-graphql");
const enum_1 = require("../../constant/enum");
const HttpException_utils_1 = __importDefault(require("../../utils/HttpException.utils"));
const schema_1 = require("../../graphql/schema/schema");
const webToken_service_1 = __importDefault(require("../../service/webToken.service"));
const message_1 = require("../../constant/message");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const authorization_middleware_1 = require("../../middleware/authorization.middleware");
const travel_entity_1 = require("../../entities/travels/travel.entity");
const travel_dto_1 = require("../../dto/travel.dto");
const travel_service_1 = __importDefault(require("../../service/travel.service"));
const RequestTravels_entity_1 = require("../../entities/user/RequestTravels.entity");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const chat_service_1 = require("../../service/chat.service");
const room_entity_1 = require("../../entities/chat/room.entity");
const room_service_1 = require("../../service/room.service");
const chatService = new chat_service_1.ChatService();
const roomService = new room_service_1.RoomService();
class TravelResolver {
    async travelSignup(data, req) {
        try {
            const { kycType } = req.body;
            const uploadedPhotos = {
                passPhoto: req.files?.passPhoto?.[0]
                    ? {
                        name: req.files.passPhoto[0].filename,
                        mimetype: req.files.passPhoto[0].mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.PASSPHOTO,
                    }
                    : null,
                vehicleRegistration: req.files?.vehicleRegistration?.[0]
                    ? {
                        name: req.files.vehicleRegistration[0].filename,
                        mimetype: req.files.vehicleRegistration[0].mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.VEHICLEREGISTRATION,
                    }
                    : null,
            };
            if (kycType === enum_1.KycType.CITIZENSHIP) {
                const citizenshipFront = req.files?.citizenshipFront?.[0];
                const citizenshipBack = req.files?.citizenshipBack?.[0];
                uploadedPhotos.citizenshipFront = citizenshipFront
                    ? {
                        name: citizenshipFront.filename,
                        mimetype: citizenshipFront.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.CITIZENSHIPFRONT,
                    }
                    : null;
                uploadedPhotos.citizenshipBack = citizenshipBack
                    ? {
                        name: citizenshipBack.filename,
                        mimetype: citizenshipBack.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.CITIZENSHIPBACK,
                    }
                    : null;
            }
            else if (kycType === enum_1.KycType.PASSPORT) {
                const passport = req.files?.passport?.[0];
                uploadedPhotos.passport = passport
                    ? {
                        name: passport.filename,
                        mimetype: passport.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.PASSPORT,
                    }
                    : null;
            }
            else if (kycType === enum_1.KycType.VOTERCARD) {
                const voterCard = req.files?.voterCard?.[0];
                uploadedPhotos.voterCard = voterCard
                    ? {
                        name: voterCard.filename,
                        mimetype: voterCard.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.VOTERCARD,
                    }
                    : null;
            }
            else {
                return "Invalid KYC type provided.";
            }
            console.log(uploadedPhotos);
            const details = await travel_service_1.default.create(uploadedPhotos, data);
            return "Travel is registered successfully";
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async travelLogin(email, password) {
        try {
            const data = { email, password };
            const user = await travel_service_1.default.loginTravel(data);
            console.log("🚀 ~ UserResolver ~ login ~ user:", user);
            const tokens = webToken_service_1.default.generateTokens({ id: user.id }, user.role);
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                verified: user.verified,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                message: "Logged in successfully",
            };
        }
        catch (error) {
            throw new Error(error instanceof Error
                ? error.message
                : "An error occurred during login");
        }
    }
    async getRequestByTravel(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await travel_service_1.default.getRequests(userId);
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
    async getAllNotificationsOfTravel(ctx) {
        try {
            const travelId = ctx.req.user?.id;
            return await travel_service_1.default.getAllNotifications(travelId);
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
    async getUnreadNotificationsOfTravel(ctx) {
        try {
            const travelId = ctx.req.user?.id;
            return await travel_service_1.default.getUnreadNotificationsCount(travelId);
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
    async travelVerifyOTP(email, otp) {
        try {
            return await travel_service_1.default.verifyUser(email, otp);
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
    async travelResendOTP(email) {
        try {
            return await travel_service_1.default.reSendOtp(email);
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
    async getTravelDetails(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await travel_service_1.default.getTravelDetails(userId);
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
    async rejectRequestByTravel(requestId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await travel_service_1.default.rejectRequest(userId, requestId);
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
    async sendPriceByTravel(requestId, price, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await travel_service_1.default.sendPrice(price, userId, requestId);
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
    async requestForCompletedTravel(userId, ctx) {
        try {
            const travelId = ctx.req.user?.id;
            return await travel_service_1.default.completeTravelService(travelId, userId);
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
    async addLocationOfTravel(latitude, longitude, ctx) {
        try {
            const data = { latitude, longitude };
            const travelId = ctx.req.user?.id;
            return await travel_service_1.default.addLocation(travelId, data);
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
    async getRequestHistoryOfTravel(ctx) {
        try {
            const userId = ctx.req.user?.id;
            console.log(userId);
            const x = await travel_service_1.default.getHistory(userId);
            console.log(x, "xxxxx");
            return x;
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
    async getChatOfUserByTravel(ctx, userId) {
        try {
            const travelId = ctx.req.user?.id;
            console.log("🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ travelId:", travelId);
            return await chatService.getChatByTravelOfUser(travelId, userId);
        }
        catch (error) {
            console.log("🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ error:", error);
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getChatUserByTravel(ctx) {
        try {
            const travelId = ctx.req.user?.id;
            return await roomService.getUserOfChatByTravel(travelId);
        }
        catch (error) {
            console.log("🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ error:", error);
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
}
exports.TravelResolver = TravelResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [travel_dto_1.TravelDTO, Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "travelSignup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "travelLogin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestTravels_entity_1.RequestTravel]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getRequestByTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [notification_entity_1.Notification]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getAllNotificationsOfTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getUnreadNotificationsOfTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("otp")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "travelVerifyOTP", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "travelResendOTP", null);
__decorate([
    (0, type_graphql_1.Query)(() => travel_entity_1.Travel, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getTravelDetails", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "rejectRequestByTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Arg)("price")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "sendPriceByTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "requestForCompletedTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Arg)("latitude")),
    __param(1, (0, type_graphql_1.Arg)("longitude")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "addLocationOfTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestTravels_entity_1.RequestTravel], { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getRequestHistoryOfTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getChatOfUserByTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [room_entity_1.Room]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.TRAVEL])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelResolver.prototype, "getChatUserByTravel", null);
