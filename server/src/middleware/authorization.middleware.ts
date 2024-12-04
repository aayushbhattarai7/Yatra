import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";
import { Role } from "../constant/enum";  

export const authorization = (roles: Role[]): MiddlewareFn<Context> => {
  return async ({ context }, next) => {
    if (!context.req.user) {
      throw new Error("You are not authorized");
    }

    try {
      const userRole = context.req.user.role;

      if (userRole && roles.includes(userRole as Role)) {
        return next(); 
      } else {
        throw new Error("You are not authorized");
      }
    } catch (error) {
      throw new Error("You are not authorized");
    }
  };
};
