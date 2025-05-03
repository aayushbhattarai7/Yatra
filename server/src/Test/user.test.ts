import { User } from "../entities/user/user.entity";
import bcryptService from "../service/bcrypt.service";
import { ActiveStatus, Gender, MediaType, PaymentType, ReportStatus, RequestStatus, Role } from "../constant/enum";
import HttpException from "../utils/HttpException.utils";
import { AppDataSource } from "../config/database.config";
import {  UserDTO } from "../dto/user.dto";
import {  LoginDTO } from "../dto/login.dto";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import {  RequestTravel } from "../entities/user/RequestTravels.entity";
import {  RequestGuide } from "../entities/user/RequestGuide.entities";
import esewaService from "../service/esewa.service"
import khaltiService from "../service/khalti.service";
import Stripe from "stripe";
import { Notification } from "../entities/notification/notification.entity";

jest.mock("../service/bcrypt.service", () => ({ 
  hash: jest.fn(),
  compare: jest.fn() 
}));

jest.mock("../service/esewa.service");
jest.mock("../service/khalti.service");

const mockUserRepo = { 
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

const mockGuideRepo = {
  findOne: jest.fn(),
  find: jest.fn()
};

const mockTravelRepo = {
  findOne: jest.fn(),
  find: jest.fn()
};

const mockGuideRequestRepo = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

const mockTravelRequestRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

const mockNotificationRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn()
};

jest.mock("../config/database.config", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity === User) return mockUserRepo;
      if (entity === Guide) return mockGuideRepo;
      if (entity === Travel) return mockTravelRepo;
      if (entity === RequestGuide) return mockGuideRequestRepo;
      if (entity === RequestTravel) return mockTravelRequestRepo;
      if (entity === Notification) return mockNotificationRepo;
      return {};
    }),
  },
}));

