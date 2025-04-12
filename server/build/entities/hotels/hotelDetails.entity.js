"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelDetails = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const hotel_entity_1 = require("./hotel.entity");
let HotelDetails = class HotelDetails extends base_entity_1.default {
  pan_issue_date;
  province;
  district;
  municipality;
  citizenshipId;
  citizenshipIssueDate;
  citizenshipIssueFrom;
  panNumber;
  nameOfTaxPayer;
  businessName;
  passportId;
  passportIssueDate;
  passportExpiryDate;
  passportIssueFrom;
  voterId;
  voterAddress;
  hotel;
};
exports.HotelDetails = HotelDetails;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "pan_issue_date" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "pan_issue_date",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "province" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "province",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "district" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "district",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "municipality" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "municipality",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "citizenship_id", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "citizenshipId",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "citizenship_issue_date", nullable: true }),
    __metadata("design:type", Date),
  ],
  HotelDetails.prototype,
  "citizenshipIssueDate",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "citizenship_issue_from", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "citizenshipIssueFrom",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "pan_number" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "panNumber",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "name_of_tax_payer" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "nameOfTaxPayer",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "business_name" }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "businessName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "passport_id", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "passportId",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "passport_issue_date", nullable: true }),
    __metadata("design:type", Date),
  ],
  HotelDetails.prototype,
  "passportIssueDate",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "passport_expiry_date", nullable: true }),
    __metadata("design:type", Date),
  ],
  HotelDetails.prototype,
  "passportExpiryDate",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "passport_issue_from", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "passportIssueFrom",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "voter_id", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "voterId",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "voter_address", nullable: true }),
    __metadata("design:type", String),
  ],
  HotelDetails.prototype,
  "voterAddress",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => hotel_entity_1.Hotel),
    (0, typeorm_1.OneToOne)(
      () => hotel_entity_1.Hotel,
      (hotel) => hotel.details,
      {
        onDelete: "CASCADE",
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "hotel_id" }),
    __metadata("design:type", hotel_entity_1.Hotel),
  ],
  HotelDetails.prototype,
  "hotel",
  void 0,
);
exports.HotelDetails = HotelDetails = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("hotel_details")],
  HotelDetails,
);
