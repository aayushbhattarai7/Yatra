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
exports.RevenueGroupedResponse = void 0;
const type_graphql_1 = require("type-graphql");
let RevenueEntry = class RevenueEntry {
  name;
  revenue;
};
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  RevenueEntry.prototype,
  "name",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Number)],
  RevenueEntry.prototype,
  "revenue",
  void 0,
);
RevenueEntry = __decorate([(0, type_graphql_1.ObjectType)()], RevenueEntry);
let RevenueGroupedResponse = class RevenueGroupedResponse {
  daily;
  weekly;
  monthly;
  yearly;
};
exports.RevenueGroupedResponse = RevenueGroupedResponse;
__decorate(
  [
    (0, type_graphql_1.Field)(() => [RevenueEntry]),
    __metadata("design:type", Array),
  ],
  RevenueGroupedResponse.prototype,
  "daily",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [RevenueEntry]),
    __metadata("design:type", Array),
  ],
  RevenueGroupedResponse.prototype,
  "weekly",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [RevenueEntry]),
    __metadata("design:type", Array),
  ],
  RevenueGroupedResponse.prototype,
  "monthly",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => [RevenueEntry]),
    __metadata("design:type", Array),
  ],
  RevenueGroupedResponse.prototype,
  "yearly",
  void 0,
);
exports.RevenueGroupedResponse = RevenueGroupedResponse = __decorate(
  [(0, type_graphql_1.ObjectType)()],
  RevenueGroupedResponse,
);
