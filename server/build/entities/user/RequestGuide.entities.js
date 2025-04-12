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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGuide = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_entity_1 = require("./user.entity");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const enum_1 = require("../../constant/enum");
let RequestGuide = class RequestGuide extends base_entity_1.default {
    from;
    to;
    totalDays;
    totalPeople;
    userBargain;
    guideBargain;
    status;
    paymentType;
    price;
    advancePrice;
    lastActionBy;
    users;
    guide;
};
exports.RequestGuide = RequestGuide;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "from" }),
    __metadata("design:type", String)
], RequestGuide.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "to" }),
    __metadata("design:type", String)
], RequestGuide.prototype, "to", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_days" }),
    __metadata("design:type", String)
], RequestGuide.prototype, "totalDays", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_people" }),
    __metadata("design:type", String)
], RequestGuide.prototype, "totalPeople", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "user_bargain", nullable: true }),
    __metadata("design:type", Number)
], RequestGuide.prototype, "userBargain", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "guide_bargain", nullable: true }),
    __metadata("design:type", Number)
], RequestGuide.prototype, "guideBargain", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.RequestStatus, default: enum_1.RequestStatus.PENDING }),
    __metadata("design:type", String)
], RequestGuide.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.PaymentType, nullable: true }),
    __metadata("design:type", String)
], RequestGuide.prototype, "paymentType", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "price", nullable: true }),
    __metadata("design:type", String)
], RequestGuide.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "advance_price", nullable: true }),
    __metadata("design:type", Number)
], RequestGuide.prototype, "advancePrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        name: "last_action_by",
        type: "enum",
        enum: enum_1.Role,
        default: enum_1.Role.USER,
    }),
    __metadata("design:type", String)
], RequestGuide.prototype, "lastActionBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.requestGuide, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], RequestGuide.prototype, "users", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide),
    (0, typeorm_1.ManyToOne)(() => guide_entity_1.Guide, (guide) => guide.requestedGuide, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "guide_id" }),
    __metadata("design:type", guide_entity_1.Guide)
], RequestGuide.prototype, "guide", void 0);
exports.RequestGuide = RequestGuide = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("request_guide")
], RequestGuide);
