import { Server } from "socket.io";
import webTokenService from "../service/webToken.service";
import { DotenvConfig } from "../config/env.config";
import userService from "../service/user.service";
import HttpException from "../utils/HttpException.utils";
import Print from "../utils/print";
import travelService from "../service/travel.service";
import GuideService from "../service/guide.service";
import { ChatService } from '../service/chat.service'
import { RoomService } from "../service/room.service";
const chatService = new ChatService()

const guideService = new GuideService()
const roomService = new RoomService()
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
await travelService.addLocation(id, data)
       
      });
      socket.on("guide-location", async ({ guideId, latitude, longitude }) => {
        console.log("🚀 ~ socket.on ~ id:", guideId)
        const data = { latitude, longitude }
await guideService.addLocation(guideId, data)
       
      });
    } catch (error: any) {
      throw HttpException.badRequest(error?.message);
    }


    socket.on('travel-message', async ({ id,message,  }) => {
   const userId = socket.data.user.id
       console.log("🚀 ~ sockettravel:", userId)
       await chatService.chatWithTravel(userId, id, message)
    })
    socket.on('guide-message', async ({ id,message }) => {
    console.log("🚀 ~ socket.guide ~ message:", message)
   const userId = socket.data.user.id
       await chatService.chatWithGuide(userId, id, message)
    })
    socket.on('travel-message-user', async ({ user_id,message,  }) => {
   const userId = socket.data.user.id
       await chatService.chatByTravel(userId, user_id, message)
    })
    socket.on('guide-message-user', async ({ user_id,message,  }) => {
    console.log("🚀 ~ socket.on ~ user_id:", user_id)
    console.log("🚀 ~ socket.on ~ message:", message)
   const userId = socket.data.user.id
       await chatService.chatByGuide(userId, user_id, message)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });
}

export { initializeSocket, io };
