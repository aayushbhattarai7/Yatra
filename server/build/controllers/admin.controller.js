"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const place_service_1 = __importDefault(require("../service/place.service"));
const StatusCodes_1 = require("../constant/StatusCodes");
class AdminController {
  async addPlaces(req, res) {
    console.log(req.body, "ha");
    try {
      const admin_id = req.user?.id;
      const data = req.files?.map((file) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        };
      });
      console.log("🚀 ~ AdminController ~ data ~ data:", data);
      const trekkingPlace = await place_service_1.default.addTrekkingPlace(
        admin_id,
        req.body,
        data,
      );
      console.log("yessss");
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ trekkingPlace });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to add place");
      }
    }
  }
}
exports.AdminController = AdminController;
