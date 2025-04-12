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
exports.PlaceResolver = void 0;
const type_graphql_1 = require("type-graphql");
const admin_entity_1 = require("../../entities/admin/admin.entity");
const trekkingplace_entity_1 = require("../../entities/place/trekkingplace.entity");
const place_service_1 = __importDefault(require("../../service/place.service"));
const place_dto_1 = require("../../dto/place.dto");
let PlaceResolver = class PlaceResolver {
    async addTrekkingPlace(admin_id, data, image) {
        return place_service_1.default.addTrekkingPlace(admin_id, data, image);
    }
};
exports.PlaceResolver = PlaceResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    UseGuards(admin_entity_1.Admin),
    __param(0, (0, type_graphql_1.Args)("admin_id")),
    __param(1, (0, type_graphql_1.Args)("data")),
    __param(2, (0, type_graphql_1.Args)({ name: "image", type: () => { const [GraphQLUpload], nullable; } })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, place_dto_1.PlaceDTO, Array]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "addTrekkingPlace", null);
exports.PlaceResolver = PlaceResolver = __decorate([
    (0, type_graphql_1.Resolver)((of) => trekkingplace_entity_1.TrekkingPlace)
], PlaceResolver);
 > {
    throw: new Error("Function not implemented.")
};
