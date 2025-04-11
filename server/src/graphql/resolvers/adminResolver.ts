import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import webTokenService from "../../service/webToken.service";
import { LoginResponse } from "../../graphql/schema/schema";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import HttpException from "../../utils/HttpException.utils";
import { Context } from "../../types/context";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { Role } from "../../constant/enum";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import adminService from "../../service/admin.service";
import { Admin } from "../../entities/admin/admin.entity";
import { Message } from "../../constant/message";
import { TrekkingPlace } from "../../entities/place/trekkingplace.entity";
import placeService from "../../service/place.service";

@Resolver((of) => Admin)
export class AdminResolver {
  @Mutation(() => LoginResponse)
  async adminLogin(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ) {
    try {
      const data = { email, password };
      const admin = await adminService.login(data);
      const tokens = webTokenService.generateTokens(
        { id: admin.id },
        admin.role,
      );

      return {
        id: admin.id,
        email: admin.email,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: Message.LoggedIn,
      };
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  @Query(() => [Guide])
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async getGuideApprovalRequestByAdmin(
    @Ctx() ctx: Context,
  ): Promise<Guide[] | null> {
    try {
      const id = ctx.req.user?.id;
      const admin = await adminService.getGuideApprovalRequest(id!);
      return admin
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  @Query(() => [Travel])
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async getTravelApprovalRequestByAdmin(
    @Ctx() ctx: Context,
  ): Promise<Travel[] | null> {
    try {
      const id = ctx.req.user?.id;
      const admin = await adminService.getTravelApprovalRequest(id!);
      return admin
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async approveTravel(@Ctx() ctx: Context, @Arg("travel_id") travelId: string) {
    try {
      const adminId = ctx.req.user?.id!;
      console.log("🚀 ~ AdminResolver ~ approveTravel ~ adminId:", adminId)
      return await adminService.approveTravel(adminId, travelId);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async approveGuide(@Ctx() ctx: Context, @Arg("guide_id") guideId: string) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.approveGuide(adminId, guideId);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async rejectTravel(
    @Ctx() ctx: Context,
    @Arg("travel_id") travelId: string,
    @Arg("message") message: string,
  ) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.rejectTravel(adminId, travelId, message);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

  @Query(() => [TrekkingPlace])
  async getPlacesByAdmin(
    @Ctx() ctx: Context,
  ): Promise<TrekkingPlace[] | null> {
    try {
      const place = await placeService.getPlaces();
      return place
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async rejectGuide(
    @Ctx() ctx: Context,
    @Arg("guide_id") guideId: string,
    @Arg("message") message: string,
  ) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.rejectGuide(adminId, guideId, message);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async deletePlace(
    @Ctx() ctx: Context,
    @Arg("placeId") placeId: string,
  ) {
    try {
      const adminId = ctx.req.user?.id!;
      return await placeService.deletePlace(adminId, placeId);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error ? error.message : Message.error,
      );
    }
  }

}
