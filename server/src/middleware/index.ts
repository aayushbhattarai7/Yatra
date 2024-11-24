import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import { DotenvConfig } from "../config/env.config";
import { StatusCodes } from "../constant/StatusCodes";
import bodyParser from "body-parser";
import path from "path";

const middleware = (app: Application) => {
  app.use(
    cors({
      origin: "*",
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"];
    const apikey = req.headers["apikey"];
    if (userAgent && userAgent.includes("Mozilla")) {
      next();
    } else {
      if (apikey === DotenvConfig.API_KEY) next();
      else res.status(StatusCodes.FORBIDDEN).send("Forbidden");
    }
  });

  app.use(bodyParser.json());
  app.use(
    "/profile",
    express.static(path.join(__dirname, "../", "../", "public/travel/profile")),
  );
  app.use(
    "/profile",
    express.static(path.join(__dirname, "../", "../", "public/guide/profile")),
  );

  app.set(
    "public",
    path.join(__dirname, "../", "../", "public/travel/profile"),
  );
  app.use(
    express.static(path.join(__dirname, "../", "../", "public/travel/profile")),
  );
  app.set("public", path.join(__dirname, "../", "../", "public/place"));
  app.use(
    "/place",
    express.static(path.join(__dirname, "../", "../", "public/place")),
  );

  app.use(express.static(path.join(__dirname, "../", "../", "public/place")));
  app.use(express.urlencoded({ extended: false }));
};

export default middleware;
