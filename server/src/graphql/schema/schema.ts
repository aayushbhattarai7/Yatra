import { User } from "../../entities/user/user.entity"
import { Field, ObjectType } from "type-graphql"


@ObjectType()
export class AuthPayload {
  @Field()
  message: string;

  @Field(() => User)
  user: User;

 @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
  
  
}