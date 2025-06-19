import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { Role } from "../constant/enum";
import { PlaceController } from "../controllers/place.controller";
import upload from "../utils/fileUpload.utils";
const placeController = new PlaceController();
const userController = new UserController();
const router: Router = Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  userController.create,
);
router.use(authentication());
router.use(authorization([Role.USER]));
router.patch(
  "/update-profile",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  userController.updateprofile,
);
router.post("/get-place", placeController.getTrekkingPlaceByMessage);
router.get("/get-allPlaces", placeController.getPlaces);
router.post("/travel-esewa", userController.paymentForTravelWithEsewa);
router.post("/guide-esewa", userController.paymentForGuideWithEsewa);
router.post("/travel-khalti", userController.paymentForTravelWithKhalti);
router.post("/guide-khalti", userController.paymentForGuideWithKhalti);
router.post('/report-travel/:id', upload.array('files'), userController.reportTravel)
router.post('/report-guide/:id', upload.array('files'), userController.reportGuide)

export default router;
