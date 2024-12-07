import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { User } from '../../entities/user/user.entity';
import UserService from '../../service/user.service';
import { UserDTO } from '../../dto/user.dto';
import webTokenService from '../../service/webToken.service';
import { LoginDTO } from '../../dto/login.dto';
import { LoginResponse } from '../../graphql/schema/schema';
import { Location } from '../../entities/location/location.entity';
import { Guide } from '../../entities/guide/guide.entity';
import { Travel } from '../../entities/travels/travel.entity';
import HttpException from '../../utils/HttpException.utils';
import { Context } from '../../types/context';
import { authentication } from '../../middleware/authentication.middleware';
import { authorization } from '../../middleware/authorization.middleware';
import { Role } from '../../constant/enum';
import { LocationDTO } from '../../dto/location.dto';
import { RequestGuide } from '../../entities/user/RequestGuide.entities';
import { GuideRequestDTO } from '../../dto/requestGuide.dto';
import { RequestTravel } from '../../entities/user/RequestTravels.entity';
import { TravelRequestDTO } from '../../dto/requestTravel.dto';

@Resolver(of => User)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => User)
  async signup(@Arg("data") data: UserDTO): Promise<User> {
    console.log("12334");
    return await this.userService.signup(data);
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("data") data: LoginDTO) {
    console.log("yesss", data)
    try {
      const user = await this.userService.login(data);
      console.log("🚀 ~ UserResolver ~ login ~ user:", user)
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
      throw new Error(error instanceof Error ? error.message : "An error occurred during login");
    }
  }

  @Mutation(() => Location)
    @UseMiddleware(authentication, authorization([Role.USER]))
  async addLocation(@Ctx() ctx:Context,@Arg("data") data: LocationDTO) {
    const id = ctx.req.user?.id!
    const details = await this.userService.addLocation(id, data)
    return details
    }

  @Query(() => User, { nullable: true })
  async getUser(@Arg("id") id: string): Promise<User | null> {
    return await this.userService.getByid(id);
  }

 
  @Query(() => [Guide])
    @UseMiddleware(authentication, authorization([Role.USER]))
   async findGuide(@Ctx() ctx:Context): Promise<Guide[] | null> {
     console.log("ok")
     try {
      const id = ctx.req.user?.id
       const data = this.userService.findGuide(id!)
       console.log("🚀 ~ UserResolver ~ findGuide ~ data:", data)
      return data
     } catch (error) {
      console.log("🚀 ~ UserResolver ~ findGuide ~ error:", error)
      throw HttpException.internalServerError
     }
   }
  @Query(() => [Travel])
     @UseMiddleware(authentication, authorization([Role.USER]))
   async findTravel(@Ctx() ctx: Context): Promise<Travel[] | null> {
     const id = ctx.req.user?.id
     console.log("🚀 ~ UserResolver ~ findTravel ~ id:", id)
     const data = this.userService.findTravel(id!)
    return data
  }
  
  @Query(() => Location)
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getLocation(@Ctx() ctx: Context): Promise<Location | null>{
    try {
      const id = ctx.req.user?.id!
      const data = await this.userService.getLocation(id)
      return data
    } catch (error:unknown) {
      if (error instanceof Error) {
        
        throw HttpException.badRequest(error.message)
      } else {
        throw HttpException.internalServerError
      }
    }
  } 

  @Mutation(() => RequestGuide)
    @UseMiddleware(authentication, authorization([Role.USER]))
  async requestGuide(@Ctx() ctx: Context, guide_id:string, data:GuideRequestDTO) {
    try {
      const id = ctx.req.user?.id!
      const details = await this.userService.requestGuide(id, guide_id, data)
      return {details, mesage:"Reuested successsfully"}
    }catch (error:unknown) {
      if (error instanceof Error) {
        
        throw HttpException.badRequest(error.message)
      } else {
        throw HttpException.internalServerError
      }
    }
}

  
   @Mutation(() => RequestTravel)
    @UseMiddleware(authentication, authorization([Role.USER]))
  async requestTravel(@Ctx() ctx: Context, travel_id:string, data:TravelRequestDTO) {
    try {
      const id = ctx.req.user?.id!
      const details = await this.userService.requestTravel(id, travel_id, data)
      return {details, mesage:"Reuested successsfully"}
    }catch (error:unknown) {
      if (error instanceof Error) {
        
        throw HttpException.badRequest(error.message)
      } else {
        throw HttpException.internalServerError
      }
    }
   }
  
  @Query(() => RequestTravel) 
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getOwnTravelRequest(@Ctx() ctx: Context) {
    try {
      const user_id = ctx.req.user?.id!
      const data = await this.userService.getOwnTravelRequests(user_id)
      return data
    } catch (error:unknown) {
      if (error instanceof Error) {
        
        throw HttpException.badRequest(error.message)
      } else {
        throw HttpException.internalServerError
      }
    }
  }

  
  
}
