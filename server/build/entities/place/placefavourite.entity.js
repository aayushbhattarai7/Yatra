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
exports.FavouritPlace = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const trekkingplace_entity_1 = require("./trekkingplace.entity");
const user_entity_1 = require("../../entities/user/user.entity");
let FavouritPlace = class FavouritPlace extends base_entity_1.default {
    place;
    user;
};
exports.FavouritPlace = FavouritPlace;
__decorate([
    (0, type_graphql_1.Field)(() => trekkingplace_entity_1.TrekkingPlace),
    (0, typeorm_1.ManyToOne)(() => trekkingplace_entity_1.TrekkingPlace, (place) => place.favourite, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "place_id" }),
    __metadata("design:type", trekkingplace_entity_1.TrekkingPlace)
], FavouritPlace.prototype, "place", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.favourite, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], FavouritPlace.prototype, "user", void 0);
exports.FavouritPlace = FavouritPlace = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("favourite_place")
], FavouritPlace);
