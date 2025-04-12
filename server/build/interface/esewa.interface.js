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
exports.PaymentDetails = void 0;
const type_graphql_1 = require("type-graphql");
let PaymentDetails = class PaymentDetails {
  transaction_uuid;
  signature;
  amount;
  tax_amount;
  total_amount;
  product_code;
  success_url;
  failure_url;
};
exports.PaymentDetails = PaymentDetails;
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PaymentDetails.prototype,
  "transaction_uuid",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PaymentDetails.prototype,
  "signature",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Number)],
  PaymentDetails.prototype,
  "amount",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Number)],
  PaymentDetails.prototype,
  "tax_amount",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", Number)],
  PaymentDetails.prototype,
  "total_amount",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PaymentDetails.prototype,
  "product_code",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PaymentDetails.prototype,
  "success_url",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PaymentDetails.prototype,
  "failure_url",
  void 0,
);
exports.PaymentDetails = PaymentDetails = __decorate(
  [(0, type_graphql_1.ObjectType)()],
  PaymentDetails,
);
