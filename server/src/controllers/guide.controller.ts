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
    console.log("huiahjjhajbf", req.body);
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
        res.status(StatusCodes.BAD_REQUEST).json({
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

  async reportUser(req: Request, res: Response) {
        try {
          const guideId = req.user?.id as string;
          const userId = req.params.id;
          const {message} = req.body
          const data = req.files?.map((file: any) => {
            return {
              name: file?.filename,
              mimetype: file?.mimetype,
              type: req.body?.type,
            }
          })
          const details = await guideService.reportUser(
            guideId,
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
