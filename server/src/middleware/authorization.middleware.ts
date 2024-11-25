import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";
import { Role } from "../constant/enum";
import HttpException from "../utils/HttpException.utils";

export const authorization = (roles: Role[]): MiddlewareFn<Context> => {
  return async ({ context }, next) => {
    const user = context.user;
    if (!user) {
      throw HttpException.unauthorized("You are not authorized");
    }
    if (user.role && roles.includes(user.role as Role)) {
      return next();
    } else {
      throw HttpException.unauthorized(
        "You do not have permission to access this resource",
      );
    }
  };
};
