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
exports.Guide = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const enum_1 = require("../../constant/enum");
const location_entity_1 = require("../location/location.entity");
const guideKyc_entity_1 = __importDefault(require("./guideKyc.entity"));
const guideDetails_entity_1 = require("./guideDetails.entity");
const RequestGuide_entities_1 = require("../../entities/user/RequestGuide.entities");
const notification_entity_1 = require("../../entities/notification/notification.entity");
const chat_entity_1 = require("../../entities/chat/chat.entity");
const room_entity_1 = require("../../entities/chat/room.entity");
const rating_entity_1 = require("../../entities/ratings/rating.entity");
let Guide = class Guide extends base_entity_1.default {
  firstName;
  middleName;
  lastName;
  role;
  email;
  phoneNumber;
  guiding_location;
  connects;
  gender;
  password;
  otp;
  available;
  verified;
  approved;
  approval;
  approveStatus;
  location;
  ratings;
  details;
  kyc;
  requestedGuide;
  notification;
  notifications;
  sendMessage;
  receiveMessage;
  guides;
};
exports.Guide = Guide;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "first_name" }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "firstName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "middle_name", nullable: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "middleName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "last_name" }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "lastName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.Role,
      default: enum_1.Role.GUIDE,
    }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "role",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "email", unique: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "email",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "phone_number", unique: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "phoneNumber",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "guiding_location", nullable: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "guiding_location",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "connects", nullable: true }),
    __metadata("design:type", Number),
  ],
  Guide.prototype,
  "connects",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.Gender }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "gender",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "password", select: false }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "password",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "otp", nullable: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "otp",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "available", default: true }),
    __metadata("design:type", Boolean),
  ],
  Guide.prototype,
  "available",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "verified", default: false }),
    __metadata("design:type", Boolean),
  ],
  Guide.prototype,
  "verified",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "approved", default: false }),
    __metadata("design:type", Boolean),
  ],
  Guide.prototype,
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
  Guide.prototype,
  "approval",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "approve_status", nullable: true }),
    __metadata("design:type", String),
  ],
  Guide.prototype,
  "approveStatus",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => location_entity_1.Location, {
      nullable: true,
    }),
    (0, typeorm_1.OneToOne)(
      () => location_entity_1.Location,
      (location) => location.guide,
      { cascade: true },
    ),
    __metadata("design:type", location_entity_1.Location),
  ],
  Guide.prototype,
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
      (ratings) => ratings.guide,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "ratings",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => guideDetails_entity_1.GuideDetails),
    (0, typeorm_1.OneToOne)(
      () => guideDetails_entity_1.GuideDetails,
      (details) => details.guide,
      { cascade: true },
    ),
    __metadata("design:type", guideDetails_entity_1.GuideDetails),
  ],
  Guide.prototype,
  "details",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [guideKyc_entity_1.default]),
    (0, typeorm_1.OneToMany)(
      () => guideKyc_entity_1.default,
      (kyc) => kyc.guide,
      { cascade: true },
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "kyc",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => RequestGuide_entities_1.RequestGuide),
    (0, typeorm_1.ManyToOne)(
      () => RequestGuide_entities_1.RequestGuide,
      (requestedGuide) => requestedGuide.guide,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", RequestGuide_entities_1.RequestGuide),
  ],
  Guide.prototype,
  "requestedGuide",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(
      () => notification_entity_1.Notification,
      (notification) => notification.senderGuide,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "notification",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [notification_entity_1.Notification]),
    (0, typeorm_1.OneToMany)(
      () => notification_entity_1.Notification,
      (notifications) => notifications.receiverGuide,
      {
        onDelete: "CASCADE",
      },
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "notifications",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => chat_entity_1.Chat,
      (chat) => chat.senderGuide,
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "sendMessage",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => chat_entity_1.Chat,
      (chat) => chat.receiverGuide,
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "receiveMessage",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => room_entity_1.Room,
      (room) => room.guide,
    ),
    __metadata("design:type", Array),
  ],
  Guide.prototype,
  "guides",
  void 0,
);
exports.Guide = Guide = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("guide")],
  Guide,
);
