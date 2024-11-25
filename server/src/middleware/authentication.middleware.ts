import { MiddlewareFn } from "type-graphql";
import {Context} from '../types/context'
import tokenService from "../service/webToken.service";
import { DotenvConfig } from "../config/env.config";
import HttpException from "../utils/HttpException.utils";

export const authentication: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
throw HttpException.unauthorized("You are not authorized")  }

  const tokens = authorization.split(" ");
  if (tokens[0] !== "Bearer" || !tokens[1]) {
throw HttpException.unauthorized("Invalid authorization format")  }
  

  try {
    const payload = tokenService.verify(
      tokens[1],
      DotenvConfig.ACCESS_TOKEN_SECRET
    );
    context.user = payload; 
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
throw HttpException.unauthorized("Token expired, Please login again")  
    }
throw HttpException.unauthorized("Invalid Token")  
  }
};
