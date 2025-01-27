import { type Request, type Response } from "express";
import { StatusCodes } from "../constant/StatusCodes";
import { GuideDTO } from "../dto/guide.dto";
import GuideService from "../service/guide.service";
import webTokenService from "../service/webToken.service";
import { LocationDTO } from "../dto/location.dto";
import { FileType } from "../constant/enum";
import { KycType } from "../constant/enum";
const guideService = new GuideService();
export class GuideController {
  async create(req: Request, res: Response) {
    try {
      const { kycType } = req.body;
      const uploadedPhotos: any = {
        passPhoto: req.files?.passPhoto?.[0]
          ? {
              name: req.files.passPhoto[0].filename,
              mimetype: req.files.passPhoto[0].mimetype,
              type: req.body.type,
              fileType: FileType.PASSPHOTO,
            }
          : null,

        license: req.files?.license?.[0]
          ? {
              name: req.files.license[0].filename,
              mimetype: req.files.license[0].mimetype,
              type: req.body.type,
              fileType: FileType.LICENSE,
            }
          : null,
      };

      if (kycType === KycType.CITIZENSHIP) {
        const citizenshipFront = req.files?.citizenshipFront?.[0];
        const citizenshipBack = req.files?.citizenshipBack?.[0];

        uploadedPhotos.citizenshipFront = citizenshipFront
          ? {
              name: citizenshipFront.filename,
              mimetype: citizenshipFront.mimetype,
              type: req.body.type,
              fileType: FileType.CITIZENSHIPFRONT,
            }
          : null;

        uploadedPhotos.citizenshipBack = citizenshipBack
          ? {
              name: citizenshipBack.filename,
              mimetype: citizenshipBack.mimetype,
              type: req.body.type,
              fileType: FileType.CITIZENSHIPBACK,
            }
          : null;
      } else if (kycType === KycType.PASSPORT) {
        const passport = req.files?.passport?.[0];

        uploadedPhotos.passport = passport
          ? {
              name: passport.filename,
              mimetype: passport.mimetype,
              type: req.body.type,
              fileType: FileType.PASSPORT,
            }
          : null;
      } else if (kycType === KycType.VOTERCARD) {
        const voterCard = req.files?.voterCard?.[0];

        uploadedPhotos.voterCard = voterCard
          ? {
              name: voterCard.filename,
              mimetype: voterCard.mimetype,
              type: req.body.type,
              fileType: FileType.VOTERCARD,
            }
          : null;
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid KYC type provided.",
        });
      }
      const details = await guideService.create(
        uploadedPhotos as any,
        req.body as GuideDTO,
      );
      res.status(StatusCodes.CREATED).json({
        status: true,
        details,
        message: "Guide is registered successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async reSendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const data = await guideService.reSendOtp(email);
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const { otp } = req.body;
      const data = await guideService.verifyUser(email, otp);
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async guideLogin(req: Request, res: Response) {
    try {
      const data = await guideService.loginGuide(req.body as GuideDTO);
      const tokens = webTokenService.generateTokens(
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
      res.status(StatusCodes.SUCCESS).json({
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async addLocation(req: Request, res: Response) {
    try {
      const guide_id = req.user?.id;
      const data = await guideService.addLocation(
        guide_id as string,
        req.body as LocationDTO,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async getRequests(req: Request, res: Response) {
    try {
      const guide_id = req.user?.id;
      const data = await guideService.getRequests(guide_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async sendPrice(req: Request, res: Response) {
    try {
      const guide_id = req.user?.id as string;
      const { price, requestId } = req.body;
      const data = await guideService.sendPrice(price, guide_id, requestId);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async acceptRequest(req: Request, res: Response) {
    try {
      const travel_id = req.user?.id;
      const requestId = req.params.id;
      const data = await guideService.acceptRequest(
        travel_id as string,
        requestId,
      );
      res
        .status(StatusCodes.SUCCESS)
        .json({ data, message: "Request accepted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
}
