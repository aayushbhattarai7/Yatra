import { Query, Resolver, Arg, Mutation, UseMiddleware } from "type-graphql";
import { User } from "../../entities/user/user.entity";
import UserService from "../../service/user.service";
import { UserDTO } from "../../dto/user.dto";
import webTokenService from "../../service/webToken.service";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { Role } from "../../constant/enum";

@Resolver((of) => User)
export class UserResolver {
  private userService = new UserService();
  @Mutation(() => User)
  async signup(@Arg("data") data: UserDTO): Promise<User> {
    return await this.userService.signup(data);
  }

  @Mutation(() => User)
  async login(@Arg("data") data: UserDTO) {
    try {
      const user = await this.userService.login(data);
      const tokens = webTokenService.generateTokens({ id: user.id }, user.role);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
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

  @Query(() => User, { nullable: true })
  @UseMiddleware(authentication, authorization([Role.USER]))
  async getUser(@Arg("id") id: string): Promise<User | null> {
    return await this.userService.getByid(id);
  }
}
