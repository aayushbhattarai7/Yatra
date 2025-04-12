"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fileUpload_utils_1 = __importDefault(
  require("../utils/fileUpload.utils"),
);
const express_1 = require("express");
const travel_controller_1 = require("../controllers/travel.controller");
const authentication_1 = require("../middleware/authentication");
const authorization_1 = require("../middleware/authorization");
const enum_1 = require("../constant/enum");
const travelController = new travel_controller_1.TravelController();
const router = (0, express_1.Router)();
router.post(
  "/signup",
  fileUpload_utils_1.default.fields([
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
router.use((0, authentication_1.authentication)());
router.use((0, authorization_1.authorization)([enum_1.Role.TRAVEL]));
router.get("/get-requests", travelController.getRequests);
router.patch("/send-price", travelController.sendPrice);
router.patch("/accept-request/:id", travelController.acceptRequest);
router.delete("/reject-request/:id", travelController.rejectRequest);
router.post("/add-location", travelController.addLocation);
exports.default = router;
