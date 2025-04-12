"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const hash_service_1 = require("../service/hash.service");
const email_service_1 = require("../service/email.service");
const HttpException_utils_1 = __importDefault(require("./HttpException.utils"));
const database_config_1 = require("../config/database.config");
const guide_entity_1 = require("../entities/guide/guide.entity");
const hashService = new hash_service_1.HashService();
const mailService = new email_service_1.EmailService();
class OtpService {
  guideRepo;
  constructor(
    guideRepo = database_config_1.AppDataSource.getRepository(
      guide_entity_1.Guide,
    ),
  ) {
    this.guideRepo = guideRepo;
  }
  async generateOTP() {
    return crypto_1.default.randomInt(10000, 99999);
  }
  async sendOtp(email, otp, expires) {
    try {
      if (email) {
        await mailService.sendMail({
          to: email,
          subject: "OTP Verification",
          text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f7fa; padding: 40px;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 30px;">
                <h2 style="color: #2c3e50; text-align: center;">Your OTP Code</h2>
                <p style="font-size: 16px; color: #333;">Hi there,</p>
                <p style="font-size: 16px; color: #333; line-height: 1.5;">
                  Please use the following One-Time Password (OTP) to verify your email address:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 28px; font-weight: bold; color: #1abc9c; background: #ecf9f6; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                    ${otp}
                  </span>
                </div>
                <p style="font-size: 16px; color: #555;">
                  This OTP is valid for the next <strong>10 minutes</strong>.
                </p>
                <p style="font-size: 16px; color: #999;">
                  If you did not request this OTP, please ignore this email.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 14px; color: #999;">
                  Best regards,<br>
                  <strong>Yatra Team</strong>
                </p>
              </div>
            </div>
          `,
        });
      }
      return { otp, expires };
    } catch (error) {
      throw HttpException_utils_1.default.badRequest(error.message);
    }
  }
  verifyOtp(hashedOtp, data) {
    console.log("🚀 ~ OtpService ~ verifyOtp ~ data:", data);
    const hash = hashService.hashOtp(data);
    return hash === hashedOtp;
  }
}
exports.default = OtpService;
