
// src/Test/admin.test.ts

import { AppDataSource } from "../config/database.config";
import bcryptService from "../service/bcrypt.service";
import Mail from "../utils/mail.utils";
import { io } from "../socket/socket";
import HttpException from "../utils/HttpException.utils";
import { Admin } from "../entities/admin/admin.entity";
import { User } from "../entities/user/user.entity";
import { Guide } from "../entities/guide/guide.entity";

jest.mock("../config/database.config", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("../service/bcrypt.service", () => ({
  compare: jest.fn()
}));
jest.mock("../utils/mail.utils", () => ({
  sendMail: jest.fn()
}));
jest.mock("../socket/socket", () => ({
  io: { to: jest.fn().mockReturnThis(), emit: jest.fn() }
}));

const createMockRepo = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockAdminRepo     = createMockRepo();
const mockUserRepo      = createMockRepo();
const mockGuideRepo     = createMockRepo();
const mockTravelRepo    = createMockRepo();
const mockRatingRepo    = createMockRepo();
const mockGuideReqRepo  = createMockRepo();
const mockTravelReqRepo = createMockRepo();
const mockNotifRepo     = createMockRepo();
const mockSupportRepo   = createMockRepo();
const mockReportRepo    = createMockRepo();

const setupGetRepositoryMocks = () => {
  (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
    if (entity === Admin) return mockAdminRepo;
    if (entity === User) return mockUserRepo;
    if (entity === Guide) return mockGuideRepo;
  });
};

let AdminService: typeof import("../service/admin.service").default;

beforeAll(() => {
  setupGetRepositoryMocks();
});

beforeEach(() => {
  jest.resetModules();
  setupGetRepositoryMocks();
  const { default: svc } = require("../service/admin.service");
  AdminService = svc;
});

describe("AdminService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("login", () => {
    it("returns admin on valid credentials", async () => {
        mockAdminRepo.findOne.mockResolvedValue({
          id: "c225b4bc-1e90-4ec3-ab86-274d25c26ea8",
          email: "admin@gmail.com",
          password: "$2a$10$ssi6Jy8LxtrpfaKPO6wG..tCkvCoXF4KA35g7ppisGlW.8SZF4rlC",
          role: "ADMIN"
        });
        
        (bcryptService.compare as jest.Mock).mockResolvedValue(true);
      
        const result = await AdminService.login({
          email: "admin@gmail.com",
          password: "Admin@123"
        });
      
        expect(result).toHaveProperty("id", "c225b4bc-1e90-4ec3-ab86-274d25c26ea8");
      });

    it("throws NotFound on unknown email", async () => {
      mockAdminRepo.findOne.mockResolvedValue(null);
      await expect(AdminService.login({ email: "admin@gmail.com", password: "Admin@123" })).rejects.toThrow(HttpException);
    });

    it("throws BadRequest on wrong password", async () => {
      mockAdminRepo.findOne.mockResolvedValue({ id: "1", email: "a@b.com", password: "hash", role: "admin" });
      (bcryptService.compare as jest.Mock).mockResolvedValue(false);
      await expect(AdminService.login({ email: "a@b.com", password: "wrong" })).rejects.toThrow(HttpException);
    });
  });
});

//   describe("getAdmin", () => {
//     it("returns admin when found", async () => {
//       const fake = "c225b4bc-1e90-4ec3-ab86-274d25c26ea8";
//       mockAdminRepo.findOneBy.mockResolvedValue(fake);
//       await expect(AdminService.getAdmin("c225b4bc-1e90-4ec3-ab86-274d25c26ea8")).resolves.toBe(fake);
//     });

//     it("wraps DB errors", async () => {
//       mockAdminRepo.findOneBy.mockRejectedValue(new Error("DB down"));
//       await expect(AdminService.getAdmin("1")).rejects.toThrow(HttpException);
//     });
//   });

//   describe("getGuideApprovalRequest", () => {
//     it("errors if caller not admin", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue(null);
//       await expect(AdminService.getGuideApprovalRequest("1")).rejects.toThrow(HttpException);
//     });

//     it("returns pending guides", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue({ id: "1" });
//       const guides = [{ id: "g1" }];
//       mockGuideRepo.find.mockResolvedValue(guides);
//       await expect(AdminService.getGuideApprovalRequest("1")).resolves.toBe(guides);
//     });

//     it("returns empty array when no pending guides", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue({ id: "1" });
//       mockGuideRepo.find.mockResolvedValue([]);
//       const res = await AdminService.getGuideApprovalRequest("1");
//       expect(res).toEqual([]);
//     });
//   });

//   describe("approveTravel", () => {
//     it("approves travel and sends email", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue({ id: "a" });
//       const travel = { id: "t1", email: "t@e.com" };
//       mockTravelRepo.findOneBy.mockResolvedValue(travel);
//       mockTravelRepo.update.mockResolvedValue({});

//       const msg = await AdminService.approveTravel("a", "t1");
//       expect(mockTravelRepo.update).toHaveBeenCalledWith(
//         { id: "t1", approved: false },
//         expect.objectContaining({ approved: true, approval: expect.anything() })
//       );
//       expect(Mail.sendMail).toHaveBeenCalledWith(expect.stringContaining("@"), "accepted");
//       expect(msg).toBe("Travel Approved successfully");
//     });

//     it("errors if travel missing", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue({ id: "a" });
//       mockTravelRepo.findOneBy.mockResolvedValue(null);
//       await expect(AdminService.approveTravel("a", "t1")).rejects.toThrow(HttpException);
//     });

//     it("errors if caller is not admin", async () => {
//       mockAdminRepo.findOneBy.mockResolvedValue(null);
//       await expect(AdminService.approveTravel("x", "t1")).rejects.toThrow(HttpException);
//     });
//   });
