"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../middleware/authentication");
const admin_controller_1 = require("../controllers/admin.controller");
const express_1 = require("express");
const authorization_1 = require("../middleware/authorization");
const enum_1 = require("../constant/enum");
const fileUpload_utils_1 = __importDefault(
  require("../utils/fileUpload.utils"),
);
const adminController = new admin_controller_1.AdminController();
const router = (0, express_1.Router)();
router.use((0, authentication_1.authentication)());
router.use((0, authorization_1.authorization)([enum_1.Role.ADMIN]));
router.post(
  "/add",
  fileUpload_utils_1.default.array("image"),
  adminController.addPlaces,
);
exports.default = router;
