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
exports.TravelDetails = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const travel_entity_1 = require("./travel.entity");
let TravelDetails = class TravelDetails extends base_entity_1.default {
    DOB;
    nationality;
    province;
    district;
    municipality;
    citizenshipId;
    citizenshipIssueDate;
    citizenshipIssueFrom;
    engineNumber;
    chasisNumber;
    vehicleNumber;
    passportId;
    passportIssueDate;
    passportExpiryDate;
    passportIssueFrom;
    voterId;
    voterAddress;
    travelz;
};
exports.TravelDetails = TravelDetails;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "date_of_birth" }),
    __metadata("design:type", Date)
], TravelDetails.prototype, "DOB", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "nationality" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "nationality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "province" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "district" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "municipality" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "municipality", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_id", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "citizenshipId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_issue_date", nullable: true }),
    __metadata("design:type", Date)
], TravelDetails.prototype, "citizenshipIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_issue_from", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "citizenshipIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "engine_number" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "engineNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "chasis_number" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "chasisNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "vehicle_number" }),
    __metadata("design:type", String)
], TravelDetails.prototype, "vehicleNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_id", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "passportId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_issue_date", nullable: true }),
    __metadata("design:type", Date)
], TravelDetails.prototype, "passportIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_expiry_date", nullable: true }),
    __metadata("design:type", Date)
], TravelDetails.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_issue_from", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "passportIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "voter_id", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "voterId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "voter_address", nullable: true }),
    __metadata("design:type", String)
], TravelDetails.prototype, "voterAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel),
    (0, typeorm_1.OneToOne)(() => travel_entity_1.Travel, (travels) => travels.details, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "travel_id" }),
    __metadata("design:type", travel_entity_1.Travel)
], TravelDetails.prototype, "travelz", void 0);
exports.TravelDetails = TravelDetails = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("travel_details")
], TravelDetails);
