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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const enum_1 = require("../constant/enum");
let UserDTO = class UserDTO {
  firstName;
  middleName;
  lastName;
  role;
  email;
  phoneNumber;
  gender;
  password;
};
exports.UserDTO = UserDTO;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "firstName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "middleName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "lastName",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.Role, { message: "Invalid Gender" }),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "role",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "email",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "phoneNumber",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEnum)(enum_1.Gender, { message: "Invalid Gender" }),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "gender",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String),
  ],
  UserDTO.prototype,
  "password",
  void 0,
);
exports.UserDTO = UserDTO = __decorate(
  [(0, type_graphql_1.InputType)()],
  UserDTO,
);
