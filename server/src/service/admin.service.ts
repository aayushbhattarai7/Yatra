import { Admin } from "../entities/admin/admin.entity";
import { AppDataSource } from "../config/database.config";
import HttpException from "../utils/HttpException.utils";
import bcryptService from "./bcrypt.service";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { Status } from "../constant/enum";
import { LoginDTO } from "../dto/login.dto";
import { Message } from "../constant/message";
import Mail from "../utils/mail.utils";
class AdminService {
  constructor(
    private readonly adminrepo = AppDataSource.getRepository(Admin),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
  ) {}

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

  async getGuideApprovalRequest(adminId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      if (!admin)
        throw HttpException.unauthorized("You are not authorized admin");

      const getUnapprovedGuide = await this.guideRepo.find({
        where: {
          approved: false,
          verified: true,
          approval:Status.PENDING
        },
        relations: ["kyc","details"],
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
          approval:Status.PENDING
        },
        relations: ["kyc", "details"],
      });
      console.log("🚀 ~ AdminService ~ getTravelApprovalRequest ~ getUnapprovedTravel:", getUnapprovedTravel)
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
      await Mail.sendMail(travel.email,'accepted')

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
      await Mail.sendMail(guide.email,'accepted')
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
     const update=  await this.guideRepo.update(
        { id: guideId },
        { approveStatus: message, approval: Status.REJECTED },
      );
        await Mail.sendMail(guide.email,'rejected', message)
      return "Guide rejected successfully"
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
      await Mail.sendMail(travel.email,'rejected', travel.approveStatus)

      return "Travel rejected rejected"
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
}

export default new AdminService();
