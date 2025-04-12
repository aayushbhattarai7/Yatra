"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_entity_1 = require("../entities/chat/chat.entity");
const database_config_1 = require("../config/database.config");
const user_entity_1 = require("../entities/user/user.entity");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const room_entity_1 = require("../entities/chat/room.entity");
const travel_entity_1 = require("../entities/travels/travel.entity");
const guide_entity_1 = require("../entities/guide/guide.entity");
const room_service_1 = require("../service/room.service");
const socket_1 = require("../socket/socket");
const notification_entity_1 = require("../entities/notification/notification.entity");
const roomService = new room_service_1.RoomService();
class ChatService {
    chatRepo;
    userRepo;
    roomRepo;
    travelRepo;
    guideRepo;
    notificationRepo;
    constructor(chatRepo = database_config_1.AppDataSource.getRepository(chat_entity_1.Chat), userRepo = database_config_1.AppDataSource.getRepository(user_entity_1.User), roomRepo = database_config_1.AppDataSource.getRepository(room_entity_1.Room), travelRepo = database_config_1.AppDataSource.getRepository(travel_entity_1.Travel), guideRepo = database_config_1.AppDataSource.getRepository(guide_entity_1.Guide), notificationRepo = database_config_1.AppDataSource.getRepository(notification_entity_1.Notification)) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
        this.roomRepo = roomRepo;
        this.travelRepo = travelRepo;
        this.guideRepo = guideRepo;
        this.notificationRepo = notificationRepo;
    }
    async chatWithGuide(userId, guideId, message) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const receiver = await this.guideRepo.findOneBy({ id: guideId });
            if (!receiver)
                throw HttpException_utils_1.default.notFound("Guide not found");
            const getRoom = await roomService.checkRoomWithGuide(userId, guideId);
            if (!getRoom)
                throw HttpException_utils_1.default.notFound("Room not found");
            const room = await this.roomRepo.findOneBy({ id: getRoom.id });
            if (!room)
                throw HttpException_utils_1.default.notFound("room not found");
            const chat = this.chatRepo.create({
                message: message,
                room: room,
                receiverGuide: receiver,
                senderUser: user,
            });
            const saveChat = await this.chatRepo.save(chat);
            const notification = this.notificationRepo.create({
                message: `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName} sent you a message`,
                receiverGuide: receiver,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(guideId).emit("notification", notification);
            }
            socket_1.io.to(guideId).emit("guide-message", chat);
            return saveChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async chatWithTravel(userId, travelId, message) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const receiver = await this.travelRepo.findOneBy({ id: travelId });
            if (!receiver)
                throw HttpException_utils_1.default.notFound("Guide not found");
            const getRoom = await roomService.checkRoomWithTravel(userId, travelId);
            if (!getRoom)
                throw HttpException_utils_1.default.notFound("Room not found");
            const room = await this.roomRepo.findOneBy({ id: getRoom.id });
            if (!room)
                throw HttpException_utils_1.default.notFound("room not found");
            const chat = this.chatRepo.create({
                message: message,
                room: room,
                receiverTravel: receiver,
                senderUser: user,
            });
            console.log("🚀 ~ ChatService ~ chatWithTravel ~ chat:", chat);
            const saveChat = await this.chatRepo.save(chat);
            const notification = this.notificationRepo.create({
                message: `${user.firstName} ${user.middleName ? user.middleName + " " : ""} ${user.lastName} sent you a message`,
                receiverTravel: receiver,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(travelId).emit("notification", notification);
            }
            socket_1.io.to(travelId).emit("travel-message", chat);
            return chat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getChatByUserOfTravel(userId, travelId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const chats = await this.chatRepo.find({
                where: [
                    { senderTravel: { id: travelId }, receiverUser: { id: userId } },
                    { receiverTravel: { id: travelId }, senderUser: { id: userId } },
                ],
                relations: [
                    "receiverTravel",
                    "receiverUser",
                    "senderUser",
                    "senderTravel",
                ],
                order: { createdAt: "ASC" },
            });
            if (!chats)
                throw HttpException_utils_1.default.notFound;
            return chats;
        }
        catch (error) {
            if (error instanceof Error)
                throw HttpException_utils_1.default.badRequest(error.message);
        }
    }
    async getChatByUserOfGuide(userId, guideId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const chats = await this.chatRepo.find({
                where: [
                    { senderGuide: { id: guideId }, receiverUser: { id: userId } },
                    { receiverGuide: { id: guideId }, senderUser: { id: userId } },
                ],
                relations: [
                    "receiverGuide",
                    "receiverUser",
                    "senderUser",
                    "senderGuide",
                ],
                order: { createdAt: "ASC" },
            });
            if (!chats)
                throw HttpException_utils_1.default.notFound;
            return chats;
        }
        catch (error) {
            if (error instanceof Error)
                throw HttpException_utils_1.default.badRequest(error.message);
        }
    }
    async getChatByTravelOfUser(travelId, userId) {
        try {
            const user = await this.travelRepo.findOneBy({ id: travelId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const chats = await this.chatRepo.find({
                where: [
                    { senderTravel: { id: travelId }, receiverUser: { id: userId } },
                    { receiverTravel: { id: travelId }, senderUser: { id: userId } },
                ],
                relations: [
                    "receiverTravel",
                    "receiverUser",
                    "senderUser",
                    "senderTravel",
                ],
                order: { createdAt: "ASC" },
            });
            if (!chats)
                throw HttpException_utils_1.default.notFound;
            return chats;
        }
        catch (error) {
            if (error instanceof Error)
                throw HttpException_utils_1.default.badRequest(error.message);
        }
    }
    async getChatByGuideOfUser(guideId, userId) {
        try {
            const user = await this.guideRepo.findOneBy({ id: guideId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const chats = await this.chatRepo.find({
                where: [
                    { senderGuide: { id: guideId }, receiverUser: { id: userId } },
                    { receiverGuide: { id: guideId }, senderUser: { id: userId } },
                ],
                relations: [
                    "receiverGuide",
                    "receiverUser",
                    "senderUser",
                    "senderGuide",
                ],
                order: { createdAt: "ASC" },
            });
            if (!chats)
                throw HttpException_utils_1.default.notFound;
            return chats;
        }
        catch (error) {
            if (error instanceof Error)
                throw HttpException_utils_1.default.badRequest(error.message);
        }
    }
    async chatByTravel(travel_id, user_id, message) {
        try {
            const travel = await this.travelRepo.findOneBy({ id: travel_id });
            if (!travel)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("User not found");
            const getRoom = await roomService.checkRoomWithTravel(user_id, travel_id);
            if (!getRoom)
                throw HttpException_utils_1.default.notFound("Room not found");
            const room = await this.roomRepo.findOneBy({ id: getRoom.id });
            if (!room)
                throw HttpException_utils_1.default.notFound("room not found");
            const chat = this.chatRepo.create({
                message: message,
                room: room,
                read: false,
                receiverUser: user,
                senderTravel: travel,
            });
            await this.chatRepo.save(chat);
            socket_1.io.to(user_id).emit("travel-message-to-user", chat);
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: user_id },
                    senderTravel: { id: travel_id },
                    read: false
                }
            });
            const chatCounts = chatCount.length;
            const id = travel_id;
            const notification = this.notificationRepo.create({
                message: `${travel.firstName} ${user.middleName ? user.middleName + " " : ""} ${travel.lastName} sent you a message`,
                receiverUser: user,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(user_id).emit("notification", notification);
            }
            socket_1.io.to(user_id).emit("chat-count-of-travel", { id, chatCounts });
            return chat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async chatByGuide(guide_id, user_id, message) {
        try {
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const user = await this.userRepo.findOneBy({ id: user_id });
            if (!user)
                throw HttpException_utils_1.default.notFound("User not found");
            const getRoom = await roomService.checkRoomWithGuide(user_id, guide_id);
            if (!getRoom)
                throw HttpException_utils_1.default.notFound("Room not found");
            const room = await this.roomRepo.findOneBy({ id: getRoom.id });
            if (!room)
                throw HttpException_utils_1.default.notFound("room not found");
            const chat = this.chatRepo.create({
                message: message,
                room: room,
                receiverUser: user,
                senderGuide: guide,
            });
            await this.chatRepo.save(chat);
            socket_1.io.to(user_id).emit("guide-message-to-user", chat);
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: user_id },
                    senderGuide: { id: guide_id },
                    read: false
                }
            });
            const chatCounts = chatCount.length;
            const id = guide_id;
            const notification = this.notificationRepo.create({
                message: `${guide.firstName} ${user.middleName ? user.middleName + " " : ""} ${guide.lastName} sent you a message`,
                receiverUser: user,
            });
            await this.notificationRepo.save(notification);
            if (notification) {
                socket_1.io.to(user_id).emit("notification", notification);
            }
            socket_1.io.to(user_id).emit("chat-count-of-guide", { id, chatCounts });
            return chat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readAllChatByUser(userId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const updateChat = await this.chatRepo
                .createQueryBuilder()
                .update()
                .set({ read: true })
                .where("( receiverUser.id = :userId)", {
                userId,
            })
                .execute();
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: userId },
                    read: false
                }
            });
            socket_1.io.to(userId).emit("chat-count", { chatCount: chatCount.length });
            return updateChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readChatOfGuide(userId, guide_id) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const guide = await this.guideRepo.findOneBy({ id: guide_id });
            if (!guide)
                throw HttpException_utils_1.default.notFound("guide not found");
            const updateChat = await this.chatRepo
                .createQueryBuilder()
                .update()
                .set({ read: true })
                .where("(senderGuide.id = :guide_id AND receiverUser.id = :userId)", {
                userId,
                guide_id,
            })
                .execute();
            socket_1.io.to(guide_id).emit("message-read", { guide_id, userId });
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: userId },
                    read: false
                }
            });
            socket_1.io.to(userId).emit("chat-count", { chatCount: chatCount.length });
            return updateChat;
            return updateChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readChatOfTravel(userId, travelId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const travel = await this.travelRepo.findOneBy({ id: travelId });
            if (!travel)
                throw HttpException_utils_1.default.notFound("Travel not found");
            const updateChat = await this.chatRepo
                .createQueryBuilder()
                .update()
                .set({ read: true })
                .where("(senderTravel.id = :travelId AND receiverUser.id = :userId)", {
                userId,
                travelId,
            })
                .execute();
            socket_1.io.to(travelId).emit("message-read", { travelId, userId });
            const chatCount = await this.chatRepo.find({
                where: {
                    receiverUser: { id: userId },
                    read: false
                }
            });
            socket_1.io.to(userId).emit("chat-count", { chatCount: chatCount.length });
            return updateChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readChatByTravel(userId, travelId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const travel = await this.travelRepo.findOneBy({ id: travelId });
            if (!travel)
                throw HttpException_utils_1.default.notFound("Travel not found");
            const updateChat = await this.chatRepo
                .createQueryBuilder()
                .update()
                .set({ read: true })
                .where("(senderUser.id = :userId AND receiverTravel.id = :travelId)", {
                userId,
                travelId,
            })
                .execute();
            socket_1.io.to(userId).emit("message-read-by-travel", { id: travelId, userId });
            return updateChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async readChatByGuide(userId, guideId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const guide = await this.guideRepo.findOneBy({ id: guideId });
            if (!guide)
                throw HttpException_utils_1.default.notFound("Guide not found");
            const updateChat = await this.chatRepo
                .createQueryBuilder()
                .update()
                .set({ read: true })
                .where("(senderUser.id = :userId AND receiverGuide.id = :guideId)", {
                userId,
                guideId,
            })
                .execute();
            socket_1.io.to(userId).emit("message-read", { guideId, userId });
            return updateChat;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getUnreadChatOFGuide(userId, guideId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const guide = await this.guideRepo.findOneBy({ id: guideId });
            if (!guide)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const getUnreadChatsOFGuide = await this.chatRepo.find({
                where: {
                    senderGuide: { id: guideId },
                    receiverUser: { id: userId },
                    read: false
                }
            });
            console.log("🚀 ~ ChatService ~ getUnreadChatOFGuide ~ getUnreadChatsOFGuide:", getUnreadChatsOFGuide.length);
            const unreadChatCount = getUnreadChatsOFGuide.length;
            socket_1.io.to(userId).emit("chat-count", { chatCount: unreadChatCount });
            return unreadChatCount;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getUnreadChatOFTravel(userId, travelId) {
        try {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const travel = await this.travelRepo.findOneBy({ id: travelId });
            if (!travel)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const getUnreadChatsOFTravel = await this.chatRepo.find({
                where: {
                    senderTravel: { id: travelId },
                    receiverUser: { id: userId },
                    read: false
                }
            });
            console.log("🚀 ~ ChatService ~ getUnreadChatOFTravel ~ getUnreadChatsOFTravel:", getUnreadChatsOFTravel);
            const unreadChatCount = getUnreadChatsOFTravel.length;
            socket_1.io.to(userId).emit("chat-count", { chatCount: unreadChatCount });
            return unreadChatCount;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
}
exports.ChatService = ChatService;
