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
exports.GuideResponse = exports.LoginResponse = void 0;
const guide_entity_1 = require("../../entities/guide/guide.entity");
const type_graphql_1 = require("type-graphql");
const guideDetails_entity_1 = require("../../entities/guide/guideDetails.entity");
const guideKyc_entity_1 = __importDefault(
  require("../../entities/guide/guideKyc.entity"),
);
let Token = class Token {
  accessToken;
  refreshToken;
};
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  Token.prototype,
  "accessToken",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  Token.prototype,
  "refreshToken",
  void 0,
);
Token = __decorate([(0, type_graphql_1.ObjectType)()], Token);
let LoginResponse = class LoginResponse {
  id;
  firstName;
  middleName;
  lastName;
  email;
  phoneNumber;
  gender;
  role;
  tokens;
  message;
  verified;
};
exports.LoginResponse = LoginResponse;
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "id",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "firstName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String),
  ],
  LoginResponse.prototype,
  "middleName",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "lastName",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "email",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "phoneNumber",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "gender",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "role",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(() => Token), __metadata("design:type", Token)],
  LoginResponse.prototype,
  "tokens",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  LoginResponse.prototype,
  "message",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Boolean)],
  LoginResponse.prototype,
  "verified",
  void 0,
);
exports.LoginResponse = LoginResponse = __decorate(
  [(0, type_graphql_1.ObjectType)()],
  LoginResponse,
);
let GuideResponse = class GuideResponse {
  guide;
  details;
  kyc;
};
exports.GuideResponse = GuideResponse;
__decorate(
  [
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide, { nullable: true }),
    __metadata("design:type", guide_entity_1.Guide),
  ],
  GuideResponse.prototype,
  "guide",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => guideDetails_entity_1.GuideDetails, {
      nullable: true,
    }),
    __metadata("design:type", guideDetails_entity_1.GuideDetails),
  ],
  GuideResponse.prototype,
  "details",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => guideKyc_entity_1.default, {
      nullable: true,
    }),
    __metadata("design:type", guideKyc_entity_1.default),
  ],
  GuideResponse.prototype,
  "kyc",
  void 0,
);
exports.GuideResponse = GuideResponse = __decorate(
  [(0, type_graphql_1.ObjectType)()],
  GuideResponse,
);
