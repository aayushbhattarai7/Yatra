import { InputType, Field } from "type-graphql";

@InputType()
export class LoginDTO {
  @Field()
  email: string;

  @Field()
  password: string;

  
}
