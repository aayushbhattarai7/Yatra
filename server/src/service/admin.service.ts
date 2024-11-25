import { Admin } from "../entities/admin/admin.entity";
import { AppDataSource } from "../config/database.config";
import { AdminDTO } from "../dto/admin.dto";
import HttpException from "../utils/HttpException.utils";
import BcryptService from "./bcrypt.service";
import { Guide } from "../entities/guide/guide.entity";
import { Travel } from "../entities/travels/travel.entity";
import { Status } from "../constant/enum";
const bcryptService = new BcryptService();
class AdminService {
  constructor(
    private readonly adminrepo = AppDataSource.getRepository(Admin),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
  ) {}

  async createAdmin(data: AdminDTO): Promise<Admin> {
    try {
      const emailExist = await this.adminrepo.findOneBy({ email: data.email });
      if (emailExist)
        throw HttpException.notFound("Entered Email is not registered yet");

      const hashPassword = await bcryptService.hash(data.password);
      const addAdmin = this.adminrepo.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
      });
      await this.adminrepo.save(addAdmin);
      return addAdmin;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async loginAdmin(data: AdminDTO): Promise<Admin> {
    try {
      const admin = await this.adminrepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
      });
      if (!admin) throw HttpException.notFound("Invalid Email");
      const checkPassword = await bcryptService.compare(
        data.password,
        admin.password,
      );
      if (!checkPassword)
        throw HttpException.badRequest("Password didnot matched");
      return admin;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
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
        },
        relations: ["guideKyc"],
      });
      if (!getUnapprovedGuide) throw HttpException.notFound("Guide not found");
      return getUnapprovedGuide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTravelApprovalRequest(adminId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: adminId });
      console.log(
        "🚀 ~ AdminService ~ getTravelApprovalRequest ~ admin:",
        admin,
      );
      if (!admin)
        throw HttpException.unauthorized("You are not authorized admin");

      const getUnapprovedTravel = await this.travelRepo.find({
        where: {
          approved: false,
          verified: true,
        },
        relations: ["kyc"],
      });
      if (!getUnapprovedTravel)
        throw HttpException.notFound("Travel not found");
      return getUnapprovedTravel;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
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
      return "Approved successfully";
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
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
      await this.guideRepo.update(
        { id: guideId },
        { approveStatus: message, approval: Status.REJECTED },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async rejectTravel(adminId: string, travelId: string, message: string) {
    console.log("🚀 ~ AdminService ~ rejectTravel ~ message:", message);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}

export default new AdminService();
