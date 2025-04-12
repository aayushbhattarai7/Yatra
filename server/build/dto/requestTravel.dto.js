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
exports.TravelRequestDTO = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let TravelRequestDTO = class TravelRequestDTO {
  from;
  to;
  totalDays;
  totalPeople;
  vehicleType;
  price;
  DOB;
};
exports.TravelRequestDTO = TravelRequestDTO;
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  TravelRequestDTO.prototype,
  "from",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  TravelRequestDTO.prototype,
  "to",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  TravelRequestDTO.prototype,
  "totalDays",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  TravelRequestDTO.prototype,
  "totalPeople",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String),
  ],
  TravelRequestDTO.prototype,
  "vehicleType",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  TravelRequestDTO.prototype,
  "price",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Date)],
  TravelRequestDTO.prototype,
  "DOB",
  void 0,
);
exports.TravelRequestDTO = TravelRequestDTO = __decorate(
  [(0, type_graphql_1.InputType)()],
  TravelRequestDTO,
);
