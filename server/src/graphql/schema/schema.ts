import { User } from "../../entities/user/user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
class Token {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  middleName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  gender: string;
  @Field()
  role: string;

  @Field(() => Token)
  tokens: Token;

  @Field()
  message: string;
}
