import { EmailService } from "../service/email.service";
import HttpException from "./HttpException.utils";

const mailService = new EmailService();
class Mail {
  constructor() {}

  async sendMail(
    email: string,
    status: "accepted" | "rejected",
    messages?: string,
  ) {
    try {
      if (email) {
        const subject = "Identity Verification Update";
        const message =
          status === "accepted"
            ? `Dear user,<br><br>Your identity verification has been <strong>accepted</strong>. You can now access all the features of our platform.`
            : `Dear user,<br><br>We regret to inform you that your identity verification has been <strong>rejected(${messages ? messages : ""})</strong>. Please ensure all information provided is accurate and try again.`;

        await mailService.sendMail({
          to: email,
          subject,
          text: "Identity Verification Update",
          html: `
            <div class="content">
              ${message}
              <br><br>
              If you have any questions, feel free to contact our support team.
            </div>
            <div class="footer">
              Best regards,<br>
              Yatra
            </div>`,
        });
      }

      return;
    } catch (error: any) {
      throw HttpException.badRequest(error.message);
    }
  }

  async sendAcceptedMail(email: string, messages?: string, firstname?: string) {
    try {
      if (email) {
        const subject = "Your Booking is Confirmed!";

        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 30px;">
              <h2 style="color: #2c3e50;">Dear ${firstname || "Traveler"},</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                Thank you for booking the <strong style="color: #2980b9;">${messages}</strong> with us!
                Your booking has been <strong style="color: green;">successfully accepted</strong>, and we're thrilled to be a part of your adventure.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                We wish you a wonderful and safe trip. Get ready to explore and create unforgettable memories!
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                If you have any questions or need support, feel free to reach out to our team at any time.
              </p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://yourwebsite.com" target="_blank" style="background-color: #27ae60; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                  Visit Your Dashboard
                </a>
              </div>
              <p style="margin-top: 40px; font-size: 14px; color: #999;">
                Safe travels,<br/>
                <strong>Yatra Team</strong>
              </p>
            </div>
          </div>
        `;

        await mailService.sendMail({
          to: email,
          subject,
          text: `Dear ${firstname || "Traveler"}, your booking for ${messages} is confirmed!`,
          html: htmlContent,
        });
      }

      return;
    } catch (error: any) {
      throw HttpException.badRequest(error.message);
    }
  }
}
export default new Mail();
