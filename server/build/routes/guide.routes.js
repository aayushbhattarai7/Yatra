"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileUpload_utils_1 = __importDefault(require("../utils/fileUpload.utils"));
const guide_controller_1 = require("../controllers/guide.controller");
const express_1 = require("express");
const authentication_1 = require("../middleware/authentication");
const authorization_1 = require("../middleware/authorization");
const enum_1 = require("../constant/enum");
const guideController = new guide_controller_1.GuideController();
const router = (0, express_1.Router)();
router.post("/signup", fileUpload_utils_1.default.fields([
    { name: "passPhoto", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "voterCard", maxCount: 1 },
]), guideController.create);
router.patch("/resend-otp", guideController.reSendOtp);
router.post("/verify", guideController.verifyUser);
router.post("/login", guideController.guideLogin);
router.use((0, authentication_1.authentication)());
router.use((0, authorization_1.authorization)([enum_1.Role.GUIDE]));
// router.post("/add-location", guideController.addLocation);
router.get("/get-requests", guideController.getRequests);
router.patch("/send-price", guideController.sendPrice);
router.patch("/accept-request/:id", guideController.acceptRequest);
exports.default = router;
