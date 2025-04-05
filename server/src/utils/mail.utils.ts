import { EmailService } from "../service/email.service";
import HttpException from "./HttpException.utils";

const mailService = new EmailService();
class Mail {
  constructor(
  ) {}



  async sendMail(email: string, status: 'accepted' | 'rejected', messages?:string) {
    try {
      if (email) { 
        const subject = 'Identity Verification Update';
        const message =
          status === 'accepted'
            ? `Dear user,<br><br>Your identity verification has been <strong>accepted</strong>. You can now access all the features of our platform.`
            : `Dear user,<br><br>We regret to inform you that your identity verification has been <strong>rejected(${messages?messages:''})</strong>. Please ensure all information provided is accurate and try again.`;
  
        await mailService.sendMail({
          to: email,
          subject,
          text: 'Identity Verification Update',
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
  

 
}
export default new Mail();
