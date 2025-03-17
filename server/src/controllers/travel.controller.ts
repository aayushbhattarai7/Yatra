import { type Request, type Response } from "express";
import { StatusCodes } from "../constant/StatusCodes";
import { TravelDTO } from "../dto/travel.dto";
import webTokenService from "../service/webToken.service";
import travelService from "../service/travel.service";
import { FileType, KycType } from "../constant/enum";
import { DotenvConfig } from "../config/env.config";
import HttpException from "../utils/HttpException.utils";
import { LocationDTO } from "../dto/location.dto";
export class TravelController {
  async create(req: Request, res: Response) {
    try {
      
      const { kycType } = req.body;
      console.log("🚀 ~ TravelController ~ create ~ kycType:", kycType)

      const uploadedPhotos: any = {
        passPhoto: req.files?.passPhoto?.[0]
          ? {
              name: req.files.passPhoto[0].filename,
              mimetype: req.files.passPhoto[0].mimetype,
              type: req.body.type,
              fileType: FileType.PASSPHOTO,
            }
          : null,

        vehicleRegistration: req.files?.vehicleRegistration?.[0]
          ? {
              name: req.files.vehicleRegistration[0].filename,
              mimetype: req.files.vehicleRegistration[0].mimetype,
              type: req.body.type,
              fileType: FileType.VEHICLEREGISTRATION,
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
        console.log("errroooooooooooooooooood");
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid KYC type provided.",
        });
        return;
      }
      const details = await travelService.create(
        uploadedPhotos as any,
        req.body as TravelDTO,
      );

      res.status(StatusCodes.CREATED).json({
        details,
      });
    } catch (error: unknown) {
console.log(error,"haha")
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
      const data = await travelService.reSendOtp(email);
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
      console.log(req.body);
      const data = await travelService.verifyUser(email, otp);
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

  async travelLogin(req: Request, res: Response) {
    try {
      const data = await travelService.loginTravel(req.body as TravelDTO);
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
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

  async verifyToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const token = await webTokenService.verify(
        refreshToken,
        DotenvConfig.ACCESS_TOKEN_SECRET,
      );
      if (!token) {
        throw HttpException.unauthorized("You are not authorized");
      }
      const newAccessToken = webTokenService.generateAccessToken(
        token,
        token.role,
      );
      res.json({ accessToken: newAccessToken });
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
      const travel_id = req.user?.id;
      console.log(travel_id, "travel");
      const data = await travelService.getRequests(travel_id as string);
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
      const travel_id = req.user?.id as string;
      const { price, requestId } = req.body;
      const data = await travelService.sendPrice(price, travel_id, requestId);
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
      const data = await travelService.acceptRequest(
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

  async rejectRequest(req: Request, res: Response) {
    try {
      const travel_id = req.user?.id;
      const requestId = req.params.id;
      await travelService.rejectRequest(travel_id as string, requestId);
      res.status(StatusCodes.SUCCESS).json({ message: "Request rejected" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async addLocation(req: Request, res: Response) {
    try {
      const travel_id = req.user?.id;
      const data = await travelService.addLocation(
        travel_id as string,
        req.body as LocationDTO,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }
}
