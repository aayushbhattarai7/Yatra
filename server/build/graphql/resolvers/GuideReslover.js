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
exports.GuideResolver = void 0;
const type_graphql_1 = require("type-graphql");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const guide_service_1 = __importDefault(require("../../service/guide.service"));
const guide_dto_1 = require("../../dto/guide.dto");
const enum_1 = require("../../constant/enum");
const HttpException_utils_1 = __importDefault(require("../../utils/HttpException.utils"));
const schema_1 = require("../../graphql/schema/schema");
const webToken_service_1 = __importDefault(require("../../service/webToken.service"));
const message_1 = require("../../constant/message");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const authorization_middleware_1 = require("../../middleware/authorization.middleware");
const RequestGuide_entities_1 = require("../../entities/user/RequestGuide.entities");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const chat_service_1 = require("../../service/chat.service");
const room_entity_1 = require("../../entities/chat/room.entity");
const room_service_1 = require("../../service/room.service");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const roomService = new room_service_1.RoomService();
const chatService = new chat_service_1.ChatService();
class GuideResolver {
    guideService = new guide_service_1.default();
    async guideSignup(data, req) {
        try {
            const kycType = data.kycType;
            const files = req.files;
            console.log("🚀 ~ GuideResolver ~ guideSignup ~ files:", files);
            const uploadedPhotos = {};
            if (kycType === enum_1.KycType.CITIZENSHIP) {
                const citizenshipFront = files?.citizenshipFront?.[0];
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
                throw HttpException_utils_1.default.badRequest("Invalid file format");
            }
            const details = await this.guideService.create(uploadedPhotos, data);
            return details;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async guideLogin(email, password) {
        try {
            const data = { email, password };
            const user = await this.guideService.loginGuide(data);
            console.log("🚀 ~ UserResolver ~ login ~ user:", user);
            const tokens = webToken_service_1.default.generateTokens({ id: user.id }, user.role);
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
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
    async getRequestsByGuide(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await this.guideService.getRequests(userId);
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
    async getGuideDetails(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await this.guideService.getGuideDetails(userId);
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
    async getRequestHistoryOfGuide(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await this.guideService.getHistory(userId);
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
    async rejectRequestByGuide(requestId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            console.log("🚀 ~ UserResolver ~ getOwnTravelRequest ~ userId:", userId);
            return await this.guideService.rejectRequest(userId, requestId);
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
    async sendPriceByGuide(requestId, price, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await this.guideService.sendPrice(price, userId, requestId);
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
    async addLocationOfGuide(latitude, longitude, ctx) {
        try {
            const data = { latitude, longitude };
            const guideId = ctx.req.user?.id;
            return await this.guideService.addLocation(guideId, data);
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
    async getAllNotificationsOfGuide(ctx) {
        try {
            const guideId = ctx.req.user?.id;
            return await this.guideService.getAllNotifications(guideId);
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
    async getUnreadNotificationsOfGuide(ctx) {
        try {
            const guideId = ctx.req.user?.id;
            return await this.guideService.getUnreadNotificationsCount(guideId);
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
    async getChatOfUserByGuide(ctx, userId) {
        try {
            const guideId = ctx.req.user?.id;
            return await chatService.getChatByGuideOfUser(guideId, userId);
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
    async getChatUserByGuide(ctx) {
        try {
            const guideId = ctx.req.user?.id;
            console.log(guideId, "idd0----");
            return await roomService.getUserOfChatByGuide(guideId);
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
    async requestForCompletedGuide(userId, ctx) {
        try {
            const guideId = ctx.req.user?.id;
            return await this.guideService.completeGuideService(guideId, userId);
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
exports.GuideResolver = GuideResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => guide_entity_1.Guide),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [guide_dto_1.GuideDTO, Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "guideSignup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "guideLogin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestGuide_entities_1.RequestGuide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getRequestsByGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => guide_entity_1.Guide, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getGuideDetails", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestGuide_entities_1.RequestGuide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getRequestHistoryOfGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "rejectRequestByGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Arg)("price")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "sendPriceByGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Arg)("latitude")),
    __param(1, (0, type_graphql_1.Arg)("longitude")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "addLocationOfGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [notification_entity_1.Notification]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getAllNotificationsOfGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getUnreadNotificationsOfGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getChatOfUserByGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [room_entity_1.Room]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "getChatUserByGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.GUIDE])),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuideResolver.prototype, "requestForCompletedGuide", null);
