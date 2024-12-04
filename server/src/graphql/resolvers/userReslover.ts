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

  @Query(() => User, { nullable: true })
  async getUser(@Arg("id") id: string): Promise<User | null> {
    return await this.userService.getByid(id);
  }

   @Query(() => User, { nullable: true })
  async getLocation(@Arg("id") id: string): Promise<Location | null> {
    return this.userService.getLocation(id)
   }
   @Query(() => [Guide])
   async findGuide(@Arg("id") id: string): Promise<Guide[] | null> {
     console.log("ok")
     try {
      
       const data = this.userService.findGuide(id)
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
  
  
}
