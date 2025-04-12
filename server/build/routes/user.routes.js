"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const express_1 = require("express");
const authentication_1 = require("../middleware/authentication");
const authorization_1 = require("../middleware/authorization");
const enum_1 = require("../constant/enum");
const place_controller_1 = require("../controllers/place.controller");
const fileUpload_utils_1 = __importDefault(require("../utils/fileUpload.utils"));
const placeController = new place_controller_1.PlaceController();
const userController = new user_controller_1.UserController();
const router = (0, express_1.Router)();
router.post("/signup", fileUpload_utils_1.default.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 }
]), userController.create);
router.use((0, authentication_1.authentication)());
router.use((0, authorization_1.authorization)([enum_1.Role.USER]));
router.patch("/update-profile", fileUpload_utils_1.default.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 }
]), userController.updateprofile);
router.post("/get-place", placeController.getTrekkingPlaceByMessage);
router.get("/get-allPlaces", placeController.getPlaces);
router.post("/travel-esewa", userController.paymentForTravelWithEsewa);
router.post("/guide-esewa", userController.paymentForGuideWithEsewa);
router.post("/travel-khalti", userController.paymentForTravelWithKhalti);
router.post("/guide-khalti", userController.paymentForGuideWithEsewa);
router.post("/chat-travel", userController.chatWithTravel);
exports.default = router;
