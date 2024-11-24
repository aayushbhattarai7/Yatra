import { Query, Resolver, Arg, Mutation } from "type-graphql";
import { User } from "../../entities/user/user.entity";
import UserService from "../../service/user.service";
import { UserDTO } from "../../dto/user.dto";

@Resolver(of => User)
export class UserResolver {
  private userService = new UserService();
 @Mutation(() => User)
  async signup(@Arg("data") data: UserDTO): Promise<User> {
    return await this.userService.signup(data);
  }
 

  @Query(() => User, { nullable: true })
  async getUser(@Arg("id") id: string): Promise<User | null> {
    return await this.userService.getByid(id);
  }
}
