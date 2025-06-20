import { Room } from "../entities/chat/room.entity";
import { AppDataSource } from "../config/database.config";
import HttpException from "../utils/HttpException.utils";
import { User } from "../entities/user/user.entity";
import { Travel } from "../entities/travels/travel.entity";
import { Chat } from "../entities/chat/chat.entity";
import { Guide } from "../entities/guide/guide.entity";
import { io } from "../socket/socket";

export class RoomService {
  constructor(
    private readonly roomrepo = AppDataSource.getRepository(Room),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
  ) {}
  async checkRoomWithTravel(userId: string, receiverId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.badRequest("User not found");
      const receiver = await this.travelRepo.findOneBy({ id: receiverId });
      if (!receiver) throw HttpException.badRequest("Travel not found");

      const findRoom = await this.roomrepo.findOne({
        where: [
          { user: { id: userId }, travel: { id: receiverId } },
          { travel: { id: receiverId }, user: { id: userId } },
        ],
      });
      if (!findRoom) {
        const createRoom = this.roomrepo.create({
          user: user,
          travel: receiver,
        });
        await this.roomrepo.save(createRoom);
        io.to(receiverId).emit("room", createRoom)
        io.to(userId).emit("room", createRoom)

        return createRoom;
      }
      return findRoom;
    } catch (error: any) {
      throw HttpException.internalServerError(error.message);
    }
  }
  async checkRoomWithGuide(userId: string, receiverId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw HttpException.badRequest("User not found");

      const receiver = await this.guideRepo.findOneBy({ id: receiverId });
      if (!receiver) throw HttpException.badRequest("Travel not found");

      const findRoom = await this.roomrepo.findOne({
        where: [
          { user: { id: userId }, guide: { id: receiverId } },
          { guide: { id: receiverId }, user: { id: userId } },
        ],
      });
      if (!findRoom) {
        const createRoom = this.roomrepo.create({
          user: user,
          guide: receiver,
        });
        await this.roomrepo.save(createRoom);
        io.to(receiverId).emit("room", createRoom)
        io.to(userId).emit("room", createRoom)
        return createRoom;
      }
      return findRoom;
    } catch (error) {
      return null;
    }
  }

  async getConnectedUsers(user_id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const getConnectUsers = await this.roomrepo.find({
        where: { user: { id: user_id } },
        relations: ["user", "travel", "guide"],
      });
      if (!getConnectUsers)
        throw HttpException.badRequest("No users are connected");
      return getConnectUsers;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }

  async getUserOfChatByTravel(travel_id: string) {
    try {
      const travel = await this.travelRepo.findOneBy({ id: travel_id });
      if (!travel) throw HttpException.unauthorized("You are not authorized");

      const getConnectUsers = await this.roomrepo.find({
        where: { travel: { id: travel_id } },
        relations: ["user", "travel"],
      });
      return getConnectUsers;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }
  async getUserOfChatByGuide(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) throw HttpException.unauthorized("You are not authorized");

      const getConnectUsers = await this.roomrepo.find({
        where: { guide: { id: guide_id } },
        relations: ["user", "guide","user.image"],
      });
      return getConnectUsers;
    } catch (error: unknown) {
      if (error instanceof Error) throw HttpException.badRequest(error.message);
    }
  }
}
