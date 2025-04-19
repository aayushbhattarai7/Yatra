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

router.use(authentication());
router.use(authorization([Role.GUIDE]));
router.post('/report-user/:id', upload.array('files'), guideController.reportUser)

export default router;
