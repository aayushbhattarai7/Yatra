import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";
import tokenService from "../service/webToken.service";
import HttpException from "../utils/HttpException.utils";
import { DotenvConfig } from "../config/env.config";

export const authentication: MiddlewareFn<Context> = async (
  { context },
  next,
) => {
  const tokens = context.req.headers.authorization?.split(" ");

  try {
    console.log("heehjahjhhhhhhhhhhhhhhhhhh", tokens);
    if (!tokens) {
      throw new Error("You are not authorized1234");
    }
    const mode = tokens[0];
    const accessToken = tokens[1];
    console.log("okok");
    if (mode !== "Bearer" || !accessToken) {
      throw new Error("You are not authorized");
    }

    const payload = tokenService.verify(
      accessToken,
      DotenvConfig.ACCESS_TOKEN_SECRET,
    );

    if (payload) {
      context.req.user = payload;
      return next();
    } else {
      throw HttpException.unauthorized("You are not authorized");
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw HttpException.badRequest("Token Expired, Please sign in again");
    }
    throw new Error("You are not authorized");
  }
};
