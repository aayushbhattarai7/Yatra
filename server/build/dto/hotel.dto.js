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
exports.HotelDTO = void 0;
const class_validator_1 = require("class-validator");
class HotelDTO {
    hotelName;
    email;
    phoneNumber;
    pan_issue_date;
    province;
    district;
    municipality;
    panNumber;
    licenseValidityFrom;
    nameOfTaxPayer;
    businessName;
    citizenshipId;
    citizenshipIssueDate;
    citizenshipIssueFrom;
    passportId;
    passportIssueDate;
    passportExpiryDate;
    passportIssueFrom;
    voterId;
    voterAddress;
    password;
}
exports.HotelDTO = HotelDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "hotelName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "pan_issue_date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "municipality", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "panNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "licenseValidityFrom", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "nameOfTaxPayer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "businessName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "citizenshipId", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HotelDTO.prototype, "citizenshipIssueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "citizenshipIssueFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "passportId", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HotelDTO.prototype, "passportIssueDate", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HotelDTO.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "passportIssueFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "voterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "voterAddress", void 0);
__decorate([
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], HotelDTO.prototype, "password", void 0);
