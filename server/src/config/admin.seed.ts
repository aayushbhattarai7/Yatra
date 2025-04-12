
import bcryptService from "../service/bcrypt.service";
import { Role } from "../constant/enum";
import { Admin } from "../entities/admin/admin.entity";
import { AppDataSource } from "./database.config";
import { DotenvConfig } from "./env.config";
import { createdMessage } from "../constant/message";
import HttpException from "../utils/HttpException.utils";

class SeedAdmin {
  constructor(
    private readonly adminRepsository = AppDataSource.getTreeRepository(Admin),
  ) {}

  async createAdmin(): Promise<String> {
    try {
      const IsAdminExist = await this.adminRepsository.findOneBy({
        email: DotenvConfig.ADMIN_EMAIL,
      });
      if (IsAdminExist) throw HttpException.conflict("Admin is already seeded");

      const hashedPassword = await bcryptService.hash(
        DotenvConfig.ADMIN_PASSWORD,
      );

      const admin = this.adminRepsository.create({
        name: DotenvConfig.ADMIN_NAME,
        role: Role.ADMIN,
        email: DotenvConfig.ADMIN_EMAIL,
        password: hashedPassword,
      });
      await this.adminRepsository.save(admin);
      return createdMessage("Admin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.internalServerError(error.message);
      } else {
        throw HttpException.internalServerError("Unexpected Error Occured");
      }
    }
  }
}

(async () => {
  try {
    console.log("Connecting to the database...");
    await AppDataSource.initialize();

    const seedAdmin = new SeedAdmin();
    const result = await seedAdmin.createAdmin();
    console.log(result);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
})();
