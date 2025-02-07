import { Guide } from "../../entities/guide/guide.entity";
import { User } from "../../entities/user/user.entity";
import { Field, ObjectType } from "type-graphql";
import { GuideDetails } from "../../entities/guide/guideDetails.entity";
import GuideKYC from "../../entities/guide/guideKyc.entity";

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

@ObjectType()
export class GuideResponse {
  @Field(() => Guide, { nullable: true })
  guide: Guide;

  @Field(() => GuideDetails, { nullable: true })
  details?: GuideDetails;

  @Field(() => GuideKYC, { nullable: true })
  kyc: GuideKYC;
}
