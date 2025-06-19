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
exports.Hotel = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../base.entity"));
const enum_1 = require("../../constant/enum");
const location_entity_1 = require("../location/location.entity");
const hotelKyc_entity_1 = __importDefault(require("./hotelKyc.entity"));
const hotelDetails_entity_1 = require("./hotelDetails.entity");
const bookHotel_entity_1 = require("./bookHotel.entity");
let Hotel = class Hotel extends base_entity_1.default {
  hotelName;
  role;
  email;
  phoneNumber;
  password;
  otp;
  verified;
  approved;
  approval;
  available;
  approveStatus;
  location;
  book;
  kyc;
  details;
};
exports.Hotel = Hotel;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "hotel_name" }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "hotelName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.Role,
      default: enum_1.Role.HOTEL,
    }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "role",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "email", unique: true }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "email",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "phone_number", unique: true }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "phoneNumber",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "password", select: false }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "password",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "otp", nullable: true }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "otp",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "verified", default: false }),
    __metadata("design:type", Boolean),
  ],
  Hotel.prototype,
  "verified",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "approved", default: false }),
    __metadata("design:type", Boolean),
  ],
  Hotel.prototype,
  "approved",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.Status,
      default: enum_1.Status.PENDING,
    }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "approval",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "available", default: true }),
    __metadata("design:type", Boolean),
  ],
  Hotel.prototype,
  "available",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "approve_status", nullable: true }),
    __metadata("design:type", String),
  ],
  Hotel.prototype,
  "approveStatus",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => location_entity_1.Location),
    (0, typeorm_1.OneToOne)(
      () => location_entity_1.Location,
      (location) => location.hotel,
      { cascade: true },
    ),
    __metadata("design:type", location_entity_1.Location),
  ],
  Hotel.prototype,
  "location",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [bookHotel_entity_1.BookHotel]),
    (0, typeorm_1.OneToMany)(
      () => bookHotel_entity_1.BookHotel,
      (book) => book.hotel,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Hotel.prototype,
  "book",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [hotelKyc_entity_1.default]),
    (0, typeorm_1.OneToMany)(
      () => hotelKyc_entity_1.default,
      (kyc) => kyc.hotel,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Hotel.prototype,
  "kyc",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => hotelDetails_entity_1.HotelDetails),
    (0, typeorm_1.OneToOne)(
      () => hotelDetails_entity_1.HotelDetails,
      (details) => details.hotel,
      {
        cascade: true,
      },
    ),
    __metadata("design:type", hotelDetails_entity_1.HotelDetails),
  ],
  Hotel.prototype,
  "details",
  void 0,
);
exports.Hotel = Hotel = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("hotel")],
  Hotel,
);
