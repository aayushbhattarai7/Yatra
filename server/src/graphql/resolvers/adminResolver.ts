import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entities/user/user.entity";
import webTokenService from "../../service/webToken.service";
import { LoginResponse } from "../../graphql/schema/schema";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import HttpException from "../../utils/HttpException.utils";
import { Context } from "../../types/context";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import {  Role } from "../../constant/enum";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import adminService from "../../service/admin.service";
import { Admin } from "../../entities/admin/admin.entity";

interface Message {
  message: string;
}
@Resolver((of) => Admin)
export class AdminResolver {

  @Mutation(() => LoginResponse)
  async adminLogin(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const data = { email, password };
      const admin = await adminService.login(data);
      const tokens = webTokenService.generateTokens({ id: admin.id }, admin.role);

      return {
        id: admin.id,
        email: admin.email,
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

    @Query(() => Guide, { nullable: true })
        @UseMiddleware(authentication, authorization([Role.ADMIN]))

  async getGuideApprovalRequestByAdmin(@Arg("id") id: string): Promise<Guide[] | null> {
    return await adminService.getGuideApprovalRequest(id);
  }

  @Query(() => [Travel])
  @UseMiddleware(authentication, authorization([Role.ADMIN]))
  async getTravelApprovalRequestByAdmin(@Ctx() ctx: Context): Promise<Travel[] | null> {
    try {
      const id = ctx.req.user?.id;
      return adminService.getTravelApprovalRequest(id!);
    } catch (error) {
      throw HttpException.internalServerError;
    }
  }


  @Mutation(() => RequestTravel)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async approveTravel(
    @Ctx() ctx: Context,
    @Arg("travel_id") travelId: string,
  ) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.approveTravel(adminId, travelId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.internalServerError(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => RequestGuide)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async approveGuide(
    @Ctx() ctx: Context,
    @Arg("guide_id") guideId: string,
  ) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.approveGuide(adminId, guideId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.internalServerError(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => RequestTravel)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async rejectTravel(@Ctx() ctx: Context,
      @Arg("travel_id") travelId: string,
      @Arg("message") message: string,
) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.rejectTravel(adminId, travelId,  message);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => RequestGuide)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async rejectGuide(@Ctx() ctx: Context,
    @Arg("guide_id") guideId: string,
      @Arg("message") message: string,) {
    try {
      const adminId = ctx.req.user?.id!;
      return await adminService.rejectGuide(adminId, guideId, message);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

}
