import { Router } from "express";
import { EsewaController } from "../controllers/esewa.controller";

const router = Router();
const esewaController = new EsewaController();

router.post("/initialize-esewa", esewaController.initializePayment);
router.post("/complete-payment", esewaController.completePayment);

export default router;
