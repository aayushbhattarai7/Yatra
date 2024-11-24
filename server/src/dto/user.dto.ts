import { InputType, Field } from "type-graphql";
import { IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Gender } from "../constant/enum";

@InputType()
export class UserDTO {
  @Field()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsNotEmpty()
  middleName: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsNotEmpty()
  role: string;

  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: string;

  @Field()
  @IsEnum(Gender, { message: "Invalid Gender" })
  gender: Gender;

  @Field()
  @IsStrongPassword()
  password: string;
}
