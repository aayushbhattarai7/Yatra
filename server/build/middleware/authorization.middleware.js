"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const authorization = (roles) => {
  return async ({ context }, next) => {
    if (!context.req.user) {
      throw new Error("You are not authorized");
    }
    try {
      const userRole = context.req.user.role;
      if (userRole && roles.includes(userRole)) {
        return next();
      } else {
        throw new Error("You are not authorized");
      }
    } catch (error) {
      throw new Error("You are not authorized");
    }
  };
};
exports.authorization = authorization;
