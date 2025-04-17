import { Arg, Args, Ctx, Mutation, Query, UseMiddleware } from "type-graphql";
import { Guide } from "../../entities/guide/guide.entity";
import GuideService from "../../service/guide.service";
import { GuideDTO } from "../../dto/guide.dto";
import { Context } from "../../types/context";
import { FileType, KycType, Role } from "../../constant/enum";
import HttpException from "../../utils/HttpException.utils";
import { LoginResponse } from "../../graphql/schema/schema";
import webTokenService from "../../service/webToken.service";
import { Message } from "../../constant/message";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { Chat } from "../../entities/chat/chat.entity";
import { ChatService } from "../../service/chat.service";
import { Room } from "../../entities/chat/room.entity";
import { RoomService } from "../../service/room.service";
import { Notification } from "../../entities/notification/notification.entity";
import { TrekkingPlace } from "../../entities/place/trekkingplace.entity";
import placeService from "../../service/place.service";
import { RevenueGroupedResponse } from "../../graphql/schema/RevenueSchems";
import { GuideProfileDTO } from "../../dto/guideProfile.dto";
const roomService = new RoomService();
const chatService = new ChatService();
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

  @Query(() => [TrekkingPlace])
  async getPlacesByProviders(@Ctx() ctx: Context) {
    try {
      return await placeService.getPlaces();
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
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
      const data = { latitude, longitude };
      const guideId = ctx.req.user?.id!;
      return await this.guideService.addLocation(guideId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [Notification])
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getAllNotificationsOfGuide(@Ctx() ctx: Context) {
    try {
      const guideId = ctx.req.user?.id!;
      return await this.guideService.getAllNotifications(guideId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => Number)
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getUnreadNotificationsOfGuide(@Ctx() ctx: Context) {
    try {
      const guideId = ctx.req.user?.id!;
      return await this.guideService.getUnreadNotificationsCount(guideId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [Chat])
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getChatOfUserByGuide(
    @Ctx() ctx: Context,
    @Arg("userId") userId: string,
  ) {
    try {
      const guideId = ctx.req.user?.id!;
      return await chatService.getChatByGuideOfUser(guideId, userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [Room])
  @UseMiddleware(authentication, authorization([Role.GUIDE]))
  async getChatUserByGuide(@Ctx() ctx: Context) {
    try {
      const guideId = ctx.req.user?.id!;
      console.log(guideId, "idd0----");
      return await roomService.getUserOfChatByGuide(guideId);
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
  async requestForCompletedGuide(
    @Arg("userId") userId: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const guideId = ctx.req.user?.id!;
      return await this.guideService.completeGuideService(guideId, userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }


    @Query(() => Number)
    @UseMiddleware(authentication, authorization([Role.GUIDE]))
    async getChatCountOfGuide(@Ctx() ctx: Context) {
      try {
        const userId = ctx.req.user?.id!;
        console.log("🚀 ~ GuideResolver ~ getChatCountOfGuide ~ userId:", userId)
        return await this.guideService.getUnreadChatCount(userId);
      } catch (error) {
        if (error instanceof Error) {
          throw HttpException.badRequest(error.message);
        } else {
          throw HttpException.internalServerError;
        }
      }
    }

    @Query(() => Number)
    @UseMiddleware(authentication, authorization([Role.GUIDE]))
    async getChatCountOfUserByGuide(@Ctx() ctx: Context, @Arg("id") id: string) {
      try {
        const userId = ctx.req.user?.id!;
        return await chatService.getUnreadChatByGuide(userId, id);
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
async updateGuideProfile(
  @Ctx() ctx: Context,
  @Arg("data") data: GuideProfileDTO
): Promise<string> {
  try {
    const guideId = ctx.req.user?.id!;
    return await this.guideService.updateProfile(guideId, data);
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
async changeEmailOfGuide(@Arg("email") email: string, @Ctx() ctx: Context) {
  try {
    const userId = ctx.req.user?.id as string;

    return await this.guideService.sendOtpToChangeEmail(userId, email);
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
async verifyEmailWhileChangeOfGuide(
  @Arg("email") email: string,
  @Arg("otp") otp: string,
  @Ctx() ctx: Context,
) {
  try {
    const userId = ctx.req.user?.id as string;
    return await this.guideService.verifyEmail(userId, email, otp);
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
    async getTotalBookedUsersByGuide(@Ctx() ctx: Context) {
      try {
        const userId = ctx.req.user?.id!;
        return await this.guideService.getTotalbookedUsers(userId);
      } catch (error) {
        if (error instanceof Error) {
          throw HttpException.badRequest(error.message);
        } else {
          throw HttpException.internalServerError;
        }
      }
    }
    @Query(() => Number)
    @UseMiddleware(authentication, authorization([Role.GUIDE]))
    async getGuideTotalRevenue(@Ctx() ctx: Context) {
      const guideId = ctx.req.user?.id!;
      return this.guideService.getGuideTotalRevenue(guideId);
    }
    
    @Query(() => RevenueGroupedResponse)
    @UseMiddleware(authentication, authorization([Role.GUIDE]))
    async getGroupedRevenueOfGuide(@Ctx() ctx: Context) {
      const guideId = ctx.req.user?.id!;
      console.log("🚀 ~ GuideResolver ~ getGroupedRevenueOfGuide ~ guideId:", guideId)
      return this.guideService.getGuideGroupedRevenue(guideId);
    }
}
