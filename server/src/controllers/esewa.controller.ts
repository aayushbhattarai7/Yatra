import { Request, Response } from "express";
import { EsewaService } from "../service/esewa.service";
import { DotenvConfig } from "../config/env.config";

const esewaService = new EsewaService();

export class EsewaController {
  async initializePayment(req: Request, res: Response) {
    try {
      const { productId, amount } = req.body;
      console.log(
        "🚀 ~ EsewaController ~ initializePayment ~ productId:",
        DotenvConfig.ESEWA_PRODUCT_CODE,
        DotenvConfig.ESEWA_SECRET_KEY,
      );
      console.log("🚀 ~ EsewaController ~ initializePayment ~ amount:", amount);

      const paymentDetails = await esewaService.initializePayment(
        amount,
        productId,
      );
      console.log("🚀 ~ EsewaController ~ initializePayment ~ paymentDetails:", paymentDetails)

      res.json({ success: true, paymentDetails });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async completePayment(req: Request, res: Response) {
    try {
      const { token } = req.body;
      console.log("🚀 ~ EsewaController ~ completePayment ~ data:", token);
      const paymentInfo = await esewaService.verifyPayment(token as string);

      res.json({ success: true, message: "Payment successful", paymentInfo });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
