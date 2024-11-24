import { Server } from "socket.io";
import webTokenService from "../service/webToken.service";
import { DotenvConfig } from "../config/env.config";
import UserService from "../service/user.service";
import HttpException from "../utils/HttpException.utils";
import http from "http";
import express from "express";
import adminService from "../service/admin.service";
const app = express();
const server = http.createServer(app);
const userService = new UserService();

const io = new Server(server, {
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
    socket.on("assignTask", async ({ data, user }) => {
      const admin_id = socket.data.user.id;

      if (user) {
        socket.join(user);
        console.log(`User with ID ${user} has been joined`);

        const userService = new UserService();
        console.log(`Task notification sent to user ${user}`);
      } else {
        console.log("No user ID provided for task assignment");
      }
    });

    socket.on("complete", async ({ task_id, admin_id }) => {
      const user_id = socket.data.user.id;

      if (admin_id) {
        socket.join(admin_id);
        console.log(`User with ID ${admin_id} has been joined`);
      } else {
        console.log("No user ID provided for task assignment");
      }
    });
  } catch (error: any) {
    throw HttpException.badRequest(error?.message);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
  });
});

export { Server, io };
