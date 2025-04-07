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
          subject: "Otp Verification",
          text: "Otp Verification",
          html: `
            <div class="header">Your OTP Code</div>
            <div class="content">
                Hi there,
                <br><br>
                <div class="otp"IMai>${otp}</div>
                <br>
                Please enter this code on the page. This OTP is valid for the next 10 minutes.
                <br><br>
                If you did not request this OTP, please disregard this email.
            </div>
            <div class="footer">
                Best regards,<br>
                Yatra
            </div>`,
        });
      }

      return { otp, expires };
    } catch (error: any) {
      throw HttpException.badRequest(error.message);
    }
  }

  verifyOtp(hashedOtp: string, data: any) {
    console.log("🚀 ~ OtpService ~ verifyOtp ~ data:", data)
    const hash = hashService.hashOtp(data);
    return hash === hashedOtp;
  }
}
export default OtpService;
