import { Admin } from "../entities/admin/admin.entity";
import { AppDataSource } from "../config/database.config";
import HttpException from "../utils/HttpException.utils";
import bcryptService from "./bcrypt.service";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { ReportStatus, RequestStatus, Status } from "../constant/enum";
import { LoginDTO } from "../dto/login.dto";
import { Message } from "../constant/message";
import Mail from "../utils/mail.utils";
import { User } from "../entities/user/user.entity";
import { Rating } from "../entities/ratings/rating.entity";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { RequestTravel } from "../entities/user/RequestTravels.entity";
import { Support } from "../entities/user/support.entity";
import { Report } from "../entities/user/report.entity";
import { Notification } from "../entities/notification/notification.entity";
import { io } from "../socket/socket";
class AdminService {
  constructor(
    private readonly adminrepo = AppDataSource.getRepository(Admin),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
    private readonly ratingsRepo = AppDataSource.getRepository(Rating),
    private readonly guideRequestRepo = AppDataSource.getRepository(
      RequestGuide,
    ),
    private readonly travelRequestRepo = AppDataSource.getRepository(
      RequestTravel,
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification,
    ),
    private readonly supportRepo = AppDataSource.getRepository(Support),
    private readonly reportRepo = AppDataSource.getRepository(Report),


  ) { }

