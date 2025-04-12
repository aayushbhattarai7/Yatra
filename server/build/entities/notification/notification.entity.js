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
exports.Notification = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_entity_1 = require("../user/user.entity");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
let Notification = class Notification extends base_entity_1.default {
  message;
  isRead;
  senderUser;
  receiverUser;
  senderGuide;
  receiverGuide;
  receiverTravel;
  senderTravel;
};
exports.Notification = Notification;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "message" }),
    __metadata("design:type", String),
  ],
  Notification.prototype,
  "message",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean),
  ],
  Notification.prototype,
  "isRead",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(
      () => user_entity_1.User,
      (user) => user.notification,
      {
        cascade: true,
        nullable: true,
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "sender_user_id" }),
    __metadata("design:type", user_entity_1.User),
  ],
  Notification.prototype,
  "senderUser",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(
      () => user_entity_1.User,
      (users) => users.notifications,
      {
        cascade: true,
        nullable: true,
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "receiver_user_id" }),
    __metadata("design:type", user_entity_1.User),
  ],
  Notification.prototype,
  "receiverUser",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide),
    (0, typeorm_1.ManyToOne)(
      () => guide_entity_1.Guide,
      (guide) => guide.notification,
      {
        cascade: true,
        nullable: true,
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "sender_guide_id" }),
    __metadata("design:type", guide_entity_1.Guide),
  ],
  Notification.prototype,
  "senderGuide",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide),
    (0, typeorm_1.ManyToOne)(
      () => guide_entity_1.Guide,
      (guide) => guide.notifications,
      { cascade: true },
    ),
    (0, typeorm_1.JoinColumn)({ name: "receiver_guide_id" }),
    __metadata("design:type", guide_entity_1.Guide),
  ],
  Notification.prototype,
  "receiverGuide",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel),
    (0, typeorm_1.ManyToOne)(
      () => travel_entity_1.Travel,
      (travel) => travel.notifications,
      { cascade: true },
    ),
    (0, typeorm_1.JoinColumn)({ name: "receiver_travel_id" }),
    __metadata("design:type", travel_entity_1.Travel),
  ],
  Notification.prototype,
  "receiverTravel",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel),
    (0, typeorm_1.ManyToOne)(
      () => travel_entity_1.Travel,
      (travel) => travel.notification,
      { cascade: true },
    ),
    (0, typeorm_1.JoinColumn)({ name: "sender_travel_id" }),
    __metadata("design:type", travel_entity_1.Travel),
  ],
  Notification.prototype,
  "senderTravel",
  void 0,
);
exports.Notification = Notification = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("notification")],
  Notification,
);
