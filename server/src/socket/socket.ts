import { Server } from "socket.io";
import webTokenService from "../service/webToken.service";
import { DotenvConfig } from "../config/env.config";
import userService from "../service/user.service";
import HttpException from "../utils/HttpException.utils";
import Print from "../utils/print";
import travelService from "../service/travel.service";
import GuideService from "../service/guide.service";
const guideService = new GuideService()

let io: Server;

function initializeSocket(server: any) {
  Print.info("Socket Initialized")
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const socketToken = socket.handshake.auth.token;
    if (!socketToken) {
      return next(new Error("You are not authorized"));
    }
    try {
      const auth = webTokenService.verify(
        socketToken,
        DotenvConfig.ACCESS_TOKEN_SECRET,
      );
      if (auth) {
        socket.data.user = auth;
        next();
      } else {
        next(new Error("You are not authorized"));
      }
    } catch (error) {
      next(new Error("Token verification failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.user.id;
    console.log("User connected:", userId);

    socket.join(userId);

    try {
      socket.on("notification", async ({ data, user }) => {
        const admin_id = socket.data.user.id;

        if (user) {
          socket.join(user);
          console.log(`User with ID ${user} has been joined`);

          console.log(`Task notification sent to user ${user}`);
        } else {
          console.log("No user ID provided for task assignment");
        }
      });

      socket.on("read-user-notification", async (id) => {
await userService.readNotification(id)
       
      });
      socket.on("travel-location", async ({ id, latitude, longitude }) => {
        const data = { latitude, longitude }
        console.log("🚀 ~ socket.on ~ data:", data)
await travelService.addLocation(id, data)
       
      });
      socket.on("guide-location", async ({ id, latitude, longitude }) => {
        const data = { latitude, longitude }
await guideService.addLocation(id, data)
       
      });
    } catch (error: any) {
      throw HttpException.badRequest(error?.message);
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });
}

export { initializeSocket, io };
