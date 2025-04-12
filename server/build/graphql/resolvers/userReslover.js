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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_entity_1 = require("../../entities/user/user.entity");
const user_service_1 = __importDefault(require("../../service/user.service"));
const webToken_service_1 = __importDefault(require("../../service/webToken.service"));
const schema_1 = require("../../graphql/schema/schema");
const location_entity_1 = require("../../entities/location/location.entity");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
const HttpException_utils_1 = __importDefault(require("../../utils/HttpException.utils"));
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const authorization_middleware_1 = require("../../middleware/authorization.middleware");
const enum_1 = require("../../constant/enum");
const RequestGuide_entities_1 = require("../../entities/user/RequestGuide.entities");
const RequestTravels_entity_1 = require("../../entities/user/RequestTravels.entity");
const guideKyc_entity_1 = __importDefault(require("../../entities/guide/guideKyc.entity"));
const travelKyc_entity_1 = __importDefault(require("../../entities/travels/travelKyc.entity"));
const travelDetails_entity_1 = require("../../entities/travels/travelDetails.entity");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const room_service_1 = require("../../service/room.service");
const room_entity_1 = require("../../entities/chat/room.entity");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const chat_service_1 = require("../../service/chat.service");
const rating_entity_1 = require("../../entities/ratings/rating.entity");
const place_service_1 = __importDefault(require("../../service/place.service"));
const placefavourite_entity_1 = require("../../entities/place/placefavourite.entity");
const roomService = new room_service_1.RoomService();
const chatService = new chat_service_1.ChatService();
let UserResolver = class UserResolver {
    async login(email, password) {
        try {
            const data = { email, password };
            const user = await user_service_1.default.login(data);
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
    async senOtpToUser(email) {
        try {
            return await user_service_1.default.reSendOtp(email);
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
    async changeEmailOfUser(email, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.sendOtpToChangeEmail(userId, email);
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
    async verifyEmailWhileChangeOfUser(email, otp, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.verifyEmail(userId, email, otp);
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
    async VerifyUserOTP(email, otp) {
        try {
            return await user_service_1.default.verifyUser(email, otp);
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
    async changePasswordOfUser(email, password, confirmPassword) {
        try {
            return await user_service_1.default.changePassword(password, confirmPassword, email);
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
    async updatePasswordOfUser(currentPassword, password, confirmPassword, ctx) {
        try {
            const id = ctx.req.user?.id;
            return await user_service_1.default.updatePassword(id, password, confirmPassword, currentPassword);
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
    async googleLogin(googleId) {
        try {
            const user = await user_service_1.default.googleLogin(googleId);
            const tokens = webToken_service_1.default.generateTokens({ id: user?.id }, user?.role);
            return {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                message: "Logged in successfully via Google",
            };
        }
        catch (error) {
            throw new Error(error instanceof Error
                ? error.message
                : "An error occurred during Google login");
        }
    }
    async facebookLogin(facebookId) {
        console.log("🚀 ~ UserResolver ~ facebookLogin ~ facebookId:", facebookId);
        try {
            console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
            const user = await user_service_1.default.facebookLogin(facebookId);
            console.log(user?.id, user?.role, "hhhhhhhhhhhhhhh");
            const tokens = webToken_service_1.default.generateTokens({ id: user?.id }, user?.role);
            console.log("🚀 ~ UserResolver ~ facebookLogin ~ tokens:", tokens);
            return {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                message: "Logged in successfully via Google",
            };
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error
                ? error.message
                : "An error occurred during Google login");
        }
    }
    async getUser(ctx) {
        try {
            const id = ctx.req.user?.id;
            console.log("🚀 ~ UserResolver ~ getUser ~ id:", id);
            return user_service_1.default.getByid(id);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error
                ? error.message
                : "An error occurred during Google login");
        }
    }
    async findGuide(ctx) {
        try {
            const id = ctx.req.user?.id;
            return user_service_1.default.findGuide(id);
        }
        catch (error) {
            throw HttpException_utils_1.default.internalServerError;
        }
    }
    async findTravel(ctx) {
        console.log("hahahha");
        try {
            const id = ctx.req.user?.id;
            console.log("🚀 ~ UserResolver ~ findTravel ~ id:", id);
            const data = await user_service_1.default.findTravel(id);
            return data;
        }
        catch (error) {
            throw HttpException_utils_1.default.internalServerError;
        }
    }
    async getLocation(ctx) {
        try {
            const id = ctx.req.user?.id;
            return await user_service_1.default.getLocation(id);
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
    async requestGuide(ctx, guideId, from, to, totalDays, totalPeople) {
        try {
            const data = { from, to, totalDays, totalPeople };
            const userId = ctx.req.user?.id;
            return await user_service_1.default.requestGuide(userId, guideId, data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.internalServerError(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async chatWithTravel(ctx, travelId, message) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.chatWithTravel(userId, travelId, message);
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.internalServerError(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async requestTravel(ctx, travelId, from, to, totalDays, totalPeople, vehicleType) {
        try {
            const data = { from, to, totalDays, totalPeople, vehicleType };
            const userId = ctx.req.user?.id;
            return await user_service_1.default.requestTravel(userId, travelId, data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.internalServerError(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getOwnTravelRequest(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getOwnTravelRequests(userId);
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
    async getConnectedUsers(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await roomService.getConnectedUsers(userId);
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
    async getChatOfTravel(ctx, id) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.getChatByUserOfTravel(userId, id);
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
    async getChatOfGuide(ctx, id) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.getChatByUserOfGuide(userId, id);
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
    async getGuideProfile(ctx, guideId) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getGuideProfile(userId, guideId);
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
    async getTravelProfile(ctx, travelId) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getTravelProfile(userId, travelId);
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
    async completeTravelServiceByUser(travelId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.completeTravelService(userId, travelId);
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
    async completeGuideServiceByUser(guideId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.completeGuideService(userId, guideId);
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
    async rateTravel(id, rating, message, ctx) {
        try {
            const userId = ctx.req.user?.id;
            console.log("🚀 ~ UserResolver ~ rateTravel ~ userId:", userId, message, rating);
            return await user_service_1.default.rateTravel(userId, id, rating, message);
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
    async rateGuide(id, rating, message, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.rateGuide(userId, id, rating, message);
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
    async getTravelHistory(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getTravelRequestsHistory(userId);
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
    async getGuideHistory(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getGuideRequestsHistory(userId);
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
    async getOwnGuideRequest(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getOwnGuideRequests(userId);
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
    async getTravelLocation(ctx, travel_id) {
        try {
            const user_id = ctx.req.user?.id;
            const data = await user_service_1.default.getTravelLocation(user_id, travel_id);
            return data;
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
    async getGuideLocation(ctx, guide_id) {
        try {
            const user_id = ctx.req.user?.id;
            const data = await user_service_1.default.getGuideLocation(user_id, guide_id);
            return data;
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
    async sendPriceToGuide(requestId, price, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.sendGuidePrice(price, userId, requestId);
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
    async sendPriceToTravel(requestId, price, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.sendTravelPrice(price, userId, requestId);
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
    async cancelGuideRequest(requestId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.cancelGuideRequest(userId, requestId);
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
    async cancelTravelRequest(requestId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.cancelTravelRequest(userId, requestId);
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
    async AdvancePaymentForTravel(travelId, amount, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.advancePaymentForTravel(userId, travelId, amount);
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
    // @Mutation(() => String)
    // @UseMiddleware(authentication, authorization([Role.USER]))
    // async AdvancePaymentForTravelWithEsewa(
    //   @Arg("travelId") travelId: string,
    //   @Arg("amount") amount: number,
    //   @Ctx() ctx: Context,
    // ) {
    //   try {
    //     const userId = ctx.req.user?.id!;
    //     return await userService.advancePaymentForTravelWithEsewa(
    //       userId,
    //       travelId,
    //       amount,
    //     );
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       throw HttpException.badRequest(error.message);
    //     } else {
    //       throw HttpException.internalServerError;
    //     }
    //   }
    // }
    async getAllNotificationsOfUser(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getAllNotifications(userId);
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
    async readChatOfTravelByUser(ctx, id) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.readChatOfTravel(userId, id);
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
    async AdvancePaymentForGuide(guideId, amount, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.advancePaymentForGuide(userId, guideId, amount);
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
    async getChatCount(ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await user_service_1.default.getUnreadChatCount(userId);
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
    async getChatCountOfGuide(ctx, id) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.getUnreadChatOFGuide(userId, id);
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
    async getChatCountOfTravel(ctx, id) {
        try {
            const userId = ctx.req.user?.id;
            return await chatService.getUnreadChatOFTravel(userId, id);
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
    async addToFavourite(placeId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await place_service_1.default.addPlaceToFavourite(userId, placeId);
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
    async removeFromFavourite(placeId, ctx) {
        try {
            const userId = ctx.req.user?.id;
            return await place_service_1.default.removePlaceToFavourite(userId, placeId);
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
    async getFavouritePlace(ctx) {
        try {
            const userId = ctx.req.user?.id;
            console.log("🚀 ~ UserResolver ~ getFavouritePlace ~ userId:", userId);
            return await place_service_1.default.getFavouritePlace(userId);
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
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    // async signup(
    //   @Arg("firstName") firstName: string,
    //   @Arg("middleName", {nullable:true}) middleName: string,
    //   @Arg("lastName") lastName: string,
    //   @Arg("email") email: string,
    //   @Arg("phoneNumber") phoneNumber: string,
    //   @Arg("gender") gender: Gender,
    //   @Arg("password") password: string,
    // ) {
    //   const image = "aaaaa"
    //   console.log("yessss")
    //   try {
    //     const newUser = {
    //       firstName,
    //       middleName,
    //       lastName,
    //       email,
    //       phoneNumber,
    //       gender,
    //       password,
    //     };
    //     if(!newUser) throw HttpException.badRequest("Fill all required fields")
    //     const createdUser = await userService.signup(newUser, image as any);
    //     return createdUser;
    //   } catch (error) {
    //     throw new Error(
    //       error instanceof Error
    //         ? error.message
    //         : "An error occurred during signup",
    //     );
    //   }
    // }
    ,
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "senOtpToUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeEmailOfUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("otp")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "verifyEmailWhileChangeOfUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("otp")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "VerifyUserOTP", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Arg)("confirmPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePasswordOfUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("currentPassword")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Arg)("confirmPassword")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updatePasswordOfUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("googleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "googleLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("facebookId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "facebookLogin", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_entity_1.User),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => [guide_entity_1.Guide, guideKyc_entity_1.default]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "findGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [travel_entity_1.Travel, travelKyc_entity_1.default, travelDetails_entity_1.TravelDetails]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "findTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => location_entity_1.Location),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getLocation", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("guide_id")),
    __param(2, (0, type_graphql_1.Arg)("from")),
    __param(3, (0, type_graphql_1.Arg)("to")),
    __param(4, (0, type_graphql_1.Arg)("totalDays")),
    __param(5, (0, type_graphql_1.Arg)("totalPeople")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "requestGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("travelId")),
    __param(2, (0, type_graphql_1.Arg)("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "chatWithTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("travel_id")),
    __param(2, (0, type_graphql_1.Arg)("from")),
    __param(3, (0, type_graphql_1.Arg)("to")),
    __param(4, (0, type_graphql_1.Arg)("totalDays")),
    __param(5, (0, type_graphql_1.Arg)("totalPeople")),
    __param(6, (0, type_graphql_1.Arg)("vehicleType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "requestTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestTravels_entity_1.RequestTravel]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getOwnTravelRequest", null);
__decorate([
    (0, type_graphql_1.Query)(() => [room_entity_1.Room]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getConnectedUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getChatOfTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getChatOfGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => guide_entity_1.Guide),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("guideId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getGuideProfile", null);
__decorate([
    (0, type_graphql_1.Query)(() => travel_entity_1.Travel),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("travelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getTravelProfile", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("travelId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "completeTravelServiceByUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("guideId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "completeGuideServiceByUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => rating_entity_1.Rating),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("rating")),
    __param(2, (0, type_graphql_1.Arg)("message")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rateTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => rating_entity_1.Rating),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("rating")),
    __param(2, (0, type_graphql_1.Arg)("message")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rateGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestTravels_entity_1.RequestTravel], { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getTravelHistory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestGuide_entities_1.RequestGuide], { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getGuideHistory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RequestGuide_entities_1.RequestGuide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getOwnGuideRequest", null);
__decorate([
    (0, type_graphql_1.Query)(() => location_entity_1.Location),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getTravelLocation", null);
__decorate([
    (0, type_graphql_1.Query)(() => location_entity_1.Location),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getGuideLocation", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Arg)("price")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sendPriceToGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Arg)("price")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sendPriceToTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "cancelGuideRequest", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("requestId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "cancelTravelRequest", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("travelId")),
    __param(1, (0, type_graphql_1.Arg)("amount")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "AdvancePaymentForTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [notification_entity_1.Notification]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllNotificationsOfUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => [chat_entity_1.Chat]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "readChatOfTravelByUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Arg)("guideId")),
    __param(1, (0, type_graphql_1.Arg)("amount")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "AdvancePaymentForGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getChatCount", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getChatCountOfGuide", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getChatCountOfTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("placeId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "addToFavourite", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("placeId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "removeFromFavourite", null);
__decorate([
    (0, type_graphql_1.Query)(() => [placefavourite_entity_1.FavouritPlace]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.USER])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getFavouritePlace", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)((of) => user_entity_1.User)
], UserResolver);
