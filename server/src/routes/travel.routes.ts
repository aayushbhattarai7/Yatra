import upload from "../utils/fileUpload.utils";
import { Router } from "express";
import { TravelController } from "../controllers/travel.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";
const travelController = new TravelController();
const router: Router = Router();
router.post(
  "/signup",
  upload.fields([
    { name: "passPhoto", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "vehicleRegistration", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "voterCard", maxCount: 1 },
  ]),
  travelController.create,
);
router.patch("/resend-otp", travelController.reSendOtp);
router.post("/verify", travelController.verifyUser);
router.post("/login", travelController.travelLogin);
router.post("refresh", travelController.verifyToken);
router.use(authentication());
router.use(authorization([Role.TRAVEL]));
router.get("/get-requests", travelController.getRequests);
router.patch("/send-price", travelController.sendPrice);
router.patch("/accept-request/:id", travelController.acceptRequest);
router.delete("/reject-request/:id", travelController.rejectRequest);
router.post("/add-location", travelController.addLocation);

export default router;
