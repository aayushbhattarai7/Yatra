import { Arg, Args, Ctx, Mutation, Query, UseMiddleware } from "type-graphql";
import { Guide } from "../../entities/guide/guide.entity";
import GuideService from "../../service/guide.service";
import { GuideDTO } from "../../dto/guide.dto";
import { Context } from "../../types/context";
import { FileType, KycType, Role } from "../../constant/enum";
import HttpException from "../../utils/HttpException.utils";
import { GuideResponse, LoginResponse } from "../../graphql/schema/schema";
import webTokenService from "../../service/webToken.service";
import { Message } from "../../constant/message";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { GuideDetails } from "../../entities/guide/guideDetails.entity";

export class GuideResolver {
  private guideService = new GuideService();
  @Mutation(() => Guide)
  async guideSignup(
    @Arg("data") data: GuideDTO,
    @Ctx() req: Context,
  ): Promise<Guide> {
    try {
      const kycType = data.kycType;
      const files = req.files;
      console.log("🚀 ~ GuideResolver ~ guideSignup ~ files:", files);
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
        throw HttpException.badRequest("Invalid file format");
      }
      const details = await this.guideService.create(
        uploadedPhotos as any,
        data,
      );
      return details;
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  @Mutation(() => LoginResponse)
  async guideLogin(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ) {
    try {
      const data = { email, password };
      const user = await this.guideService.loginGuide(data);
      console.log("🚀 ~ UserResolver ~ login ~ user:", user);
      const tokens = webTokenService.generateTokens({ id: user.id }, user.role);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,

        phoneNumber: user.phoneNumber,
        gender: user.gender,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: "Logged in successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred during login",
      );
    }
  }

  @Query(() => [RequestGuide])
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getRequestsByGuide(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.guideService.getRequests(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => Guide, { nullable: true })
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getGuideDetails(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.guideService.getGuideDetails(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => [RequestGuide])
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getRequestHistoryOfGuide(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.guideService.getHistory(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async rejectRequestByGuide(
    @Arg("requestId") requestId: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      console.log("🚀 ~ UserResolver ~ getOwnTravelRequest ~ userId:", userId);
      return await this.guideService.rejectRequest(userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async sendPriceByGuide(
    @Arg("requestId") requestId: string,
    @Arg("price") price: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.guideService.sendPrice(price, userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

   @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async addLocationOfGuide(
    @Arg("latitude") latitude: number,
    @Arg("longitude") longitude: number,
    @Ctx() ctx: Context,
  ) {
    try {
      const data = {latitude, longitude}
      const travelId = ctx.req.user?.id!;
      return await this.guideService.addLocation(travelId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
