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
exports.TravelDTO = void 0;
const class_validator_1 = require("class-validator");
const enum_1 = require("../constant/enum");
const type_graphql_1 = require("type-graphql");
let TravelDTO = class TravelDTO {
    firstName;
    middleName;
    lastName;
    kycType;
    email;
    phoneNumber;
    DOB;
    nationality;
    province;
    district;
    municipality;
    engineNumber;
    chasisNumber;
    vehicleNumber;
    vehicleType;
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
    latitude;
    longitude;
};
exports.TravelDTO = TravelDTO;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "middleName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "kycType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], TravelDTO.prototype, "DOB", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "nationality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "municipality", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "engineNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "chasisNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "vehicleNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "vehicleType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "citizenshipId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], TravelDTO.prototype, "citizenshipIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "citizenshipIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "passportId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], TravelDTO.prototype, "passportIssueDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], TravelDTO.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "passportIssueFrom", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "voterId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "voterAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.Gender, { message: "Invalid Gender" }),
    __metadata("design:type", String)
], TravelDTO.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "latitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TravelDTO.prototype, "longitude", void 0);
exports.TravelDTO = TravelDTO = __decorate([
    (0, type_graphql_1.InputType)()
], TravelDTO);