import userService from "../service/user.service";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return user on valid credentials", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: "user123",
        email: "user@test.com",
        password: "hashedPassword",
        role: "USER",
        firstName: "Test",
        verified: true,
        status: ActiveStatus.AVAILABLE,
      });

      (bcryptService.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login({
        email: "user@test.com",
        password: "correctPassword",
      });

      expect(result).toHaveProperty("id", "user123");
      expect(result.email).toBe("user@test.com");
    });

    it("should throw NotFound if email is not registered", async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        userService.login({ email: "unknown@test.com", password: "password" })
      ).rejects.toThrow(
        "The email you provided is not registered yet, please try with the registered one or create new account"
      );
    });

    it("should throw BadRequest if user is BANNED", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: "user123",
        email: "banned@test.com",
        password: "hashedPassword",
        status: ActiveStatus.BANNED,
      });

      await expect(
        userService.login({ email: "banned@test.com", password: "password" })
      ).rejects.toThrow(
        "You have been banned from using Yatra, If you have any help contact Yatra support team"
      );
    });

    it("should throw BadRequest if user is BLOCKED", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: "user123",
        email: "blocked@test.com",
        password: "hashedPassword",
        status: ActiveStatus.BLOCKED,
      });

      await expect(
        userService.login({ email: "blocked@test.com", password: "password" })
      ).rejects.toThrow(
        "You have been temporarily blocked from using Yatra,If you have any help contact Yatra support team"
      );
    });

    it("should throw BadRequest if password does not match", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: "user123",
        email: "user@test.com",
        password: "hashedPassword",
        status: ActiveStatus.AVAILABLE,
        verified: true,
      });

      (bcryptService.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.login({ email: "user@test.com", password: "wrongPassword" })
      ).rejects.toThrow("Password didnot matched");
    });

    it("should resend OTP if user is not verified", async () => {
      const resendOtpMock = jest.spyOn(userService, "reSendOtp").mockResolvedValue('');

      mockUserRepo.findOne.mockResolvedValue({
        id: "user123",
        email: "unverified@test.com",
        password: "hashedPassword",
        status: ActiveStatus.AVAILABLE,
        verified: false,
      });

      (bcryptService.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login({
        email: "unverified@test.com",
        password: "correctPassword",
      });

      expect(resendOtpMock).toHaveBeenCalledWith("unverified@test.com");
      expect(result).toHaveProperty("id", "user123");

      resendOtpMock.mockRestore();
    });

    it("should throw BadRequest if unknown error occurs", async () => {
      mockUserRepo.findOne.mockRejectedValue(new Error("Unknown Error"));

      await expect(
        userService.login({ email: "error@test.com", password: "password" })
      ).rejects.toThrow("Unknown Error");
    });
  });



  describe("signup", () => {
    const mockUserData: UserDTO = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password",
      phoneNumber: "1234567890",
      travelStyle: "Adventure",
      gender: Gender.MALE,
      role:Role.USER,
      middleName:""
    };

    it("should successfully register a new user", async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue({ id: "user123", ...mockUserData });
      (bcryptService.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const result = await userService.signup(mockUserData, {});
      expect(result).toBe("User registered successfully");
      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it("should throw conflict error for existing email", async () => {
      mockUserRepo.findOne.mockResolvedValue({ email: "test@example.com" });
      
      await expect(userService.signup(mockUserData, {}))
        .rejects.toThrow("Entered Email is already registered");
    });
  });

  describe("requestGuide", () => {
    const mockRequest = {
      from: "2023-01-01",
      to: "2023-01-07",
      totalDays: "7",
      totalPeople: "4"
    };

    it("should create a guide request", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
      mockGuideRepo.findOne.mockResolvedValue({ id: "guide123" });
      mockGuideRequestRepo.find.mockResolvedValue([]);

      const result = await userService.requestGuide("user123", "guide123", mockRequest);
      expect(result).toBe("Guide booking request sent successfully");
      expect(mockGuideRequestRepo.save).toHaveBeenCalled();
    });

    it("should throw error for existing request", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
      mockGuideRepo.findOne.mockResolvedValue({ id: "guide123" });
      mockGuideRequestRepo.find.mockResolvedValue([{}]);

      await expect(userService.requestGuide("user123", "guide123", mockRequest))
        .rejects.toThrow("Request already sent");
    });
  });

  // describe("advancePaymentForTravel", () => {
  //   it("should create Stripe payment intent", async () => {
  //     mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
  //     mockTravelRequestRepo.findOne.mockResolvedValue({
  //       id: "req123",
  //       travel: { id: "travel123" },
  //       advancePrice: 2500
  //     });

  //     const mockStripe = { paymentIntents: { create: jest.fn().mockResolvedValue({ client_secret: "secret" }) };
  //     (Stripe as unknown as jest.Mock).mockImplementation(() => mockStripe);

  //     const result = await userService.advancePaymentForTravel("user123", "req123", 2500);
  //     expect(result).toBe("secret");
  //   });
  // });

  describe("cancelTravelRequest", () => {
    it("should cancel travel request", async () => {
      mockTravelRequestRepo.findOne.mockResolvedValue({ id: "req123" });
      
      const result = await userService.cancelTravelRequest("user123", "req123");
      expect(result).toBe("Travel booking request cancelled successfully");
      expect(mockTravelRequestRepo.update).toHaveBeenCalledWith(
        { id: "req123" },
        {lastActionBy:Role.USER,
         status: RequestStatus.CANCELLED }
      );
    });
  });

  describe("advancePaymentForTravelWithEsewa", () => {
    it("should verify Esewa payment", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
      mockTravelRequestRepo.findOne.mockResolvedValue({ id: "req123" });
      (esewaService.verifyPayment as jest.Mock).mockResolvedValue(true);

      const result = await userService.advancePaymentForTravelWithEsewa("f7c47985-7b23-49bf-885d-9b407896e04a", "req123", "token");
      expect(result).toBe("Travel booked successfully");
    });
  });

  describe("completeTravelService", () => {
    it("should complete travel service", async () => {
      mockTravelRequestRepo.findOne.mockResolvedValue({
        id: "req123",
        status: RequestStatus.CONFIRMATION_PENDING
      });

      await userService.completeTravelService("user123", "travel123");
      expect(mockTravelRequestRepo.update).toHaveBeenCalledWith(
        { id: "req123" },
        { lastActionBy: Role.USER,status: RequestStatus.COMPLETED }
      );
    });
  });

  describe("sendTravelPrice", () => {
    it("should update travel price", async () => {
      mockTravelRequestRepo.findOne.mockResolvedValue({
        id: "req123",
        userBargain: 0
      });

      const result = await userService.sendTravelPrice("2500", "user123", "req123");
      expect(result).toBe("Price sent successfully");
      expect(mockTravelRequestRepo.update).toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should verify email with valid OTP", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        otp: "98399"
      });

      const result = await userService.verifyEmail("f7c47985-7b23-49bf-885d-9b407896e04a", "aayush.bhattarai.np@email.com", "98399");
      expect(result).toBe("Email changed successfully!.");
    });
  });

  describe("updatePassword", () => {
    it("should update password with valid current password", async () => {
      mockUserRepo.findOne.mockResolvedValue({
        password: "hashedPassword"
      });
      (bcryptService.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.updatePassword("user123", "newPass", "newPass", "oldPass");
      expect(result).toBe("Your password is updated successfully!.");
    });
  });

  describe("requestTravel", () => {
    const mockRequest = {
      from: "2023-01-01",
      to: "2023-01-07",
      totalDays: "7",
      totalPeople: "4"
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should create a travel request", async () => {
      mockUserRepo.findOne.mockResolvedValue({ 
        id: "user123", 
        firstName: "Test",
        lastName: "User"
      });
      mockTravelRepo.findOne.mockResolvedValue({ 
        id: "travel123",
        email: "travel@test.com",
        vehicleType: "SUV"
      });
      mockTravelRequestRepo.find.mockResolvedValue([]);
  
      const result = await userService.requestTravel("user123", "travel123", mockRequest);
  
      expect(result).toBe("Travel booking request sent successfully");
      expect(mockTravelRequestRepo.save).toHaveBeenCalled();
    });
  
    it("should throw error for existing request", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
      mockTravelRepo.findOne.mockResolvedValue({ id: "travel123" });
      mockTravelRequestRepo.find.mockResolvedValue([{
        status: RequestStatus.PENDING
      }]);
  
      await expect(
        userService.requestTravel("user123", "travel123", mockRequest)
      ).rejects.toThrow("Request already sent to this travel");
    });
  
    it("should throw error for invalid travel", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: "user123" });
      mockTravelRepo.findOne.mockResolvedValue(null);
  
      await expect(
        userService.requestTravel("user123", "invalid123", mockRequest)
      ).rejects.toThrow("Travel not found");
    });
  });

  // describe("reportTravel", () => {
  //   it("should create travel report", async () => {
  //     mockTravelRepo.findOne.mockResolvedValue({ id: "travel123" });
      
  //     await userService.reportTravel("user123", "travel123", "Bad service", []);
  //     expect(mockReportRepo.save).toHaveBeenCalled();
  //   });
  // });
});