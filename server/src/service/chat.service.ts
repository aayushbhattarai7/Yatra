import { Chat } from "../entities/chat/chat.entity";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import HttpException from "../utils/HttpException.utils";
import { Room } from "../entities/chat/room.entity";
import { Travel } from "../entities/travels/travel.entity";
import { Guide } from "../entities/guide/guide.entity";
import { ChatDTO } from "../dto/chat.dto";
import { RoomService } from "../service/room.service";
import { io } from "../socket/socket";

const roomService = new RoomService();

export class ChatService {
  constructor(
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly roomRepo = AppDataSource.getRepository(Room),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
  ) {}

  async chatWithGuide(userId: string, guideId: string, message: string) {
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
      io.to(guideId).emit("guide-message", chat);
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
      // const getChats = await this.chatRepo.find({where:{receiverTravel:{id:travelId}}, relations:['receiverUser','receiverGuide','receiverTravel','senderTravel','senderGuide','senderUser']})
      // io.to(travelId).emit("message", getChats)
      io.to(travelId).emit("travel-message", chat);
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
      io.to(user_id).emit("travel-message-to-user", chat);
      return chat;
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
      const travel = await this.travelRepo.findOneBy({ id: guideId });
      if (!travel) throw HttpException.notFound("Travel not found");
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
      return updateChat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
