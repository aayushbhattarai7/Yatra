"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
const webToken_service_1 = __importDefault(require("../service/webToken.service"));
const env_config_1 = require("../config/env.config");
const user_service_1 = __importDefault(require("../service/user.service"));
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const print_1 = __importDefault(require("../utils/print"));
const travel_service_1 = __importDefault(require("../service/travel.service"));
const guide_service_1 = __importDefault(require("../service/guide.service"));
const chat_service_1 = require("../service/chat.service");
const room_service_1 = require("../service/room.service");
const user_entity_1 = require("../entities/user/user.entity");
const guide_entity_1 = require("../entities/guide/guide.entity");
const travel_entity_1 = require("../entities/travels/travel.entity");
const chatService = new chat_service_1.ChatService();
const guideService = new guide_service_1.default();
const roomService = new room_service_1.RoomService();
let io;
function initializeSocket(server) {
    print_1.default.info("Socket Initialized");
    exports.io = io = new socket_io_1.Server(server, {
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
            const auth = webToken_service_1.default.verify(socketToken, env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET);
            if (auth) {
                socket.data.user = auth;
                next();
            }
            else {
                next(new Error("You are not authorized"));
            }
        }
        catch (error) {
            next(new Error("Token verification failed"));
        }
    });
    io.on("connection", async (socket) => {
        const userId = socket.data.user.id;
        console.log("User connected:", userId);
        socket.join(userId);
        const user = await user_entity_1.User.findOneBy({ id: userId });
        const activeTravel = await travel_service_1.default.getAllActiveUsers();
        socket.emit("active-travel", activeTravel);
        socket.on("get-active-travels", async () => {
            const activeTravel = await travel_service_1.default.getAllActiveUsers();
            socket.emit("active-travel", activeTravel);
        });
        socket.on("get-active-guides", async () => {
            const activeGuide = await guideService.getAllActiveUsers();
            socket.emit("active-guide", activeGuide);
        });
        if (user) {
            await user_service_1.default.activeUser(userId);
        }
        const guide = await guide_entity_1.Guide.findOneBy({ id: userId });
        if (guide) {
            console.log("oukay");
            await guideService.activeUser(userId);
        }
        const travel = await travel_entity_1.Travel.findOneBy({ id: userId });
        if (travel) {
            await travel_service_1.default.activeUser(userId);
        }
        try {
            socket.on("notification", async ({ data, user }) => {
                if (user) {
                    socket.join(user);
                    console.log(`User with ID ${user} has been joined`);
                    console.log(`Task notification sent to user ${user}`);
                }
                else {
                    console.log("No user ID provided for task assignment");
                }
            });
            socket.on("read-user-notification", async (id) => {
                await user_service_1.default.readNotification(id);
            });
            socket.on("read-travel-notification", async () => {
                const id = socket.data.user.id;
                await travel_service_1.default.readNotification(id);
            });
            socket.on("read-guide-notification", async () => {
                const id = socket.data.user.id;
                await guideService.readNotification(id);
            });
            socket.on("travel-location", async ({ id, latitude, longitude }) => {
                const data = { latitude, longitude };
                await travel_service_1.default.addLocation(id, data);
            });
            socket.on("guide-location", async ({ guideId, latitude, longitude }) => {
                const data = { latitude, longitude };
                await guideService.addLocation(guideId, data);
            });
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error?.message);
        }
        socket.on("travel-message", async ({ id, message }) => {
            const userId = socket.data.user.id;
            await chatService.chatWithTravel(userId, id, message);
        });
        socket.on("guide-message", async ({ id, message }) => {
            const userId = socket.data.user.id;
            await chatService.chatWithGuide(userId, id, message);
        });
        socket.on("travel-message-user", async ({ user_id, message }) => {
            const userId = socket.data.user.id;
            await chatService.chatByTravel(userId, user_id, message);
        });
        socket.on("guide-message-user", async ({ user_id, message }) => {
            const userId = socket.data.user.id;
            await chatService.chatByGuide(userId, user_id, message);
        });
        socket.on("mark-as-read", async ({ senderId, role }) => {
            const userId = socket.data.user.id;
            if (role === "TRAVEL") {
                await chatService.readChatOfTravel(userId, senderId);
            }
            else {
                await chatService.readChatOfGuide(userId, senderId);
            }
        });
        socket.on("mark-read-by-travel", async ({ senderId }) => {
            const userId = socket.data.user.id;
            await chatService.readChatByTravel(senderId, userId);
        });
        socket.on("mark-all-read", async () => {
            const userId = socket.data.user.id;
            await chatService.readAllChatByUser(userId);
        });
        socket.on("mark-read-by-guide", async ({ senderId }) => {
            const userId = socket.data.user.id;
            await chatService.readChatByGuide(senderId, userId);
        });
        socket.on("disconnect", async () => {
            console.log("User disconnected:", userId);
            const user = await user_entity_1.User.findOneBy({ id: userId });
            if (user) {
                await user_service_1.default.offlineUser(userId);
            }
            const guide = await guide_entity_1.Guide.findOneBy({ id: userId });
            if (guide) {
                await guideService.offlineUser(userId);
            }
            const travel = await travel_entity_1.Travel.findOneBy({ id: userId });
            if (travel) {
                await travel_service_1.default.offlineUser(userId);
            }
        });
    });
}
