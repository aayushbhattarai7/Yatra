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
exports.GuideDetails = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const guide_entity_1 = require("./guide.entity");
let GuideDetails = class GuideDetails extends base_entity_1.default {
    DOB;
    nationality;
    province;
    district;
    municipality;
    licenseNumber;
    licenseValidityFrom;
    licenseValidityTo;
    citizenshipId;
    citizenshipIssueDate;
    citizenshipIssueFrom;
    passportId;
    passportIssueDate;
    passportExpiryDate;
    passportIssueFrom;
    voterId;
    voterAddress;
    guide;
};
exports.GuideDetails = GuideDetails;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "date_of_birth" }),
    __metadata("design:type", Date)
], GuideDetails.prototype, "DOB", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "nationality" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "nationality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "province" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "district" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "municipality" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "municipality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "license_number" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "licenseNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "license_validity_from" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "licenseValidityFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "license_validity_to" }),
    __metadata("design:type", String)
], GuideDetails.prototype, "licenseValidityTo", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_id", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "citizenshipId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_issue_date", nullable: true }),
    __metadata("design:type", Date)
], GuideDetails.prototype, "citizenshipIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "citizenship_issue_from", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "citizenshipIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_id", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "passportId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_issue_date", nullable: true }),
    __metadata("design:type", Date)
], GuideDetails.prototype, "passportIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_expiry_date", nullable: true }),
    __metadata("design:type", Date)
], GuideDetails.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "passport_issue_from", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "passportIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "voter_id", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "voterId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "voter_address", nullable: true }),
    __metadata("design:type", String)
], GuideDetails.prototype, "voterAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide),
    (0, typeorm_1.OneToOne)(() => guide_entity_1.Guide, (guide) => guide.details, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "travel_id" }),
    __metadata("design:type", guide_entity_1.Guide)
], GuideDetails.prototype, "guide", void 0);
exports.GuideDetails = GuideDetails = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("guide_details")
], GuideDetails);
