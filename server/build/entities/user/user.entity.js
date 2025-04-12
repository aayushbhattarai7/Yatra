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
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const enum_1 = require("../../constant/enum");
const location_entity_1 = require("../location/location.entity");
const RequestTravels_entity_1 = require("./RequestTravels.entity");
const RequestGuide_entities_1 = require("./RequestGuide.entities");
const bookHotel_entity_1 = require("../../entities/hotels/bookHotel.entity");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const room_entity_1 = require("../../entities/chat/room.entity");
const rating_entity_1 = require("../../entities/ratings/rating.entity");
const userImage_entity_1 = __importDefault(require("./userImage.entity"));
const placefavourite_entity_1 = require("../../entities/place/placefavourite.entity");
let User = class User extends base_entity_1.default {
    firstName;
    middleName;
    lastName;
    role;
    email;
    phoneNumber;
    verified;
    gender;
    password;
    tokens;
    available;
    otp;
    location;
    rating;
    bookHotel;
    requestTravel;
    requestGuide;
    notification;
    notifications;
    sendMessage;
    receiveMessage;
    users;
    image;
    favourite;
};
exports.User = User;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "first_name" }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "middle_name", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "last_name" }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.Role, default: enum_1.Role.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "email", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "phone_number", unique: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "verified", nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.Gender }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "password", select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "tokens", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "tokens", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "available", default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "available", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "otp", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => location_entity_1.Location, { nullable: true }),
    (0, typeorm_1.OneToOne)(() => location_entity_1.Location, (location) => location.user, { cascade: true }),
    __metadata("design:type", location_entity_1.Location)
], User.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => rating_entity_1.Rating),
    (0, typeorm_1.OneToOne)(() => rating_entity_1.Rating, (rating) => rating.user, { cascade: true }),
    __metadata("design:type", rating_entity_1.Rating)
], User.prototype, "rating", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => bookHotel_entity_1.BookHotel),
    (0, typeorm_1.OneToOne)(() => bookHotel_entity_1.BookHotel, (bookHotel) => bookHotel.user, { cascade: true }),
    __metadata("design:type", bookHotel_entity_1.BookHotel)
], User.prototype, "bookHotel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [RequestTravels_entity_1.RequestTravel]),
    (0, typeorm_1.OneToMany)(() => RequestTravels_entity_1.RequestTravel, (requestTravel) => requestTravel.user, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "requestTravel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [RequestGuide_entities_1.RequestGuide]),
    (0, typeorm_1.OneToMany)(() => RequestGuide_entities_1.RequestGuide, (requestGuide) => requestGuide.users, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "requestGuide", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.senderUser, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "notification", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.receiverUser, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [chat_entity_1.Chat]),
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.senderUser),
    __metadata("design:type", Array)
], User.prototype, "sendMessage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [chat_entity_1.Chat]),
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.receiverUser),
    __metadata("design:type", Array)
], User.prototype, "receiveMessage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [room_entity_1.Room]),
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.user),
    __metadata("design:type", Array)
], User.prototype, "users", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [userImage_entity_1.default], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => userImage_entity_1.default, (image) => image.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [placefavourite_entity_1.FavouritPlace], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => placefavourite_entity_1.FavouritPlace, (favourite) => favourite.user),
    __metadata("design:type", Array)
], User.prototype, "favourite", void 0);
exports.User = User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("user")
], User);
