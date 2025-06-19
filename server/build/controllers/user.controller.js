"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../service/user.service"));
const StatusCodes_1 = require("../constant/StatusCodes");
const chat_service_1 = require("../service/chat.service");
const chatService = new chat_service_1.ChatService();
class UserController {
  async create(req, res) {
    try {
      const profileImage = req.files?.profile?.[0];
      const coverImage = req.files?.cover?.[0];
      const image = {
        profile: profileImage
          ? {
              name: profileImage.filename,
              mimetype: profileImage.mimetype,
              path: profileImage.path,
            }
          : null,
        cover: coverImage
          ? {
              name: coverImage.filename,
              mimetype: coverImage.mimetype,
              path: coverImage.path,
            }
          : null,
      };
      console.log(req.body, "-body");
      const data = await user_service_1.default.signup(req.body, image);
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      if (error instanceof Error)
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
    }
  }
  async updateprofile(req, res) {
    const id = req.user?.id;
    console.log("🚀 ~ UserController ~ updateprofile ~ id:", id);
    try {
      const profileImage = req.files?.profile?.[0];
      const coverImage = req.files?.cover?.[0];
      const image = {
        profile: profileImage
          ? {
              name: profileImage.filename,
              mimetype: profileImage.mimetype,
              path: profileImage.path,
            }
          : null,
        cover: coverImage
          ? {
              name: coverImage.filename,
              mimetype: coverImage.mimetype,
              path: coverImage.path,
            }
          : null,
      };
      const data = await user_service_1.default.updateProfile(
        id,
        req.body,
        image,
      );
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      if (error instanceof Error)
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
    }
  }
  async paymentForTravelWithEsewa(req, res) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;
      const data =
        await user_service_1.default.advancePaymentForTravelWithEsewa(
          userId,
          requestId,
          token,
        );
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async chatWithTravel(req, res) {
    try {
      const userId = req.user?.id;
      const travelId = req.params.id;
      const { message } = req.body;
      const data = await chatService.chatWithTravel(userId, travelId, message);
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForGuideWithEsewa(req, res) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForGuideWithEsewa ~ requestId:",
        requestId,
      );
      const data = await user_service_1.default.advancePaymentForGuideWithEsewa(
        userId,
        requestId,
        token,
      );
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForTravelWithKhalti(req, res) {
    try {
      const userId = req.user?.id;
      const { pidx, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForTravelWithKhalti ~ requestId:",
        requestId,
      );
      const data =
        await user_service_1.default.advancePaymentForTravelWithKhalti(
          userId,
          requestId,
          pidx,
        );
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForGuideWithKhalti(req, res) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForGuideWithEsewa ~ requestId:",
        requestId,
      );
      const data = await user_service_1.default.advancePaymentForGuideWithEsewa(
        userId,
        requestId,
        token,
      );
      res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
}
exports.UserController = UserController;
