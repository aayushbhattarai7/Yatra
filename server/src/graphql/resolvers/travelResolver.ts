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
import { Travel } from "../../entities/travels/travel.entity";
import { TravelDTO } from "../../dto/travel.dto";
import travelService from "../../service/travel.service";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import { Notification } from "../../entities/notification/notification.entity";
import { Chat } from "../../entities/chat/chat.entity";
import { ChatService } from "../../service/chat.service";
import { Room } from "../../entities/chat/room.entity";
import { RoomService } from "../../service/room.service";
const chatService = new ChatService();
const roomService = new RoomService();
export class TravelResolver {
  @Mutation(() => String)
  async travelSignup(
    @Arg("data") data: TravelDTO,
    @Ctx() req: Context,
  ): Promise<String> {
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
        return "Invalid KYC type provided.";
      }
      console.log(uploadedPhotos);
      const details = await travelService.create(uploadedPhotos as any, data);

      return "Travel is registered successfully";
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  @Mutation(() => LoginResponse)
  async travelLogin(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ) {
    try {
      const data = { email, password };
      const user = await travelService.loginTravel(data);
      console.log("🚀 ~ UserResolver ~ login ~ user:", user);
      const tokens = webTokenService.generateTokens({ id: user.id }, user.role);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        verified: user.verified,

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

  @Query(() => [RequestTravel])
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getRequestByTravel(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      return await travelService.getRequests(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => [Notification])
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getAllNotificationsOfTravel(@Ctx() ctx: Context) {
    try {
      const travelId = ctx.req.user?.id!;
      return await travelService.getAllNotifications(travelId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => Number)
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getUnreadNotificationsOfTravel(@Ctx() ctx: Context) {
    try {
      const travelId = ctx.req.user?.id!;
      return await travelService.getUnreadNotificationsCount(travelId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  async travelVerifyOTP(@Arg("email") email: string, @Arg("otp") otp: string) {
    try {
      return await travelService.verifyUser(email, otp);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  async travelResendOTP(@Arg("email") email: string) {
    try {
      return await travelService.reSendOtp(email);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => Travel, { nullable: true })
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getTravelDetails(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      return await travelService.getTravelDetails(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async rejectRequestByTravel(
    @Arg("requestId") requestId: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await travelService.rejectRequest(userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async sendPriceByTravel(
    @Arg("requestId") requestId: string,
    @Arg("price") price: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await travelService.sendPrice(price, userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  async requestForCompletedTravel(@Arg("userId") userId: string,  @Ctx() ctx: Context,) {
    try {
      const travelId = ctx.req.user?.id!;
      return await travelService.completeTravelService(travelId, userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async addLocationOfTravel(
    @Arg("latitude") latitude: number,
    @Arg("longitude") longitude: number,
    @Ctx() ctx: Context,
  ) {
    try {
      const data = { latitude, longitude };

      const travelId = ctx.req.user?.id!;
      return await travelService.addLocation(travelId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [RequestTravel], { nullable: true })
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getRequestHistoryOfTravel(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      console.log(userId);
      const x = await travelService.getHistory(userId);
      console.log(x, "xxxxx");
      return x;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [Chat])
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getChatOfUserByTravel(
    @Ctx() ctx: Context,
    @Arg("userId") userId: string,
  ) {
    try {
      const travelId = ctx.req.user?.id!;
      console.log(
        "🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ travelId:",
        travelId,
      );
      return await chatService.getChatByTravelOfUser(travelId, userId);
    } catch (error) {
      console.log(
        "🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ error:",
        error,
      );
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [Room])
  @UseMiddleware(authentication, authorization([Role.TRAVEL]))
  async getChatUserByTravel(@Ctx() ctx: Context) {
    try {
      const travelId = ctx.req.user?.id!;
      return await roomService.getUserOfChatByTravel(travelId);
    } catch (error) {
      console.log(
        "🚀 ~ TravelResolver ~ getChatOfUserByTravel ~ error:",
        error,
      );
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
