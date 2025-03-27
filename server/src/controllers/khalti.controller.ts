import { Request, Response } from "express";
import esewaService from "../service/esewa.service";
import { DotenvConfig } from "../config/env.config";
import khaltiService from "../service/khalti.service";

export class KhaltiController {
  async initializePayment(req: Request, res: Response) {
    try {
      const paymentDetails = await khaltiService.initializeKhaltiPayment(
        req.body as any,
      );
      res.json({ success: true, paymentDetails });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ success: false, error: err.message });
      }
    }
  }
  async verifyPayment(req: Request, res: Response) {
    try {
      const {
        pidx,
        txnId,
        amount,
        mobile,
        purchase_order_id,
        purchase_order_name,
        transaction_id,
      } = req.query;
      const paymentDetails = await khaltiService.verifyPayment(pidx);
      res.json({ success: true, paymentDetails });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ success: false, error: err.message });
      }
    }
  }
}
