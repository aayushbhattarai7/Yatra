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
exports.AdminResolver = void 0;
const type_graphql_1 = require("type-graphql");
const webToken_service_1 = __importDefault(require("../../service/webToken.service"));
const schema_1 = require("../../graphql/schema/schema");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
const HttpException_utils_1 = __importDefault(require("../../utils/HttpException.utils"));
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const authorization_middleware_1 = require("../../middleware/authorization.middleware");
const enum_1 = require("../../constant/enum");
const admin_service_1 = __importDefault(require("../../service/admin.service"));
const admin_entity_1 = require("../../entities/admin/admin.entity");
const message_1 = require("../../constant/message");
const trekkingplace_entity_1 = require("../../entities/place/trekkingplace.entity");
const place_service_1 = __importDefault(require("../../service/place.service"));
const user_entity_1 = require("../../entities/user/user.entity");
const RevenueSchems_1 = require("../../graphql/schema/RevenueSchems");
let AdminResolver = class AdminResolver {
    async adminLogin(email, password) {
        try {
            const data = { email, password };
            const admin = await admin_service_1.default.login(data);
            const tokens = webToken_service_1.default.generateTokens({ id: admin.id }, admin.role);
            return {
                id: admin.id,
                email: admin.email,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                message: message_1.Message.LoggedIn,
            };
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getGuideApprovalRequestByAdmin(ctx) {
        try {
            const id = ctx.req.user?.id;
            const admin = await admin_service_1.default.getGuideApprovalRequest(id);
            return admin;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getTravelApprovalRequestByAdmin(ctx) {
        try {
            const id = ctx.req.user?.id;
            const admin = await admin_service_1.default.getTravelApprovalRequest(id);
            return admin;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async approveTravel(ctx, travelId) {
        try {
            const adminId = ctx.req.user?.id;
            console.log("🚀 ~ AdminResolver ~ approveTravel ~ adminId:", adminId);
            return await admin_service_1.default.approveTravel(adminId, travelId);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async approveGuide(ctx, guideId) {
        try {
            const adminId = ctx.req.user?.id;
            return await admin_service_1.default.approveGuide(adminId, guideId);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async rejectTravel(ctx, travelId, message) {
        try {
            const adminId = ctx.req.user?.id;
            return await admin_service_1.default.rejectTravel(adminId, travelId, message);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAdmin(ctx) {
        try {
            const id = ctx.req.user?.id;
            const user = await admin_service_1.default.getAdmin(id);
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getPlacesByAdmin(ctx) {
        try {
            const place = await place_service_1.default.getPlaces();
            return place;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async rejectGuide(ctx, guideId, message) {
        try {
            const adminId = ctx.req.user?.id;
            return await admin_service_1.default.rejectGuide(adminId, guideId, message);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async deletePlace(ctx, placeId) {
        try {
            const adminId = ctx.req.user?.id;
            return await place_service_1.default.deletePlace(adminId, placeId);
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllUsers(ctx) {
        try {
            const user = await admin_service_1.default.getAllUsers();
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllGuides(ctx) {
        try {
            const user = await admin_service_1.default.getAllGuides();
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getHighestRatedGuides(ctx) {
        try {
            const user = await admin_service_1.default.getHighestRatingGuides();
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllTravels(ctx) {
        try {
            const user = await admin_service_1.default.getAllTravels();
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getHighestratedTravels(ctx) {
        try {
            const user = await admin_service_1.default.getHighestRatingTravels();
            return user;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getTotalRevenueByAdmin(ctx) {
        try {
            const revenue = await admin_service_1.default.getTotalRevenue();
            return revenue;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getGroupedRevenue() {
        return admin_service_1.default.getGroupedRevenue();
    }
};
exports.AdminResolver = AdminResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => schema_1.LoginResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminLogin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [guide_entity_1.Guide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getGuideApprovalRequestByAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [travel_entity_1.Travel]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getTravelApprovalRequestByAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("travel_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "approveTravel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("guide_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "approveGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("travel_id")),
    __param(2, (0, type_graphql_1.Arg)("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "rejectTravel", null);
__decorate([
    (0, type_graphql_1.Query)(() => admin_entity_1.Admin),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [trekkingplace_entity_1.TrekkingPlace]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getPlacesByAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("guide_id")),
    __param(2, (0, type_graphql_1.Arg)("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "rejectGuide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("placeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "deletePlace", null);
__decorate([
    (0, type_graphql_1.Query)(() => [user_entity_1.User]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getAllUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => [guide_entity_1.Guide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getAllGuides", null);
__decorate([
    (0, type_graphql_1.Query)(() => [guide_entity_1.Guide]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getHighestRatedGuides", null);
__decorate([
    (0, type_graphql_1.Query)(() => [travel_entity_1.Travel]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getAllTravels", null);
__decorate([
    (0, type_graphql_1.Query)(() => [travel_entity_1.Travel]),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getHighestratedTravels", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)([enum_1.Role.ADMIN])),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getTotalRevenueByAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => RevenueSchems_1.RevenueGroupedResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getGroupedRevenue", null);
exports.AdminResolver = AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)((of) => admin_entity_1.Admin)
], AdminResolver);
