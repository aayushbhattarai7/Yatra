import { Admin } from "../entities/admin/admin.entity";
import bcryptService from "../service/bcrypt.service";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { ReportStatus, RequestStatus, Status } from "../constant/enum";
import { LoginDTO } from "../dto/login.dto";
import HttpException from "../utils/HttpException.utils";
import Mail from "../utils/mail.utils";
import { User } from "../entities/user/user.entity";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { Support } from "../entities/user/support.entity";
import { Report } from "../entities/user/report.entity";
import { Notification } from "../entities/notification/notification.entity";
import { io } from "../socket/socket";

jest.mock("../service/bcrypt.service", () => ({ compare: jest.fn() }));
jest.mock("../utils/mail.utils", () => ({ sendMail: jest.fn() }));
jest.mock("../socket/socket", () => ({ io: { to: jest.fn().mockReturnValue({ emit: jest.fn() }) } }));

const mockAdminRepo = { findOne: jest.fn(), findOneBy: jest.fn(), update: jest.fn() };
const mockUserRepo = { find: jest.fn() };
const mockGuideRepo = { find: jest.fn(), findOneBy: jest.fn(), update: jest.fn() };
const mockTravelRepo = { find: jest.fn(), findOneBy: jest.fn(), update: jest.fn() };
const mockGuideRequestRepo = { find: jest.fn() };
const mockTravelRequestRepo = { find: jest.fn() };
const mockNotificationRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
const mockSupportRepo = { find: jest.fn(), delete: jest.fn(), findOneBy: jest.fn() };
const mockReportRepo = { find: jest.fn(), findOne: jest.fn(), update: jest.fn(), delete: jest.fn() };

jest.mock("../config/database.config", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity === Admin) return mockAdminRepo;
      if (entity === User) return mockUserRepo;
      if (entity === Guide) return mockGuideRepo;
      if (entity === Travel) return mockTravelRepo;
      if (entity === RequestGuide) return mockGuideRequestRepo;
      if (entity === RequestTravel) return mockTravelRequestRepo;
      if (entity === Notification) return mockNotificationRepo;
      if (entity === Support) return mockSupportRepo;
      if (entity === Report) return mockReportRepo;
      return {};
    })
  }
}));

import adminService from "../service/admin.service";

