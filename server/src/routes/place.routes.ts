import { Router } from "express";
import { PlaceController } from "../controllers/place.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";
import upload from "../utils/fileUpload.utils";
const router = Router();
const placeController = new PlaceController();
router.use(authentication());
router.use(authorization([Role.ADMIN]));
router.post("/add", upload.array("image"), placeController.addPlaces);

export default router;
