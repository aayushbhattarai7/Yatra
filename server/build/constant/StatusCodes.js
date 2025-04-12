"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = void 0;
var StatusCodes;
(function (StatusCodes) {
  StatusCodes[(StatusCodes["SUCCESS"] = 200)] = "SUCCESS";
  StatusCodes[(StatusCodes["CREATED"] = 201)] = "CREATED";
  StatusCodes[(StatusCodes["ACCEPTED"] = 202)] = "ACCEPTED";
  StatusCodes[(StatusCodes["NO_CONTENT"] = 204)] = "NO_CONTENT";
  StatusCodes[(StatusCodes["BAD_REQUEST"] = 400)] = "BAD_REQUEST";
  StatusCodes[(StatusCodes["UNAUTHORIZED"] = 401)] = "UNAUTHORIZED";
  StatusCodes[(StatusCodes["FORBIDDEN"] = 403)] = "FORBIDDEN";
  StatusCodes[(StatusCodes["NOT_FOUND"] = 404)] = "NOT_FOUND";
  StatusCodes[(StatusCodes["CONFLICT"] = 409)] = "CONFLICT";
  StatusCodes[(StatusCodes["INTERNAL_SERVER_ERROR"] = 500)] =
    "INTERNAL_SERVER_ERROR";
})(StatusCodes || (exports.StatusCodes = StatusCodes = {}));
