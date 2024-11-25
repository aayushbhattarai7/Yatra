import { InputType, Field } from "type-graphql";
import { IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Gender, Role } from "../constant/enum";

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
  @IsEnum(Role, { message: "Invalid Gender" })
  role: Role;

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
