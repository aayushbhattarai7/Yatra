import crypto from "crypto";
import { HashService } from "../service/hash.service";
import { EmailService } from "../service/email.service";
import HttpException from "./HttpException.utils";
import { AppDataSource } from "../config/database.config";
import { Guide } from "../entities/guide/guide.entity";
const hashService = new HashService();
const mailService = new EmailService();
class OtpService {
  constructor(
    private readonly guideRepo = AppDataSource.getRepository(Guide),
  ) {}

  async generateOTP() {
    return crypto.randomInt(10000, 99999);
  }

  async sendOtp(email: string, otp: number, expires: number) {
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
    } catch (error: any) {
      throw HttpException.badRequest(error.message);
    }
  }

  verifyOtp(hashedOtp: string, data: any) {
    console.log("🚀 ~ OtpService ~ verifyOtp ~ data:", data);
    const hash = hashService.hashOtp(data);
    return hash === hashedOtp;
  }
}
export default OtpService;
