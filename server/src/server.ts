import { createServer } from "http";
import app from "./config/app.config";
import { DotenvConfig } from "./config/env.config";
import { AppDataSource } from "./config/database.config";

import Print from "./utils/print";
import { initializeSocket } from "./socket/socket";
function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  initializeSocket(httpServer);
  httpServer.listen(PORT);
  Print.info(`Server is Listening in port: ${DotenvConfig.PORT}`);
}
console.log("🧪 DATABASE CONFIG",
 DotenvConfig.DATABASE_HOST,
 DotenvConfig.DATABASE_PORT,
   DotenvConfig.DATABASE_USERNAME,
DotenvConfig.DATABASE_PASSWORD,
 DotenvConfig.DATABASE_NAME,);

AppDataSource.initialize()
  .then(async () => {
    Print.info("🚀 ~ Database Connected Successfully");
    listen();
  })
  .catch((err: any) => {
    Print.error(`🚀 ~ Database Failed to connect: ${err}`);
  });
