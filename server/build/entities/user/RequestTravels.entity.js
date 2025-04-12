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
exports.RequestTravel = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_entity_1 = require("./user.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
const enum_1 = require("../../constant/enum");
let RequestTravel = class RequestTravel extends base_entity_1.default {
  from;
  to;
  totalDays;
  userBargain;
  travelBargain;
  totalPeople;
  vehicleType;
  status;
  price;
  advancePrice;
  paymentType;
  lastActionBy;
  user;
  travel;
};
exports.RequestTravel = RequestTravel;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "from" }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "from",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "to" }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "to",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_days" }),
    __metadata("design:type", Number),
  ],
  RequestTravel.prototype,
  "totalDays",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "user_bargain", nullable: true }),
    __metadata("design:type", Number),
  ],
  RequestTravel.prototype,
  "userBargain",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "travel_bargain", nullable: true }),
    __metadata("design:type", Number),
  ],
  RequestTravel.prototype,
  "travelBargain",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "total_people" }),
    __metadata("design:type", Number),
  ],
  RequestTravel.prototype,
  "totalPeople",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: "vehicle_type" }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "vehicleType",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.RequestStatus,
      default: enum_1.RequestStatus.PENDING,
    }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "status",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "price", nullable: true }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "price",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "advance_price", nullable: true }),
    __metadata("design:type", Number),
  ],
  RequestTravel.prototype,
  "advancePrice",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({
      type: "enum",
      enum: enum_1.PaymentType,
      nullable: true,
    }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "paymentType",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
      name: "last_action_by",
      type: "enum",
      enum: enum_1.Role,
      default: enum_1.Role.USER,
    }),
    __metadata("design:type", String),
  ],
  RequestTravel.prototype,
  "lastActionBy",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(
      () => user_entity_1.User,
      (user) => user.requestTravel,
      { cascade: true },
    ),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User),
  ],
  RequestTravel.prototype,
  "user",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel),
    (0, typeorm_1.ManyToOne)(
      () => travel_entity_1.Travel,
      (travel) => travel.requestedTravel,
      {
        cascade: true,
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "travel_id" }),
    __metadata("design:type", travel_entity_1.Travel),
  ],
  RequestTravel.prototype,
  "travel",
  void 0,
);
exports.RequestTravel = RequestTravel = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("request_travel")],
  RequestTravel,
);
