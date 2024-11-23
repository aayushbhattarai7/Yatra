import {
  IsEnum,
  IsNegative,
  IsNotEmpty,
  IsStrongPassword,
} from "class-validator";
import { Gender } from "../constant/enum";

export class UserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  middleName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(Gender, { message: "Invalid Gender" })
  gender: Gender;

  @IsStrongPassword()
  password: string;
}
