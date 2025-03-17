import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response, Application } from "express";
import path from "path";
import { DotenvConfig } from "../config/env.config";
import { StatusCodes } from "../constant/StatusCodes";
import routes from "../routes/index.routes";
import { errorHandler } from "./errorhandler.middleware";
import morgan from "morgan";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import bodyParser from "body-parser";
import { UserResolver } from "../graphql/resolvers/userReslover";
import { AdminResolver } from "../graphql/resolvers/adminResolver";
import { GuideResolver } from "../graphql/resolvers/GuideReslover";
import fileUpload from "express-fileupload";
import { TravelResolver } from "../graphql/resolvers/travelResolver";

interface GraphQlContext {
  req: Request;
}

const middleware = async (app: Application) => {
  console.log(DotenvConfig.CORS_ORIGIN);
  app.use(compression());
  app.use(
    cors({
      origin: DotenvConfig.CORS_ORIGIN,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
  console.log(
    "🚀 ~ middleware ~ DotenvConfig.CORS_ORIGIN:",
    DotenvConfig.CORS_ORIGIN, DotenvConfig.MAIL_HOST
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"];
    const apiKey = req.headers["apikey"];
    if (userAgent && userAgent.includes("Mozilla")) {
      next();
    } else {
      if (apiKey === DotenvConfig.API_KEY) next();
      else res.status(StatusCodes.FORBIDDEN).send("Forbidden");
    }
  });

  app.use(morgan("common"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const schema = await buildSchema({
    resolvers: [UserResolver, AdminResolver, GuideResolver, TravelResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  app.use("/api", routes);
  await server.start();

  app.use(
    "/graphql",
    bodyParser.json(),
    express.urlencoded({ extended: false }),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<GraphQlContext> => ({
        req,
      }),
    }),
  );
console.log(DotenvConfig.DATABASE_USERNAME, DotenvConfig.DATABASE_PASSWORD, DotenvConfig.DATABASE_NAME, DotenvConfig.DATABASE_PASSWORD, DotenvConfig.DATABASE_USERNAME)
  app.use(express.static(path.join(__dirname, "../../public/uploads")));
  app.use(express.static(path.join(__dirname, "../../public")));

  app.use(errorHandler);
};

export default middleware;
