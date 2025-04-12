"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../config/env.config");
class EmailService {
  transporter;
  from;
  constructor() {
    this.from = env_config_1.DotenvConfig.MAIL_FROM;
    this.transporter = nodemailer_1.default.createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: env_config_1.DotenvConfig.MAIL_USERNAME,
        pass: env_config_1.DotenvConfig.MAIL_PASSWORD,
      },
    });
  }
  async sendMail({ to, html, subject, text }) {
    const mailOptions = {
      from: this.from,
      text,
      to,
      html,
      subject,
    };
    const send = await this.transporter.sendMail(mailOptions);
    return send;
  }
}
exports.EmailService = EmailService;
