import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entities/user/user.entity";
import UserService from "../../service/user.service";
import webTokenService from "../../service/webToken.service";
import { LoginResponse } from "../../graphql/schema/schema";
import { Location } from "../../entities/location/location.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import HttpException from "../../utils/HttpException.utils";
import { Context } from "../../types/context";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { Gender, Role } from "../../constant/enum";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import GuideKYC from "../../entities/guide/guideKyc.entity";
import TravelKyc from "../../entities/travels/travelKyc.entity";
import { TravelDetails } from "../../entities/travels/travelDetails.entity";
import { PaymentDetails } from "../../interface/esewa.interface";


@Resolver((of) => User)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => String)
  async signup(
    @Arg("firstName") firstName: string,
    @Arg("middleName", { nullable: true }) middleName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("phoneNumber") phoneNumber: string,
    @Arg("gender") gender: Gender,
    @Arg("password") password: string,
  ) {
    try {
      const newUser = {
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        password,
      };

      const createdUser = await this.userService.signup(newUser);
      return createdUser;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
      );
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const data = { email, password };
      const user = await this.userService.login(data);
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

  @Mutation(() => LoginResponse)
  async googleLogin(@Arg("googleId") googleId: string) {
    try {
      const user = await this.userService.googleLogin(googleId);
      const tokens = webTokenService.generateTokens(
        { id: user?.id! },
        user?.role!,
      );

      return {
        id: user?.id!,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: "Logged in successfully via Google",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred during Google login",
      );
    }
  }
  @Mutation(() => LoginResponse)
  async facebookLogin(@Arg("facebookId") facebookId: string) {
    try {
      console.log(facebookId, "ullala ullala");
      const user = await this.userService.facebookLogin(facebookId);
      const tokens = webTokenService.generateTokens(
        { id: user?.id! },
        user?.role!,
      );
      console.log("🚀 ~ UserResolver ~ facebookLogin ~ tokens:", tokens);

      return {
        id: user?.id!,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: "Logged in successfully via Google",
      };
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error
          ? error.message
          : "An error occurred during Google login",
      );
    }
  }

  @Query(() => User)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getUser(@Ctx() ctx: Context): Promise<User | null> {
    try {
      const id = ctx.req.user?.id;
      return this.userService.getByid(id!);
    } catch (error: unknown) {
      throw HttpException.badRequest(
        error instanceof Error
          ? error.message
          : "An error occurred during Google login",
      );
    }
  }
  @Query(() => [Guide, GuideKYC])
  @UseMiddleware(authentication, authorization([Role.USER]))
  async findGuide(@Ctx() ctx: Context): Promise<Guide[] | null> {
    try {
      const id = ctx.req.user?.id;
      return this.userService.findGuide(id!);
    } catch (error) {
      throw HttpException.internalServerError;
    }
  }

  @Query(() => [Travel, TravelKyc, TravelDetails])
  @UseMiddleware(authentication, authorization([Role.USER]))
  async findTravel(@Ctx() ctx: Context): Promise<Travel[] | null> {
    try {
      const id = ctx.req.user?.id;
      const data = await this.userService.findTravel(id!);
      console.log("🚀 ~ UserResolver ~ findTravel ~ data:", data);
      return data;
    } catch (error) {
      throw HttpException.internalServerError;
    }
  }

  @Query(() => Location)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getLocation(@Ctx() ctx: Context): Promise<Location | null> {
    try {
      const id = ctx.req.user?.id!;
      return await this.userService.getLocation(id);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async requestGuide(
    @Ctx() ctx: Context,
    @Arg("guide_id") guideId: string,
    @Arg("from") from: string,
    @Arg("to") to: string,
    @Arg("totalDays") totalDays: string,
    @Arg("totalPeople") totalPeople: string,
  ) {
    try {
      const data = { from, to, totalDays, totalPeople };
      const userId = ctx.req.user?.id!;
      return await this.userService.requestGuide(userId, guideId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.internalServerError(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async requestTravel(
    @Ctx() ctx: Context,
    @Arg("travel_id") travelId: string,
    @Arg("from") from: string,
    @Arg("to") to: string,
    @Arg("totalDays") totalDays: string,
    @Arg("totalPeople") totalPeople: string,
    @Arg("vehicleType") vehicleType: string,
  ) {
    try {
      const data = { from, to, totalDays, totalPeople, vehicleType };
      const userId = ctx.req.user?.id!;
      return await this.userService.requestTravel(userId, travelId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.internalServerError(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [RequestTravel])
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getOwnTravelRequest(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      console.log("🚀 ~ UserResolver ~ getOwnTravelRequest ~ userId:", userId);
      return await this.userService.getOwnTravelRequests(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Query(() => [RequestTravel])
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getTravelHistory(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id!;
      console.log("🚀 ~ UserResolver ~ getOwnTravelRequest ~ userId:", userId);
      return await this.userService.getTravelRequestsHistory(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => [RequestGuide])
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getOwnGuideRequest(@Ctx() ctx: Context) {
    try {
      const userId = ctx.req.user?.id as string;
      return await this.userService.getOwnGuideRequests(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => Location)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getTravelLocation(@Ctx() ctx: Context, travel_id: string) {
    try {
      const user_id = ctx.req.user?.id!;
      const data = await this.userService.getTravelLocation(user_id, travel_id);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Query(() => Location)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getGuideLocation(@Ctx() ctx: Context, guide_id: string) {
    try {
      const user_id = ctx.req.user?.id!;
      const data = await this.userService.getGuideLocation(user_id, guide_id);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async sendPriceToGuide(
    @Arg("requestId") requestId: string,
    @Arg("price") price: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.sendGuidePrice(price, userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async sendPriceToTravel(
    @Arg("requestId") requestId: string,
    @Arg("price") price: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.sendTravelPrice(price, userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async cancelGuideRequest(
    @Arg("requestId") requestId: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.cancelGuideRequest(userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async cancelTravelRequest(
    @Arg("requestId") requestId: string,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.cancelTravelRequest(userId, requestId);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async AdvancePaymentForTravel(
    @Arg("travelId") travelId: string,
    @Arg("amount") amount: number,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.advancePaymentForTravel(userId, travelId, amount);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  @Mutation(() => String)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async AdvancePaymentForGuide(
    @Arg("guideId") guideId: string,
    @Arg("amount") amount: number,
    @Ctx() ctx: Context,
  ) {
    try {
      const userId = ctx.req.user?.id!;
      return await this.userService.advancePaymentForGuide(userId, guideId, amount);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

    @Query(() => PaymentDetails)
  @UseMiddleware(authentication, authorization([Role.USER]))
    async generatePaymentDetails(@Arg("total_amount") totalAmount: number,
    @Arg("product_code") product_code:string
    ) {
      try {
      console.log("shdhuhwuh")
      const data = await this.userService.generatePaymentDetails(totalAmount, product_code);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
