import { type Request, type Response } from "express";
import { StatusCodes } from "../constant/StatusCodes";
import { FileType, KycType } from "../constant/enum";
import HotelService from "../service/hotel.service";
import { HotelDTO } from "../dto/hotel.dto";
import webTokenService from "../service/webToken.service";
import { HotelRoomDTO } from "../dto/hotelRoom.dto";
const hotelService = new HotelService();
export class HotelController {
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

        panCard: req.files?.panCard?.[0]
          ? {
              name: req.files.panCard[0].filename,
              mimetype: req.files.panCard[0].mimetype,
              type: req.body.type,
              fileType: FileType.HOTELPANCARD,
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
      console.log(uploadedPhotos);
      const details = await hotelService.create(
        uploadedPhotos as any,
        req.body as HotelDTO,
      );

      res.status(StatusCodes.CREATED).json({
        status: true,
        details,
        message: "Hotel is registered successfully",
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
      const data = await hotelService.reSendOtp(email);
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
      const data = await hotelService.verifyUser(email, otp);
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

  async login(req: Request, res: Response) {
    try {
      const data = await hotelService.login(req.body as HotelDTO);
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          firstName: data?.hotelName,
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

  async addHotelRoom(req: Request, res: Response) {
    try {
      const hotel_id = req.user?.id;
      const data = await hotelService.addHotelRoom(
        hotel_id as string,
        req.body as HotelRoomDTO,
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
}
