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
exports.Rating = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_entity_1 = require("../user/user.entity");
const guide_entity_1 = require("../guide/guide.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
let Rating = class Rating extends base_entity_1.default {
    rating;
    message;
    user;
    guide;
    travel;
};
exports.Rating = Rating;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "rating", type: "float" }),
    __metadata("design:type", Number)
], Rating.prototype, "rating", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "message" }),
    __metadata("design:type", String)
], Rating.prototype, "message", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.rating, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Rating.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => guide_entity_1.Guide, (guide) => guide.ratings, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "guide_id" }),
    __metadata("design:type", guide_entity_1.Guide)
], Rating.prototype, "guide", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => travel_entity_1.Travel, (travel) => travel.ratings, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "travel_id" }),
    __metadata("design:type", travel_entity_1.Travel)
], Rating.prototype, "travel", void 0);
exports.Rating = Rating = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("rating")
], Rating);
