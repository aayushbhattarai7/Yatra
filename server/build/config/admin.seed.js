"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_service_1 = __importDefault(require("../service/bcrypt.service"));
const enum_1 = require("../constant/enum");
const admin_entity_1 = require("../entities/admin/admin.entity");
const database_config_1 = require("./database.config");
const env_config_1 = require("./env.config");
const message_1 = require("../constant/message");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
class SeedAdmin {
    adminRepsository;
    constructor(adminRepsository = database_config_1.AppDataSource.getTreeRepository(admin_entity_1.Admin)) {
        this.adminRepsository = adminRepsository;
    }
    async createAdmin() {
        try {
            const IsAdminExist = await this.adminRepsository.findOneBy({
                email: env_config_1.DotenvConfig.ADMIN_EMAIL,
            });
            if (IsAdminExist)
                throw HttpException_utils_1.default.conflict("Admin is already seeded");
            const hashedPassword = await bcrypt_service_1.default.hash(env_config_1.DotenvConfig.ADMIN_PASSWORD);
            const admin = this.adminRepsository.create({
                name: env_config_1.DotenvConfig.ADMIN_NAME,
                role: enum_1.Role.ADMIN,
                email: env_config_1.DotenvConfig.ADMIN_EMAIL,
                password: hashedPassword,
            });
            await this.adminRepsository.save(admin);
            return (0, message_1.createdMessage)("Admin");
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.internalServerError(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError("Unexpected Error Occured");
            }
        }
    }
}
(async () => {
    try {
        console.log("Connecting to the database...");
        await database_config_1.AppDataSource.initialize();
        const seedAdmin = new SeedAdmin();
        const result = await seedAdmin.createAdmin();
        console.log(result);
        console.log("Seeding completed successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
})();
