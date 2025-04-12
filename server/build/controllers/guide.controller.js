"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideController = void 0;
const StatusCodes_1 = require("../constant/StatusCodes");
const guide_service_1 = __importDefault(require("../service/guide.service"));
const webToken_service_1 = __importDefault(
  require("../service/webToken.service"),
);
const enum_1 = require("../constant/enum");
const enum_2 = require("../constant/enum");
const guideService = new guide_service_1.default();
class GuideController {
  async create(req, res) {
    console.log("huiahjjhajbf", req.body);
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
        license: req.files?.license?.[0]
          ? {
              name: req.files.license[0].filename,
              mimetype: req.files.license[0].mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.LICENSE,
            }
          : null,
      };
      if (kycType === enum_2.KycType.CITIZENSHIP) {
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
      } else if (kycType === enum_2.KycType.PASSPORT) {
        const passport = req.files?.passport?.[0];
        uploadedPhotos.passport = passport
          ? {
              name: passport.filename,
              mimetype: passport.mimetype,
              type: req.body.type,
              fileType: enum_1.FileType.PASSPORT,
            }
          : null;
      } else if (kycType === enum_2.KycType.VOTERCARD) {
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
        res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
          message: "Invalid KYC type provided.",
        });
      }
      const details = await guideService.create(uploadedPhotos, req.body);
      res.status(StatusCodes_1.StatusCodes.CREATED).json({
        status: true,
        details,
        message: "Guide is registered successfully",
      });
    } catch (error) {
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
      const data = await guideService.reSendOtp(email);
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
      const data = await guideService.verifyUser(email, otp);
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
  async guideLogin(req, res) {
    try {
      const data = await guideService.loginGuide(req.body);
      const tokens = webToken_service_1.default.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      console.log(
        "🚀 ~ GuideController ~ guideLogin ~ tokens:",
        tokens,
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
  // async addLocation(req: Request, res: Response) {
  //   try {
  //     const guide_id = req.user?.id;
  //     const data = await guideService.addLocation(
  //       guide_id as string,
  //       req.body as LocationDTO,
  //     );
  //     res.status(StatusCodes.SUCCESS).json({ data });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       res.status(StatusCodes.BAD_REQUEST).json({
  //         message: error?.message,
  //       });
  //     }
  //   }
  // }
  async getRequests(req, res) {
    try {
      const guide_id = req.user?.id;
      const data = await guideService.getRequests(guide_id);
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
      const guide_id = req.user?.id;
      const { price, requestId } = req.body;
      const data = await guideService.sendPrice(price, guide_id, requestId);
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
      const data = await guideService.acceptRequest(travel_id, requestId);
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
}
exports.GuideController = GuideController;
