"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelController = void 0;
const StatusCodes_1 = require("../constant/StatusCodes");
const webToken_service_1 = __importDefault(
  require("../service/webToken.service"),
);
const travel_service_1 = __importDefault(require("../service/travel.service"));
const enum_1 = require("../constant/enum");
const env_config_1 = require("../config/env.config");
const HttpException_utils_1 = __importDefault(
  require("../utils/HttpException.utils"),
);
class TravelController {
  async create(req, res) {
    try {
      const { kycType } = req.body;
      const uploadedPhotos = {
        passPhoto: req.files?.passPhoto?.[0]
          ? {
              name: req.files.passPhoto[0].filename,
              mimetype: req.files.passPhoto[0].mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.PASSPHOTO,
            }
          : null,
        vehicleRegistration: req.files?.vehicleRegistration?.[0]
          ? {
              name: req.files.vehicleRegistration[0].filename,
              mimetype: req.files.vehicleRegistration[0].mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.VEHICLEREGISTRATION,
            }
          : null,
      };
      if (kycType === enum_1.KycType.CITIZENSHIP) {
        const citizenshipFront = req.files?.citizenshipFront?.[0];
        const citizenshipBack = req.files?.citizenshipBack?.[0];
        uploadedPhotos.citizenshipFront = citizenshipFront
          ? {
              name: citizenshipFront.filename,
              mimetype: citizenshipFront.mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.CITIZENSHIPFRONT,
            }
          : null;
        uploadedPhotos.citizenshipBack = citizenshipBack
          ? {
              name: citizenshipBack.filename,
              mimetype: citizenshipBack.mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.CITIZENSHIPBACK,
            }
          : null;
      } else if (kycType === enum_1.KycType.PASSPORT) {
        const passport = req.files?.passport?.[0];
        uploadedPhotos.passport = passport
          ? {
              name: passport.filename,
              mimetype: passport.mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.PASSPORT,
            }
          : null;
      } else if (kycType === enum_1.KycType.VOTERCARD) {
        const voterCard = req.files?.voterCard?.[0];
        uploadedPhotos.voterCard = voterCard
          ? {
              name: voterCard.filename,
              mimetype: voterCard.mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.VOTERCARD,
            }
          : null;
      } else {
        console.log("errroooooooooooooooooood");
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: "Invalid KYC type provided.",
        });
        return;
      }
      const details = await travel_service_1.default.create(
        uploadedPhotos,
        req.body,
      );
      res.status(StatusCodes_1.StatusCodes.CREATED).json({
        details,
      });
    } catch (error) {
      console.log(error, "haha");
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async reSendOtp(req, res) {
    try {
      const { email } = req.body;
      const data = await travel_service_1.default.reSendOtp(email);
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
        status: true,
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async verifyUser(req, res) {
    try {
      const { email } = req.body;
      const { otp } = req.body;
      console.log(req.body);
      const data = await travel_service_1.default.verifyUser(email, otp);
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
        status: true,
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async travelLogin(req, res) {
    try {
      const data = await travel_service_1.default.loginTravel(req.body);
      const tokens = webToken_service_1.default.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phoneNumber: data.phoneNumber,
          verified: data.verified,
          approved: data.approved,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          message: "Loggedin successfully",
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async verifyToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const token = await webToken_service_1.default.verify(
        refreshToken,
        env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET,
      );
      if (!token) {
        throw HttpException_utils_1.default.unauthorized(
          "You are not authorized",
        );
      }
      const newAccessToken = webToken_service_1.default.generateAccessToken(
        token,
        token.role,
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async getRequests(req, res) {
    try {
      const travel_id = req.user?.id;
      console.log(travel_id, "travel");
      const data = await travel_service_1.default.getRequests(travel_id);
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async sendPrice(req, res) {
    try {
      const travel_id = req.user?.id;
      const { price, requestId } = req.body;
      const data = await travel_service_1.default.sendPrice(
        price,
        travel_id,
        requestId,
      );
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async acceptRequest(req, res) {
    try {
      const travel_id = req.user?.id;
      const requestId = req.params.id;
      const data = await travel_service_1.default.acceptRequest(
        travel_id,
        requestId,
      );
      res
        .status(StatusCodes_1.StatusCodes.SUCCESS)
        .json({ data, message: "Request accepted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async rejectRequest(req, res) {
    try {
      const travel_id = req.user?.id;
      const requestId = req.params.id;
      await travel_service_1.default.rejectRequest(travel_id, requestId);
      res
        .status(StatusCodes_1.StatusCodes.SUCCESS)
        .json({ message: "Request rejected" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async addLocation(req, res) {
    try {
      const travel_id = req.user?.id;
      const data = await travel_service_1.default.addLocation(
        travel_id,
        req.body,
      );
      res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        res
          .status(StatusCodes_1.StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }
}
exports.TravelController = TravelController;
