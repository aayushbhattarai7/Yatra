import { authentication } from "../middleware/authentication";
import { AdminController } from "../controllers/admin.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";
import upload from "../utils/fileUpload.utils";
const adminController = new AdminController();
const router: Router = Router();
router.use(authentication());
router.use(authorization([Role.ADMIN]));

router.post("/add", upload.array("image"), adminController.addPlaces);
export default router;
