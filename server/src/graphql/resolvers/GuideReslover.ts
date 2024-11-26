import { Arg, Ctx, Mutation } from "type-graphql";
import { Guide } from "../../entities/guide/guide.entity";
import GuideService from "../../service/guide.service";
import { GuideDTO } from "../../dto/guide.dto";
import { Context } from "../../types/context";
import { FileType, KycType } from "../../constant/enum";
import HttpException from "../../utils/HttpException.utils";



export class GuideResolver {
    private guideService = new GuideService()
    @Mutation(() => Guide)
    async guideSignup(@Arg("data") data: GuideDTO, @Ctx() req:Context): Promise<Guide> {
        const images: any = []
        const kycType = data.kycType
     const files = req.files
            console.log("🚀 ~ GuideResolver ~ guideSignup ~ files:", files)
          const uploadedPhotos: Record<string, any> = {};
      if (kycType === KycType.CITIZENSHIP) {
        const citizenshipFront = files?.citizenshipFront?.[0];
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
        throw HttpException.badRequest("Invalid file format")
      }
      const details = await this.guideService.create(
        uploadedPhotos as any,
        data,
      );
        return details
    }
}