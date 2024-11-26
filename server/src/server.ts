import { createServer } from "http";

import app from "./config/app.config";
import { DotenvConfig } from "./config/env.config";
import { AppDataSource } from "./config/database.config";
function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  httpServer.listen(PORT);
  console.log(`Server is Listening in port: ${DotenvConfig.PORT}`);
}

AppDataSource.initialize()
  .then(async () => {
    console.log("🚀 ~ Database Connected Successfully:");
    listen();
  })
  .catch((err) => {
    console.log(`🚀 ~ Database Failed to connect: ${err?.message}`);
  });