describe("AdminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("returns admin on valid credentials", async () => {
      mockAdminRepo.findOne.mockResolvedValue({
        id: "123",
        email: "admin@gmail.com",
        password: "hashedPass",
        role: "ADMIN",
      });
      (bcryptService.compare as jest.Mock).mockResolvedValue(true);
      const result = await adminService.login({
        email: "admin@gmail.com",
        password: "Admin@123"
      });
      expect(result).toHaveProperty("id", "123");
    });

    it("throws NotFound on unknown email", async () => {
      mockAdminRepo.findOne.mockResolvedValue(null);
      await expect(adminService.login({ email: "unknown@gmail.com", password: "Admin@123" }))
        .rejects.toThrow("Invalid Email");
    });

    it("throws BadRequest on wrong password", async () => {
      mockAdminRepo.findOne.mockResolvedValue({ id: "123", password: "hashedPass" });
      (bcryptService.compare as jest.Mock).mockResolvedValue(false);
      await expect(adminService.login({ email: "admin@gmail.com", password: "wrongPassword" }))
        .rejects.toThrow("Password didnot matched");
    });
  });

  describe("getAdmin", () => {
    it("returns admin details", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      const result = await adminService.getAdmin("123");
      expect(result).toEqual({ id: "123" });
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.getAdmin("123")).rejects.toThrow("You are not authorized");
    });
  });

  describe("getGuideApprovalRequest", () => {
    it("returns unapproved guides", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.find.mockResolvedValue([{ id: "guide1" }]);
      const result = await adminService.getGuideApprovalRequest("123");
      expect(result).toEqual([{ id: "guide1" }]);
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.getGuideApprovalRequest("123"))
        .rejects.toThrow("You are not authorized admin");
    });

    it("throws not found when no guides", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.find.mockResolvedValue([]);
      await expect(adminService.getGuideApprovalRequest("123"))
        .rejects.toThrow("Guide not found");
    });
  });

  describe("getTravelApprovalRequest", () => {
    it("returns unapproved travels", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.find.mockResolvedValue([{ id: "travel1" }]);
      const result = await adminService.getTravelApprovalRequest("123");
      expect(result).toEqual([{ id: "travel1" }]);
    });

    it("throws not found when no travels", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.find.mockResolvedValue([]);
      await expect(adminService.getTravelApprovalRequest("123"))
        .rejects.toThrow("Travel not found");
    });
  });

  describe("approveTravel", () => {
    it("approves travel successfully", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.findOneBy.mockResolvedValue({ id: "travel1", email: "travel@test.com" });
      const result = await adminService.approveTravel("123", "travel1");
      expect(result).toBe("Travel Approved successfully");
      expect(Mail.sendMail).toHaveBeenCalled();
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.approveTravel("123", "travel1"))
        .rejects.toThrow("You are not authorized");
    });

    it("throws not found for invalid travel", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.approveTravel("123", "invalid"))
        .rejects.toThrow("Travel not found");
    });
  });

  describe("approveGuide", () => {
    it("approves guide successfully", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.findOneBy.mockResolvedValue({ id: "guide1", email: "guide@test.com" });
      const result = await adminService.approveGuide("123", "guide1");
      expect(result).toBe("Guide Approved successfully");
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.approveGuide("123", "guide1"))
        .rejects.toThrow("You are not authorized");
    });

    it("throws not found for invalid guide", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.approveGuide("123", "invalid"))
        .rejects.toThrow("Guide not found");
    });
  });

  describe("rejectGuide", () => {
    it("rejects guide successfully", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.findOneBy.mockResolvedValue({ id: "guide1", email: "guide@test.com" });
      const result = await adminService.rejectGuide("123", "guide1", "reason");
      expect(result).toBe("Guide rejected successfully");
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.rejectGuide("123", "guide1", "reason"))
        .rejects.toThrow("You are not authorized");
    });

    it("throws not found for invalid guide", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockGuideRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.rejectGuide("123", "invalid", "reason"))
        .rejects.toThrow("Guide not found");
    });
  });

  describe("rejectTravel", () => {
    it("rejects travel successfully", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.findOneBy.mockResolvedValue({ id: "travel1", email: "travel@test.com" });
      const result = await adminService.rejectTravel("123", "travel1", "reason");
      expect(result).toBe("Travel rejected rejected");
    });

    it("throws unauthorized for invalid admin", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.rejectTravel("123", "travel1", "reason"))
        .rejects.toThrow("You are not authorized");
    });

    it("throws not found for invalid travel", async () => {
      mockAdminRepo.findOneBy.mockResolvedValue({ id: "123" });
      mockTravelRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.rejectTravel("123", "invalid", "reason"))
        .rejects.toThrow("Travel not found");
    });
  });

  describe("getAllUsers", () => {
    it("returns all users", async () => {
      mockUserRepo.find.mockResolvedValue([{ id: "user1" }]);
      const result = await adminService.getAllUsers();
      expect(result).toEqual([{ id: "user1" }]);
    });

    it("throws not found when no users", async () => {
      mockUserRepo.find.mockResolvedValue([]);
      await expect(adminService.getAllUsers()).rejects.toThrow("Users not found");
    });
  });

  describe("getSupportMessages", () => {
    it("returns support messages", async () => {
      mockSupportRepo.find.mockResolvedValue([{ message: "help" }]);
      const result = await adminService.getSupportMessages();
      expect(result).toEqual([{ message: "help" }]);
    });

    it("throws not found when no messages", async () => {
      mockSupportRepo.find.mockResolvedValue([]);
      await expect(adminService.getSupportMessages()).rejects.toThrow("Messages not found");
    });
  });

  describe("getNotifications", () => {
    it("returns admin notifications", async () => {
      mockNotificationRepo.find.mockResolvedValue([{ id: "notif1" }]);
      const result = await adminService.getNotifications("123");
      expect(result).toEqual([{ id: "notif1" }]);
    });

    it("throws not found when no notifications", async () => {
      mockNotificationRepo.find.mockResolvedValue([]);
      await expect(adminService.getNotifications("123")).rejects.toThrow("Notifications not found");
    });
  });

  describe("deleteSupportMessage", () => {
    it("deletes support message", async () => {
      mockSupportRepo.findOneBy.mockResolvedValue({ id: "msg1" });
      const result = await adminService.deleteSupportMessage("msg1");
      expect(result).toBe("Message deleted successfully");
    });

    it("throws not found for invalid message", async () => {
      mockSupportRepo.findOneBy.mockResolvedValue(null);
      await expect(adminService.deleteSupportMessage("invalid"))
        .rejects.toThrow("Messages not found");
    });
  });

  describe("getReports", () => {
    it("returns all reports", async () => {
      mockReportRepo.find.mockResolvedValue([{ id: "report1" }]);
      const result = await adminService.getReports();
      expect(result).toEqual([{ id: "report1" }]);
    });

    it("throws not found when no reports", async () => {
      mockReportRepo.find.mockResolvedValue([]);
      await expect(adminService.getReports()).rejects.toThrow("Reports not found");
    });
  });

  describe("responseOnReport", () => {
    it("sends response on report", async () => {
      const mockReport = {
        id: "report1",
        reporterUser: { id: "user1" },
        reporterGuide: null,
        reporterTravel: null
      };
      mockReportRepo.findOne.mockResolvedValue(mockReport);
      mockNotificationRepo.create.mockReturnValue({});
      
      const result = await adminService.responseOnreport("report1", "response");
      expect(result).toBe("Response sent to the user successfully");
      expect(io.to).toHaveBeenCalled();
    });

    it("throws not found for invalid report", async () => {
      mockReportRepo.findOne.mockResolvedValue(null);
      await expect(adminService.responseOnreport("invalid", "response"))
        .rejects.toThrow("Reports not found");
    });
  });

  describe("deleteReports", () => {
    it("deletes report", async () => {
      mockReportRepo.findOne.mockResolvedValue({ id: "report1" });
      const result = await adminService.deleteReports("report1");
      expect(result).toBe(" Report deleted successfully");
    });

    it("throws not found for invalid report", async () => {
      mockReportRepo.findOne.mockResolvedValue(null);
      await expect(adminService.deleteReports("invalid"))
        .rejects.toThrow("Reports not found");
    });
  });

  describe("getAllTravels", () => {
    it("returns all travels", async () => {
      mockTravelRepo.find.mockResolvedValue([{ id: "travel1" }]);
      const result = await adminService.getAllTravels();
      expect(result).toEqual([{ id: "travel1" }]);
    });

    it("throws not found when no travels", async () => {
      mockTravelRepo.find.mockResolvedValue([]);
      await expect(adminService.getAllTravels()).rejects.toThrow("Travels not found");
    });
  });

  describe("getAllGuides", () => {
    it("returns all guides", async () => {
      mockGuideRepo.find.mockResolvedValue([{ id: "guide1" }]);
      const result = await adminService.getAllGuides();
      expect(result).toEqual([{ id: "guide1" }]);
    });

    it("throws not found when no guides", async () => {
      mockGuideRepo.find.mockResolvedValue([]);
      await expect(adminService.getAllGuides()).rejects.toThrow("Guides not found");
    });
  });

  describe("getTotalRevenue", () => {
    it("calculates total revenue", async () => {
      mockTravelRequestRepo.find.mockResolvedValue([{ price: "100" }]);
      mockGuideRequestRepo.find.mockResolvedValue([{ price: "200" }]);
      const result = await adminService.getTotalRevenue();
      expect(result).toBe(300);
    });
  });

  describe("getAllTravelRequests", () => {
    it("returns travel requests", async () => {
      mockTravelRequestRepo.find.mockResolvedValue([{ id: "req1" }]);
      const result = await adminService.getAllTravelRequests();
      expect(result).toEqual([{ id: "req1" }]);
    });

    it("throws not found when no requests", async () => {
      mockTravelRequestRepo.find.mockResolvedValue([]);
      await expect(adminService.getAllTravelRequests()).rejects.toThrow("requests not found");
    });
  });

  describe("getAllGuideRequests", () => {
    it("returns guide requests", async () => {
      mockGuideRequestRepo.find.mockResolvedValue([{ id: "req1" }]);
      const result = await adminService.getAllGuideRequests();
      expect(result).toEqual([{ id: "req1" }]);
    });

    it("throws not found when no requests", async () => {
      mockGuideRequestRepo.find.mockResolvedValue([]);
      await expect(adminService.getAllGuideRequests()).rejects.toThrow("requests not found");
    });
  });
});