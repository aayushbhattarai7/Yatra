import { Router } from "express";
import { KhaltiController } from "../controllers/khalti.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";

const router = Router();
const khaltiController = new KhaltiController();
router.use(authentication());
router.use(authorization([Role.USER]));
router.post("/initialize-esewa", khaltiController.initializePayment);

export default router;
