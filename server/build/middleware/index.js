"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const env_config_1 = require("../config/env.config");
const StatusCodes_1 = require("../constant/StatusCodes");
const index_routes_1 = __importDefault(require("../routes/index.routes"));
const errorhandler_middleware_1 = require("./errorhandler.middleware");
const morgan_1 = __importDefault(require("morgan"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const type_graphql_1 = require("type-graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const userReslover_1 = require("../graphql/resolvers/userReslover");
const adminResolver_1 = require("../graphql/resolvers/adminResolver");
const GuideReslover_1 = require("../graphql/resolvers/GuideReslover");
const travelResolver_1 = require("../graphql/resolvers/travelResolver");
const middleware = async (app) => {
    console.log(env_config_1.DotenvConfig.CORS_ORIGIN);
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: env_config_1.DotenvConfig.CORS_ORIGIN,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }));
    app.use((req, res, next) => {
        const userAgent = req.headers["user-agent"];
        const apiKey = req.headers["apikey"];
        if (userAgent && userAgent.includes("Mozilla")) {
            next();
        }
        else {
            if (apiKey === env_config_1.DotenvConfig.API_KEY)
                next();
            else
                res.status(StatusCodes_1.StatusCodes.FORBIDDEN).send("Forbidden");
        }
    });
    app.use((0, morgan_1.default)("common"));
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [userReslover_1.UserResolver, adminResolver_1.AdminResolver, GuideReslover_1.GuideResolver, travelResolver_1.TravelResolver],
    });
    const server = new server_1.ApolloServer({
        schema,
    });
    app.use("/api", index_routes_1.default);
    await server.start();
    app.use("/graphql", body_parser_1.default.json(), express_1.default.urlencoded({ extended: false }), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({
            req,
        }),
    }));
    console.log(env_config_1.DotenvConfig.DATABASE_USERNAME, env_config_1.DotenvConfig.DATABASE_PASSWORD, env_config_1.DotenvConfig.DATABASE_NAME, env_config_1.DotenvConfig.DATABASE_PASSWORD, env_config_1.DotenvConfig.DATABASE_USERNAME);
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../public/uploads")));
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../public")));
    app.use(errorhandler_middleware_1.errorHandler);
};
exports.default = middleware;
