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
exports.Travel = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const enum_1 = require("../../constant/enum");
const location_entity_1 = require("../location/location.entity");
const travelKyc_entity_1 = __importDefault(require("./travelKyc.entity"));
const travelDetails_entity_1 = require("./travelDetails.entity");
const RequestTravels_entity_1 = require("../../entities/user/RequestTravels.entity");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const room_entity_1 = require("../../entities/chat/room.entity");
const rating_entity_1 = require("../../entities/ratings/rating.entity");
let Travel = class Travel extends base_entity_1.default {
  firstName;
  middleName;
  lastName;
  role;
  email;
  phoneNumber;
  gender;
  password;
  otp;
  verified;
  approved;
  approval;
  vehicleType;
  connects;
  available;
  approveStatus;
  location;
  ratings;
  kyc;
  details;
  requestedTravel;
  notifications;
  notification;
  sendMessage;
  receiveMessage;
  travels;
};
exports.Travel = Travel;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "first_name" }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "firstName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "middle_name", nullable: true }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "middleName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "last_name" }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "lastName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.Role,
      default: enum_1.Role.TRAVEL,
    }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "role",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "email", unique: true }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "email",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "phone_number", unique: true }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "phoneNumber",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.Gender }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "gender",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "password", select: false }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "password",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "otp", nullable: true }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "otp",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "verified", default: false }),
    __metadata("design:type", Boolean),
  ],
  Travel.prototype,
  "verified",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "approved", default: false }),
    __metadata("design:type", Boolean),
  ],
  Travel.prototype,
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
  Travel.prototype,
  "approval",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "vehicle_type" }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "vehicleType",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "connects", nullable: true }),
    __metadata("design:type", Number),
  ],
  Travel.prototype,
  "connects",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "available", default: true }),
    __metadata("design:type", Boolean),
  ],
  Travel.prototype,
  "available",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "approve_status", nullable: true }),
    __metadata("design:type", String),
  ],
  Travel.prototype,
  "approveStatus",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => location_entity_1.Location),
    (0, typeorm_1.OneToOne)(
      () => location_entity_1.Location,
      (location) => location.travel,
      { cascade: true },
    ),
    __metadata("design:type", location_entity_1.Location),
  ],
  Travel.prototype,
  "location",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [rating_entity_1.Rating], {
      nullable: true,
    }),
    (0, typeorm_1.OneToMany)(
      () => rating_entity_1.Rating,
      (rating) => rating.travel,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "ratings",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [travelKyc_entity_1.default]),
    (0, typeorm_1.OneToMany)(
      () => travelKyc_entity_1.default,
      (kyc) => kyc.travels,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "kyc",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => travelDetails_entity_1.TravelDetails),
    (0, typeorm_1.OneToOne)(
      () => travelDetails_entity_1.TravelDetails,
      (details) => details.travelz,
      {
        cascade: true,
      },
    ),
    __metadata("design:type", travelDetails_entity_1.TravelDetails),
  ],
  Travel.prototype,
  "details",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => RequestTravels_entity_1.RequestTravel),
    (0, typeorm_1.ManyToOne)(
      () => RequestTravels_entity_1.RequestTravel,
      (requestedTravel) => requestedTravel.travel,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", RequestTravels_entity_1.RequestTravel),
  ],
  Travel.prototype,
  "requestedTravel",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(
      () => notification_entity_1.Notification,
      (notifications) => notifications.receiverTravel,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "notifications",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(
      () => notification_entity_1.Notification,
      (notification) => notification.senderTravel,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "notification",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => chat_entity_1.Chat,
      (chat) => chat.senderTravel,
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "sendMessage",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => chat_entity_1.Chat,
      (chat) => chat.receiverTravel,
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "receiveMessage",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => room_entity_1.Room,
      (room) => room.travel,
    ),
    __metadata("design:type", Array),
  ],
  Travel.prototype,
  "travels",
  void 0,
);
exports.Travel = Travel = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("travel")],
  Travel,
);
