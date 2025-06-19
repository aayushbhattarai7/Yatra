"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const room_entity_1 = require("../entities/chat/room.entity");
const database_config_1 = require("../config/database.config");
const HttpException_utils_1 = __importDefault(
  require("../utils/HttpException.utils"),
);
const user_entity_1 = require("../entities/user/user.entity");
const travel_entity_1 = require("../entities/travels/travel.entity");
const chat_entity_1 = require("../entities/chat/chat.entity");
const guide_entity_1 = require("../entities/guide/guide.entity");
class RoomService {
  roomrepo;
  userRepo;
  chatRepo;
  travelRepo;
  guideRepo;
  constructor(
    roomrepo = database_config_1.AppDataSource.getRepository(
      room_entity_1.Room,
    ),
    userRepo = database_config_1.AppDataSource.getRepository(
      user_entity_1.User,
    ),
    chatRepo = database_config_1.AppDataSource.getRepository(
      chat_entity_1.Chat,
    ),
    travelRepo = database_config_1.AppDataSource.getRepository(
      travel_entity_1.Travel,
    ),
    guideRepo = database_config_1.AppDataSource.getRepository(
      guide_entity_1.Guide,
    ),
  ) {
    this.roomrepo = roomrepo;
    this.userRepo = userRepo;
    this.chatRepo = chatRepo;
    this.travelRepo = travelRepo;
    this.guideRepo = guideRepo;
  }
  async checkRoomWithTravel(userId, receiverId) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user)
        throw HttpException_utils_1.default.badRequest("User not found");
      const receiver = await this.travelRepo.findOneBy({ id: receiverId });
      if (!receiver)
        throw HttpException_utils_1.default.badRequest("Travel not found");
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
        return createRoom;
      }
      return findRoom;
    } catch (error) {
      throw HttpException_utils_1.default.internalServerError(error.message);
    }
  }
  async checkRoomWithGuide(userId, receiverId) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user)
        throw HttpException_utils_1.default.badRequest("User not found");
      const receiver = await this.guideRepo.findOneBy({ id: receiverId });
      if (!receiver)
        throw HttpException_utils_1.default.badRequest("Travel not found");
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
        return createRoom;
      }
      return findRoom;
    } catch (error) {
      return null;
    }
  }
  async getConnectedUsers(user_id) {
    try {
      const user = await this.userRepo.findOneBy({ id: user_id });
      if (!user)
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      const getConnectUsers = await this.roomrepo.find({
        where: { user: { id: user_id } },
        relations: ["user", "travel", "guide"],
      });
      if (!getConnectUsers)
        throw HttpException_utils_1.default.badRequest(
          "No users are connected",
        );
      return getConnectUsers;
    } catch (error) {
      if (error instanceof Error)
        throw HttpException_utils_1.default.badRequest(error.message);
    }
  }
  async getUserOfChatByTravel(travel_id) {
    try {
      const travel = await this.travelRepo.findOneBy({ id: travel_id });
      if (!travel)
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      const getConnectUsers = await this.roomrepo.find({
        where: { travel: { id: travel_id } },
        relations: ["user", "travel"],
      });
      return getConnectUsers;
    } catch (error) {
      if (error instanceof Error)
        throw HttpException_utils_1.default.badRequest(error.message);
    }
  }
  async getUserOfChatByGuide(guide_id) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide)
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      const getConnectUsers = await this.roomrepo.find({
        where: { guide: { id: guide_id } },
        relations: ["user", "guide"],
      });
      return getConnectUsers;
    } catch (error) {
      if (error instanceof Error)
        throw HttpException_utils_1.default.badRequest(error.message);
    }
  }
}
exports.RoomService = RoomService;
