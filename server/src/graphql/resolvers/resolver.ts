import { User } from "../../entities/user/user.entity";
import UserService from "../../service/user.service";
import { UserDTO } from "../../dto/user.dto";
import webTokenService from "../../service/webToken.service";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { Role } from "../../constant/enum";

const userService = new UserService();

export const resolvers = {
  Query: {
    getUser: async (_: unknown, { id }: { id: string }, context: any): Promise<User | null> => {
       authentication;
      await authorization( [Role.USER]);
      return await userService.getByid(id);
    },
  },
  Mutation: {
    signup: async (_: unknown, { data }: { data: UserDTO }): Promise<User> => {
      console.log("yessssssssssssssss1221211");
      return await userService.signup(data);
    },

    login: async (_: unknown, { data }: { data: UserDTO }) => {
      try {
        const user = await userService.login(data);
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
    },
  },
};
