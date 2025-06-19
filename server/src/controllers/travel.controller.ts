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
      console.log(error, "haha");
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

      async updateprofile(req: Request, res: Response) {
        const id = req.user?.id as string;
        console.log("🚀 ~ guide ~ updateprofile ~ id:", id);
        try {
          const profileImage = req.files?.profile?.[0];
          const image = {
            profile: profileImage
              ? {
                  name: profileImage.filename,
                  mimetype: profileImage.mimetype,
                  path: profileImage.path,
                }
              : null,
          };
          const data = await travelService.updateProfile(
            id,
            req.body as TravelDTO,
            image.profile as any,
          );
          res.status(StatusCodes.SUCCESS).json({ data });
        } catch (error: unknown) {
          if (error instanceof Error)
            res.status(StatusCodes.BAD_REQUEST).json({
              message: error?.message,
            });
        }
      }


   async reportUser(req: Request, res: Response) {
        try {
          const travelId = req.user?.id as string;
          console.log("🚀 ~ UserController ~ reportTravel ~ userId:", req.files)
          const userId = req.params.id;
          const {message} = req.body
          const data = req.files?.map((file: any) => {
            return {
              name: file?.filename,
              mimetype: file?.mimetype,
              type: req.body?.type,
            }
          })
          const details = await travelService.reportUser(
            travelId,
            userId,
            message,
            data as any,
          
          );
          res.status(StatusCodes.CREATED).json({
            details,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            res.status(StatusCodes.BAD_REQUEST).json({
              message: error?.message,
            });
          }
        }
      }
}
