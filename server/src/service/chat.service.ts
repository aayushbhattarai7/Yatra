import { Chat } from "../entities/chat/chat.entity";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import HttpException from "../utils/HttpException.utils";
import { Room } from "../entities/chat/room.entity";
import { Travel } from "../entities/travels/travel.entity";
import { Guide } from "../entities/guide/guide.entity";
import { RoomService } from "../service/room.service";
import { io } from "../socket/socket";
import { Notification } from "../entities/notification/notification.entity";

const roomService = new RoomService();

export class ChatService {
  constructor(
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly roomRepo = AppDataSource.getRepository(Room),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification,
    ),
  ) { }

  async chatWithGuide(userId: string, guideId: string, message: string) {
    console.log("🚀 ~ ChatService ~ chatWithGuide ~ userId:", userId)
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const receiver = await this.guideRepo.findOneBy({ id: guideId });
      if (!receiver) throw HttpException.notFound("Guide not found");
      const getRoom = await roomService.checkRoomWithGuide(userId, guideId);
      if (!getRoom) throw HttpException.notFound("Room not found");
      const room = await this.roomRepo.findOneBy({ id: getRoom.id });
      if (!room) throw HttpException.notFound("room not found");

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
        io.to(guideId).emit("notification", notification);
      }
      io.to(guideId).emit("guide-message", chat);
      const chatCount = await this.chatRepo.find({
        where: {
          senderUser: { id: userId },
          receiverGuide: { id: guideId },
          read: false,
        },
      });
      const chatCounts = chatCount.length;
      const id = guideId;

      io.to(guideId).emit("chat-count", { id, chatCounts });
      io.to(guideId).emit("chat-count-of-user", { id, chatCounts });
      await this.getUnreadChatByGuide(guideId, userId)
      return saveChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async chatWithTravel(userId: string, travelId: string, message: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const receiver = await this.travelRepo.findOneBy({ id: travelId });
      if (!receiver) throw HttpException.notFound("Guide not found");
      const getRoom = await roomService.checkRoomWithTravel(userId, travelId);
      if (!getRoom) throw HttpException.notFound("Room not found");
      const room = await this.roomRepo.findOneBy({ id: getRoom.id });
      if (!room) throw HttpException.notFound("room not found");

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
        io.to(travelId).emit("notification", notification);
      }
      io.to(travelId).emit("travel-message", chat);
      const chatCount = await this.chatRepo.find({
        where: {
          senderUser: { id: userId },
          receiverTravel: { id: travelId },
          read: false,
        },
      });
      const chatCounts = chatCount.length;
      const id = travelId;

      io.to(travelId).emit("chat-count", { id, chatCounts });
      await this.getUnreadChatByTravel(travelId, userId)

      return chat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getChatByUserOfTravel(userId: string, travelId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

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
      if (!chats) throw HttpException.notFound;
      return chats;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }
  async getChatByUserOfGuide(userId: string, guideId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

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
      if (!chats) throw HttpException.notFound;
      return chats;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }
  async getChatByTravelOfUser(travelId: string, userId: string) {
    try {
      const user = await this.travelRepo.findOneBy({ id: travelId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

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

      if (!chats) throw HttpException.notFound;
      return chats;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }
  async getChatByGuideOfUser(guideId: string, userId: string) {
    try {
      const user = await this.guideRepo.findOneBy({ id: guideId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

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

      if (!chats) throw HttpException.notFound;
      return chats;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }

  async chatByTravel(travel_id: string, user_id: string, message: string) {
    try {
      const travel = await this.travelRepo.findOneBy({ id: travel_id });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.notFound("User not found");
      const getRoom = await roomService.checkRoomWithTravel(user_id, travel_id);
      if (!getRoom) throw HttpException.notFound("Room not found");
      const room = await this.roomRepo.findOneBy({ id: getRoom.id });
      if (!room) throw HttpException.notFound("room not found");

      const chat = this.chatRepo.create({
        message: message,
        room: room,
        read: false,
        receiverUser: user,
        senderTravel: travel,
      });
      await this.chatRepo.save(chat);
      io.to(user_id).emit("travel-message-to-user", chat);
      const chatCount = await this.chatRepo.find({
        where: {
          receiverUser: { id: user_id },
          senderTravel: { id: travel_id },
          read: false,
        },
      });
      const chatCounts = chatCount.length;
      const notification = this.notificationRepo.create({
        message: `${travel.firstName} ${user.middleName ? user.middleName + " " : ""} ${travel.lastName} sent you a message`,
        receiverUser: user,
      });
      await this.notificationRepo.save(notification);
      if (notification) {
        io.to(user_id).emit("notification", notification);
      }
      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverUser: { id: user_id },
          read: false
        }
      })
      io.to(user_id).emit("chat-count", { chatCount: chatCountOfNav.length });
      io.to(user_id).emit("chat-count-of-travel", { id: travel_id, chatCounts });
      return chat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async chatByGuide(guide_id: string, user_id: string, message: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) throw HttpException.unauthorized("You are not authorized");

      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.notFound("User not found");
      const getRoom = await roomService.checkRoomWithGuide(user_id, guide_id);
      if (!getRoom) throw HttpException.notFound("Room not found");
      const room = await this.roomRepo.findOneBy({ id: getRoom.id });
      if (!room) throw HttpException.notFound("room not found");

      const chat = this.chatRepo.create({
        message: message,
        room: room,
        receiverUser: user,
        senderGuide: guide,
      });
      await this.chatRepo.save(chat);
      io.to(user_id).emit("guide-message-to-user", chat);
      const chatCount = await this.chatRepo.find({
        where: {
          receiverUser: { id: user_id },
          senderGuide: { id: guide_id },
          read: false,
        },
      });
      const chatCounts = chatCount.length;
      const notification = this.notificationRepo.create({
        message: `${guide.firstName} ${user.middleName ? user.middleName + " " : ""} ${guide.lastName} sent you a message`,
        receiverUser: user,
      });
      await this.notificationRepo.save(notification);
      if (notification) {
        io.to(user_id).emit("notification", notification);
      }
      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverUser: { id: user_id },
          read: false
        }
      })
      io.to(user_id).emit("chat-count", { chatCount: chatCountOfNav.length });
      io.to(user_id).emit("chat-count-of-guide", { id: guide_id, chatCounts });
      return chat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async readAllChatByUser(userId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

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
          read: false,
        },
      });
      io.to(userId).emit("chat-count", { chatCount: chatCount.length });
      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async readAllChatByGuide(guideId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guideId });
      if (!guide) throw HttpException.unauthorized("You are not authorized");

      const updateChat = await this.chatRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("( receiverGuide.id = :guideId)", {
          guideId,
        })
        .execute();
      const chatCount = await this.chatRepo.find({
        where: {
          receiverGuide: { id: guideId },
          read: false,
        },
      });
      io.to(guideId).emit("chat-count", { chatCount: chatCount.length });
      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async readChatOfGuide(userId: string, guide_id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) throw HttpException.notFound("guide not found");
      const updateChat = await this.chatRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("(senderGuide.id = :guide_id AND receiverUser.id = :userId)", {
          userId,
          guide_id,
        })
        .execute();

      io.to(guide_id).emit("message-read", { guide_id, userId });
      const chatCount = await this.chatRepo.find({
        where: {
          receiverUser: { id: userId },
          read: false,
        },
      });
      io.to(userId).emit("chat-count", { chatCount: chatCount.length });
      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async readChatOfTravel(userId: string, travelId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const travel = await this.travelRepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.notFound("Travel not found");
      const updateChat = await this.chatRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("(senderTravel.id = :travelId AND receiverUser.id = :userId)", {
          userId,
          travelId,
        })
        .execute();

      io.to(travelId).emit("message-read", { travelId, userId });
      const chatCount = await this.chatRepo.find({
        where: {
          receiverUser: { id: userId },
          read: false,
        },
      });
      console.log("🚀 ~ ChatService ~ readChatOfTravel ~ chatCount:", chatCount.length)
      io.to(userId).emit("chat-count", { chatCount: chatCount.length });
      io.to(userId).emit("chat-count-of-travel", { id: travelId, chatCount: chatCount.length });
      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async readChatByTravel(userId: string, travelId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const travel = await this.travelRepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.notFound("Travel not found");
      const updateChat = await this.chatRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("(senderUser.id = :userId AND receiverTravel.id = :travelId)", {
          userId,
          travelId,
        })
        .execute();

      io.to(userId).emit("message-read-by-travel", { id: travelId, userId });
      const chatCount = await this.chatRepo.find({
        where: {
          receiverTravel: { id: travelId },
          read: false,
        },
      });
      console.log("🚀 ~ ChatService ~ readChatByTravel ~ chatCount:", chatCount)
      io.to(travelId).emit("chat-count", { id: travelId, chatCount: chatCount.length });
      io.to(travelId).emit("chat-count-of-user", { id: userId, chatCount: chatCount.length });

      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async readChatByGuide(userId: string, guideId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const guide = await this.guideRepo.findOneBy({ id: guideId });
      if (!guide) throw HttpException.notFound("Guide not found");
      const updateChat = await this.chatRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("(senderUser.id = :userId AND receiverGuide.id = :guideId)", {
          userId,
          guideId,
        })
        .execute();

      io.to(userId).emit("message-read", { guideId, userId });
      io.to(userId).emit("message-read-by-guide", { id: guideId, userId });

      const chatCount = await this.chatRepo.find({
        where: {
          receiverGuide: { id: guideId },
          read: false,
        },
      });
      io.to(guideId).emit("chat-count", { chatCount: chatCount.length });
      io.to(guideId).emit("chat-count-of-user", { id: userId, chatCount: chatCount.length });

      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getUnreadChatOFGuide(userId: string, guideId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const guide = await this.guideRepo.findOneBy({ id: guideId });
      if (!guide) throw HttpException.unauthorized("You are not authorized");
      const getUnreadChatsOFGuide = await this.chatRepo.find({
        where: {
          senderGuide: { id: guideId },
          receiverUser: { id: userId },
          read: false,
        },
      });
      const unreadChatCount = getUnreadChatsOFGuide.length;
      io.to(userId).emit("chat-count-of-guide", { chatCount: unreadChatCount });
      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverUser: { id: userId },
          read: false
        }})
      io.to(userId).emit("chat-count", { chatCount: chatCountOfNav.length });
      return unreadChatCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getUnreadChatByGuide(guideId: string, userId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guideId });
      if (!guide) throw HttpException.unauthorized("You are not authorized");
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("User not found");
      const getUnreadChatsOFGuide = await this.chatRepo.find({
        where: {
          senderUser: { id: userId },
          receiverGuide: { id: guideId },
          read: false,
        },
      });
      const unreadChatCount = getUnreadChatsOFGuide.length;
      io.to(guideId).emit("chat-count-of-user", { id: userId, chatCount: unreadChatCount });
      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverGuide: { id: guideId },
          read: false
        }})
      io.to(guideId).emit("chat-count", { chatCount: chatCountOfNav.length });
      return unreadChatCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getUnreadChatByTravel(travelId: string, userId: string) {
    console.log("🚀 ~ ChatService ~ getUnreadChatByTravel ~ travelId:", travelId)
    try {
      const travel = await this.travelRepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.unauthorized("You are not authorized");
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("User not found");

      const getUnreadChatsOFTravel = await this.chatRepo.find({
        where: {
          senderUser: { id: userId },
          receiverTravel: { id: travelId },
          read: false,
        },
      });
      if (getUnreadChatsOFTravel.length === 0) {
        return 0;
      }

      const unreadChatCount = getUnreadChatsOFTravel.length;

      io.to(travelId).emit("chat-count-of-user", { id: userId, chatCounts: unreadChatCount });
      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverTravel: { id: travelId },
          read: false
        }
      })
      io.to(travelId).emit("chat-count", { chatCount: chatCountOfNav.length });
      return unreadChatCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getUnreadChatOFTravel(userId: string, travelId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");
      const travel = await this.travelRepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      const getUnreadChatsOFTravel = await this.chatRepo.find({
        where: {
          senderTravel: { id: travelId },
          receiverUser: { id: userId },
          read: false,
        },
      });
      const unreadChatCount = getUnreadChatsOFTravel.length;

      const chatCountOfNav = await this.chatRepo.find({
        where: {
          receiverUser: { id: userId },
          read: false
        }
      })
      io.to(userId).emit("chat-count", { chatCount: chatCountOfNav.length });
      io.to(userId).emit("chat-count-of-travel", { id: travelId, chatCount: unreadChatCount });
      return unreadChatCount;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
