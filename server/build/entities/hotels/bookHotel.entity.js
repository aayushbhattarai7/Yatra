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
exports.BookHotel = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_entity_1 = require("../user/user.entity");
const hotel_entity_1 = require("../../entities/hotels/hotel.entity");
let BookHotel = class BookHotel extends base_entity_1.default {
    from;
    to;
    totalDays;
    totalPeople;
    roomSIze;
    user;
    hotel;
};
exports.BookHotel = BookHotel;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "from" }),
    __metadata("design:type", String)
], BookHotel.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "to" }),
    __metadata("design:type", String)
], BookHotel.prototype, "to", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_days" }),
    __metadata("design:type", Number)
], BookHotel.prototype, "totalDays", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_people" }),
    __metadata("design:type", Number)
], BookHotel.prototype, "totalPeople", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "room_size" }),
    __metadata("design:type", Number)
], BookHotel.prototype, "roomSIze", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.bookHotel, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], BookHotel.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => hotel_entity_1.Hotel),
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, (hotel) => hotel.book, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hotel_id" }),
    __metadata("design:type", hotel_entity_1.Hotel)
], BookHotel.prototype, "hotel", void 0);
exports.BookHotel = BookHotel = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("book_hotel")
], BookHotel);
