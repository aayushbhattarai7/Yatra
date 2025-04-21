import { User } from "../entities/user/user.entity";
import bcryptService from "../service/bcrypt.service";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import HttpException from "../utils/HttpException.utils";
import Mail from "../utils/mail.utils";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { Notification } from "../entities/notification/notification.entity";
import { io } from "../socket/socket";
import { Report } from "../entities/user/report.entity";

jest.mock("../service/bcrypt.service", () => ({ compare: jest.fn(), hash: jest.fn() }));
jest.mock("../utils/mail.utils", () => ({ sendMail: jest.fn() }));
jest.mock("../socket/socket", () => ({ io: { to: jest.fn().mockReturnValue({ emit: jest.fn() }) } }));

const mockUserRepo = { 
  findOne: jest.fn(), 
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  find: jest.fn()
};
const mockGuideRepo = { find: jest.fn(), findOneBy: jest.fn() };
const mockTravelRepo = { find: jest.fn(), findOneBy: jest.fn() };
const mockGuideRequestRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn(), update: jest.fn() };
const mockTravelRequestRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn(), update: jest.fn() };
const mockNotificationRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn(), update: jest.fn() };
const mockSupportRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
const mockReportRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
const mockUserImageRepo = { create: jest.fn(), save: jest.fn() };
const mockLocationRepo = { findOneBy: jest.fn(), create: jest.fn(), save: jest.fn(), update: jest.fn() };
const mockPlaceRepo = { find: jest.fn() };
const mockPlaceRatingsRepo = { create: jest.fn(), save: jest.fn() };
const mockChatRepo = { find: jest.fn() };

jest.mock("../config/database.config", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity === User) return mockUserRepo;
      if (entity === Guide) return mockGuideRepo;
      if (entity === Travel) return mockTravelRepo;
      if (entity === RequestGuide) return mockGuideRequestRepo;
      if (entity === RequestTravel) return mockTravelRequestRepo;
      if (entity === Notification) return mockNotificationRepo;
      if (entity === Report) return mockReportRepo;
      if (entity === UserImage) return mockUserImageRepo;
      if (entity === Location) return mockLocationRepo;
      if (entity === TrekkingPlace) return mockPlaceRepo;
      if (entity === PlaceRating) return mockPlaceRatingsRepo;
      if (entity === Chat) return mockChatRepo;
      if (entity === Support) return mockSupportRepo;
      return {};
    })
  }
}));

import userService from "../service/user.service";
import UserImage from "../entities/user/userImage.entity";
import { TrekkingPlace } from "../entities/place/trekkingplace.entity";
import { PlaceRating } from "../entities/ratings/place.rating.entity";
import { Chat } from "../entities/chat/chat.entity";
import { Support } from "../entities/user/support.entity";
import { ActiveStatus } from "../constant/enum";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("creates user with valid data", async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue({ id: "1", email: "test@test.com" });
      mockUserRepo.save.mockResolvedValue({ id: "1" });
      
      const result = await userService.signup(
        { email: "test@test.com", password: "ValidPass123!" } as any,
        { profile: { mimetype: "image/jpeg" } }
      );
      
      expect(result).toContain("User registered successfully");
    });

    it("throws error for existing email", async () => {
      mockUserRepo.findOne.mockResolvedValue({});
      await expect(userService.signup({ email: "exists@test.com" } as any, {}))
        .rejects.toThrow("Entered Email is already registered");
    });
  });

  describe("login", () => {
    it("returns user on valid credentials", async () => {
      mockUserRepo.findOne.mockResolvedValue({ 
        id: "1", 
        password: "hashed", 
        status: ActiveStatus.AVAILABLE,
        verified: true 
      });
      (bcryptService.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login({ email: "test@test.com", password: "ValidPass123!" });
      expect(result).toHaveProperty("id", "1");
    });

    it("throws error for banned user", async () => {
      mockUserRepo.findOne.mockResolvedValue({ status: ActiveStatus.BANNED });
      await expect(userService.login({ email: "banned@test.com", password: "any" }))
        .rejects.toThrow("banned from using Yatra");
    });
  });

  describe("requestGuide", () => {
    it("creates guide request successfully", async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: "1" });
      mockGuideRepo.findOneBy.mockResolvedValue({ id: "g1", approved: true });
      mockGuideRequestRepo.create.mockReturnValue({ id: "req1" });
      
      const result = await userService.requestGuide("1", "g1", {} as any);
      expect(result).toContain("Guide booking request");
    });
  });

});