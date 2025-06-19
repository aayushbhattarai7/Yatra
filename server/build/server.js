"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_config_1 = __importDefault(require("./config/app.config"));
const env_config_1 = require("./config/env.config");
const database_config_1 = require("./config/database.config");
const print_1 = __importDefault(require("./utils/print"));
const socket_1 = require("./socket/socket");
function listen() {
  const PORT = env_config_1.DotenvConfig.PORT;
  const httpServer = (0, http_1.createServer)(app_config_1.default);
  (0, socket_1.initializeSocket)(httpServer);
  httpServer.listen(PORT);
  print_1.default.info(
    `Server is Listening in port: ${env_config_1.DotenvConfig.PORT}`,
  );
}
database_config_1.AppDataSource.initialize()
  .then(async () => {
    print_1.default.info("🚀 ~ Database Connected Successfully");
    listen();
  })
  .catch((err) => {
    print_1.default.error(`🚀 ~ Database Failed to connect: ${err?.message}`);
  });
