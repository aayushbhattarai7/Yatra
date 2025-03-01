import { Router } from "express";
import { EsewaController } from "../controllers/esewa.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";

const router = Router();
const esewaController = new EsewaController();
router.use(authentication());
router.use(authorization([Role.USER]));
router.post("/initialize-esewa", esewaController.initializePayment);
router.post("/complete-payment", esewaController.completePayment);

export default router;
