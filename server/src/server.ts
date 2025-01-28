import { createServer } from "http";

import app from "./config/app.config";
import { DotenvConfig } from "./config/env.config";
import { AppDataSource } from "./config/database.config";
import Print from "./utils/print";
function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  httpServer.listen(PORT);
  Print.info(`Server is Listening in port: ${DotenvConfig.PORT}`)
}

AppDataSource.initialize()
  .then(async () => {
    Print.info("🚀 ~ Database Connected Successfully")
    listen();
  })
  .catch((err) => {
    Print.error(`🚀 ~ Database Failed to connect: ${err?.message}`)
  });
