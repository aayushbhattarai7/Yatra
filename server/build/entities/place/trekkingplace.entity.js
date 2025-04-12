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
exports.TrekkingPlace = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const PlaceImages_entity_1 = __importDefault(require("./PlaceImages.entity"));
const placefavourite_entity_1 = require("./placefavourite.entity");
let TrekkingPlace = class TrekkingPlace extends base_entity_1.default {
    name;
    description;
    price;
    location;
    duration;
    latitude;
    longitude;
    images;
    favourite;
};
exports.TrekkingPlace = TrekkingPlace;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "price" }),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "location" }),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "duration" }),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "duration", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "latitude" }),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "latitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "longitude" }),
    __metadata("design:type", String)
], TrekkingPlace.prototype, "longitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [PlaceImages_entity_1.default]),
    (0, typeorm_1.OneToMany)(() => PlaceImages_entity_1.default, (images) => images.TrekkingPlace, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TrekkingPlace.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [placefavourite_entity_1.FavouritPlace]),
    (0, typeorm_1.OneToMany)(() => placefavourite_entity_1.FavouritPlace, (favourite) => favourite.place, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TrekkingPlace.prototype, "favourite", void 0);
exports.TrekkingPlace = TrekkingPlace = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("place")
], TrekkingPlace);
