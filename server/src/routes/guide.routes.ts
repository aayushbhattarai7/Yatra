import upload from "../utils/fileUpload.utils";
import { GuideController } from "../controllers/guide.controller";
import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";
const guideController = new GuideController();
const router: Router = Router();
router.post(
  "/signup",
  upload.fields([
    { name: "passPhoto", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "voterCard", maxCount: 1 },
  ]),
  guideController.create,
);
router.patch("/resend-otp", guideController.reSendOtp);
router.post("/verify", guideController.verifyUser);
router.post("/login", guideController.guideLogin);
router.use(authentication());
router.use(authorization([Role.GUIDE]));
router.post("/add-location", guideController.addLocation);
router.get("/get-requests", guideController.getRequests);
router.patch("/send-price", guideController.sendPrice);
router.patch("/accept-request/:id", guideController.acceptRequest);
export default router;