  async login(data: LoginDTO): Promise<Admin> {
    try {
      console.log("admin");
      const admin = await this.adminrepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
      });
      console.log(admin);
      if (!admin) throw HttpException.notFound("Invalid Email");
      const checkPassword = await bcryptService.compare(
        data.password,
        admin.password,
      );
      if (!checkPassword)
        throw HttpException.badRequest("Password didnot matched");
      return admin;
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async getAdmin(id: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id });
      return admin!;
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async getGuideApprovalRequest(adminId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin)
        throw HttpException.unauthorized("You are not authorized admin");

      const getUnapprovedGuide = await this.guideRepo.find({
        where: {
          approved: false,
          verified: true,
          approval: Status.PENDING,
        },
        relations: ["kyc", "details"],
      });
      if (!getUnapprovedGuide) throw HttpException.notFound("Guide not found");
      return getUnapprovedGuide;
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async getTravelApprovalRequest(adminId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin)
        throw HttpException.unauthorized("You are not authorized admin");

      const getUnapprovedTravel = await this.travelRepo.find({
        where: {
          approved: false,
          verified: true,
          approval: Status.PENDING,
        },
        relations: ["kyc", "details"],
      });
      console.log(
        "🚀 ~ AdminService ~ getTravelApprovalRequest ~ getUnapprovedTravel:",
        getUnapprovedTravel,
      );
      if (!getUnapprovedTravel)
        throw HttpException.notFound("Travel not found");
      return getUnapprovedTravel;
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async approveTravel(adminId: string, travelId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin) throw HttpException.unauthorized("You are not authorized");
      console.log("aayo");
      const travel = await this.travelRepo.findOneBy({ id: travelId });
      if (!travel) throw HttpException.notFound("Travel not found");
      console.log(adminId, "admin", travelId);
      const data = await this.travelRepo.update(
        { id: travelId, approved: false },
        { approved: true, approval: Status.ACCEPTED },
      );
      await Mail.sendMail(travel.email, "accepted");

      return "Travel Approved successfully";
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async approveGuide(adminId: string, guideId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin) throw HttpException.unauthorized("You are not authorized");

      const guide = await this.guideRepo.findOneBy({ id: guideId });
      if (!guide) throw HttpException.notFound("Guide not found");

      await this.guideRepo.update(
        { id: guideId, approved: false },
        { approved: true, approval: Status.ACCEPTED },
      );
      await Mail.sendMail(guide.email, "accepted");
      return "Guide Approved successfully";
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async rejectGuide(adminId: string, guideId: string, message: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin) throw HttpException.unauthorized("You are not authorized");
      const guide = await this.guideRepo.findOneBy({
        id: guideId,
        approved: false,
      });
      if (!guide) throw HttpException.notFound("Guide not found");
      const update = await this.guideRepo.update(
        { id: guideId },
        { approveStatus: message, approval: Status.REJECTED },
      );
      await Mail.sendMail(guide.email, "rejected", message);
      return "Guide rejected successfully";
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async rejectTravel(adminId: string, travelId: string, message: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin) throw HttpException.unauthorized("You are not authorized");
      const travel = await this.travelRepo.findOneBy({
        id: travelId,
        approved: false,
      });
      if (!travel) throw HttpException.notFound("Travel not found");
      await this.travelRepo.update(
        { id: travelId },
        { approveStatus: message, approval: Status.REJECTED },
      );
      await Mail.sendMail(travel.email, "rejected", travel.approveStatus);

      return "Travel rejected rejected";
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepo.find({ relations: ["image"] });
      if (users.length === 0)
        throw HttpException.notFound("Users not found");
      return users;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async getSupportMessages() {
    try {
      const message = await this.supportRepo.find();
      console.log("🚀 ~ AdminService ~ getSupportMessages ~ message:", message)
      if (message.length === 0)
        throw HttpException.notFound("Messages not found");
      return message;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async getNotifications(id: string) {
    try {
      const notification = await this.notificationRepo.find({
        where: {
          receiverAdmin: { id }
        }
      });
      if (notification.length === 0)
        throw HttpException.notFound("Notifications not found");
      return notification;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async deleteSupportMessage(id: string) {
    try {
      const message = await this.supportRepo.findOneBy({ id });
      if (!message)
        throw HttpException.notFound("Messages not found");
      await this.supportRepo.delete({ id })
      return "Message deleted successfully";
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async getReports() {
    try {
      const reports = await this.reportRepo.find({ relations: ["reporterUser", "reportedUser", "reporterGuide", "reportedGuide", "reporterTravel", "reportedTravel", "file"] });
      if (reports.length === 0)
        throw HttpException.notFound("Reports not found");
      return reports;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  async responseOnreport(reportId: string, response: string) {
    try {
      const report = await this.reportRepo.findOne({
        where: { id: reportId },
        relations: [
          "reporterUser",
          "reportedUser",
          "reporterGuide",
          "reportedGuide",
          "reporterTravel",
          "reportedTravel",
          "file",
        ],
      });
  
      if (!report) {
        throw HttpException.notFound("Reports not found");
      }
  
  
      let reporterType = "";
      let reporterInfo: any = null;
  
      if (report.reporterUser) {
        reporterType = "user";
        reporterInfo = report.reporterUser;
        const notification = this.notificationRepo.create({
          message:"Admin responded about your recent report please check your mail for details",
          receiverUser:{id:reporterInfo.id}
        })
        await this.notificationRepo.save(notification)
        io.to(reporterInfo.id).emit("notification",notification)
      } else if (report.reporterGuide) {
        reporterType = "guide";
        reporterInfo = report.reporterGuide;
        const notification = this.notificationRepo.create({
          message:"Admin responded about your recent report please check your mail for details",
          receiverGuide:{id:reporterInfo.id}
        })
        await this.notificationRepo.save(notification)
        io.to(reporterInfo.id).emit("notification",notification)
      } else if (report.reporterTravel) {
        reporterType = "travel";
        reporterInfo = report.reporterTravel;
        const notification = this.notificationRepo.create({
          message:"Admin responded about your recent report please check your mail for details",
          receiverTravel:{id:reporterInfo.id}
        })
        await this.notificationRepo.save(notification)
        io.to(reporterInfo.id).emit("notification",notification)

      }
  
      console.log(`Reporter is a ${reporterType}`, reporterInfo);
  
      await this.reportRepo.update({ id: reportId }, { adminResponse: response, status:ReportStatus.SOLVED });
  
      return "Response sent to the user successfully";
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  


  async deleteReports(id: string) {
    try {
      const reports = await this.reportRepo.findOneBy({ id })
      if (!reports)
        throw HttpException.notFound("Reports not found");
      await this.reportRepo.delete({ id })
      return " Report deleted successfully";
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async getAllTravels() {
    try {
      const users = await this.travelRepo.find({
        relations: ["kyc", "details"],
      });
      if (users.length === 0) throw HttpException.notFound("Travels not found");
      return users;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async getAllGuides() {
    try {
      const guides = await this.guideRepo.find({
        relations: ["kyc", "details"],
      });
      if (guides.length === 0) throw HttpException.notFound("Guides not found");
      return guides;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  async getHighestRatingGuides() {
    try {
      const guides = await this.guideRepo.find({
        relations: ["ratings", "kyc", "details"],
      });

      if (!guides.length) {
        throw HttpException.notFound("Guides not found");
      }
      const guidesWithRating = guides.map((guide) => {
        const totalRatings =
          guide.ratings?.reduce((sum, r) => sum + r.rating, 0) || 0;
        const avgRating = guide.ratings?.length
          ? parseFloat((totalRatings / guide.ratings.length).toFixed(2))
          : 0;

        return {
          ...guide,
          averageRating: avgRating,
        };
      });
      const topGuides = guidesWithRating
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);

      return topGuides;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  async getHighestRatingTravels() {
    try {
      const travels = await this.travelRepo.find({
        relations: ["ratings", "kyc", "details"],
      });

      if (!travels.length) {
        throw HttpException.notFound("Travel not found");
      }
      const travelsWithRating = travels.map((travel) => {
        const totalRatings =
          travel.ratings?.reduce((sum, r) => sum + r.rating, 0) || 0;
        const avgRating = travel.ratings?.length
          ? parseFloat((totalRatings / travel.ratings.length).toFixed(2))
          : 0;

        return {
          ...travel,
          averageRating: avgRating,
        };
      });
      const topTravels = travelsWithRating
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);

      return topTravels;
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  async getTotalRevenue() {
    try {
      const completedTravelRequests = await this.travelRequestRepo.find({
        where: { status: RequestStatus.COMPLETED },
        select: ["price"],
      });

      const completedGuideRequests = await this.guideRequestRepo.find({
        where: { status: RequestStatus.COMPLETED },
        select: ["price"],
      });

      const allPrices = [
        ...completedTravelRequests.map((req) => parseFloat(req.price)),
        ...completedGuideRequests.map((req) => parseFloat(req.price)),
      ];

      const totalRevenue = allPrices.reduce((sum, price) => sum + price, 0);

      return parseFloat(totalRevenue.toFixed(2));
    } catch (error) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Failed to fetch revenue",
      );
    }
  }

  async getGroupedRevenue() {
    const completedTravelRequests = await this.travelRequestRepo.find({
      where: { status: RequestStatus.COMPLETED },
    });
    const completedGuideRequests = await this.guideRequestRepo.find({
      where: { status: RequestStatus.COMPLETED },
    });

    const allRequests = [...completedTravelRequests, ...completedGuideRequests];

    const daily: Record<string, number> = {};
    const weekly: Record<string, number> = {};
    const monthly: Record<string, number> = {};
    const yearly: Record<string, number> = {};

    allRequests.forEach((req) => {
      const date = new Date(req.updatedAt);
      const price = parseFloat(req.price);

      const day = date.toISOString().split("T")[0];
      const week = `${this.getStartOfWeek(date)} to ${this.getEndOfWeek(date)}`;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const year = String(date.getFullYear());

      daily[day] = (daily[day] || 0) + price;
      weekly[week] = (weekly[week] || 0) + price;
      monthly[month] = (monthly[month] || 0) + price;
      yearly[year] = (yearly[year] || 0) + price;
    });

    return {
      daily: Object.entries(daily).map(([name, revenue]) => ({
        name,
        revenue,
      })),
      weekly: Object.entries(weekly).map(([name, revenue]) => ({
        name,
        revenue,
      })),
      monthly: Object.entries(monthly).map(([name, revenue]) => ({
        name,
        revenue,
      })),
      yearly: Object.entries(yearly).map(([name, revenue]) => ({
        name,
        revenue,
      })),
    };
  }

  getStartOfWeek(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  }

  getEndOfWeek(date: Date): string {
    const start = new Date(this.getStartOfWeek(date));
    const sunday = new Date(start);
    sunday.setDate(start.getDate() + 6);
    return sunday.toISOString().split("T")[0];
  }

  async getAllTravelRequests() {
    try {
      const travelRequests = await this.travelRequestRepo.find({ relations: ["user", "travel", "travel.kyc", "user.image"] })
      if (travelRequests.length === 0) throw HttpException.notFound("requests not found")
      return travelRequests
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Failed to fetch revenue",
      );
    }
  }
  async getAllGuideRequests() {
    try {
      const guideRequests = await this.guideRequestRepo.find({ relations: ["users", "guide", "guide.kyc", "users.image"] })
      if (guideRequests.length === 0) throw HttpException.notFound("requests not found")
      return guideRequests
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : "Failed to fetch revenue",
      );
    }
  }
}

export default new AdminService();
