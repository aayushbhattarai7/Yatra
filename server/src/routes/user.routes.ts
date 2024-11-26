import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { PlaceController } from "../controllers/place.controller";
const placeController = new PlaceController();
const userController = new UserController();
const router: Router = Router();
router.post("/signup", userController.create);
router.post("/login", userController.login);
router.use(authentication());
router.use(authorization([Role.USER]));
router.post(
  "/create-payment-intent/:id",
  userController.advancePaymentForTravel,
);
router.post("/get-place", placeController.getTrekkingPlaceByMessage);
router.get("/get-allPlaces", placeController.getPlaces);
router.post("/add-location", userController.addLocation);
router.get("/get-location", userController.getLocation);
router.get("/find-guide", userController.findGuide);
router.get("/find-travel", userController.findTravel);
router.post("/request-guide/:id", userController.requestGuide);
router.post("/request-travel/:id", userController.requestTravel);
router.get("/get-travel-requests", userController.getTravelrequest);
router.get("/get-guide-requests", userController.getGuiderequest);
router.patch("/send-travel-price/:id", userController.sendTravelPrice);
router.patch("/send-guide-price/:id", userController.sendGuidePrice);
router.patch("/accept-travel-request/:id", userController.acceptTravelRequest);
router.patch("/accept-guide-request/:id", userController.acceptGuideRequest);
router.get("/get-travel-location/:id", userController.getTravelLocation);
router.get("/get-guide-location/:id", userController.getGuideLocation);
export default router;
