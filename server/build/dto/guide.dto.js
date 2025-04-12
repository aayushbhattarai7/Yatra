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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideDTO = void 0;
const class_validator_1 = require("class-validator");
const enum_1 = require("../constant/enum");
const type_graphql_1 = require("type-graphql");
let GuideDTO = class GuideDTO {
    firstName;
    middleName;
    lastName;
    email;
    phoneNumber;
    role;
    DOB;
    nationality;
    province;
    district;
    municipality;
    kycType;
    licenseNumber;
    latitude;
    longitude;
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
    gender;
    password;
};
exports.GuideDTO = GuideDTO;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "middleName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.Role, { message: "Invalid Gender" }),
    __metadata("design:type", String)
], GuideDTO.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "DOB", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "nationality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "municipality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.KycType, { message: "Invalid Kyc" }),
    __metadata("design:type", String)
], GuideDTO.prototype, "kycType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "licenseNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "latitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "longitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "licenseValidityFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "licenseValidityTo", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "citizenshipId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GuideDTO.prototype, "citizenshipIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "citizenshipIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "passportId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GuideDTO.prototype, "passportIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GuideDTO.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "passportIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "voterId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GuideDTO.prototype, "voterAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.Gender, { message: "Invalid Gender" }),
    __metadata("design:type", String)
], GuideDTO.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], GuideDTO.prototype, "password", void 0);
exports.GuideDTO = GuideDTO = __decorate([
    (0, type_graphql_1.InputType)()
], GuideDTO);
