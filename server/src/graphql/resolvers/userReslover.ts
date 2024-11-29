import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../../entities/user/user.entity';
import UserService from '../../service/user.service';
import { UserDTO } from '../../dto/user.dto';
import webTokenService from '../../service/webToken.service';
import { LoginDTO } from '../../dto/login.dto';
import { AuthPayload } from '../../graphql/schema/schema';
import { Location } from '../../entities/location/location.entity';

@Resolver(of => User)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => User)
  async signup(@Arg("data") data: UserDTO): Promise<User> {
    console.log("12334");
    return await this.userService.signup(data);
  }

  @Mutation(() => User)
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
}
