import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { Gender } from "../constant/enum";

export class TravelDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  middleName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  DOB: Date;

  @IsNotEmpty()
  nationality: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  municipality: string;

  @IsNotEmpty()
  engineNumber: string;

  @IsNotEmpty()
  chasisNumber: string;

  @IsNotEmpty()
  vehicleNumber: string;

  @IsNotEmpty()
  vehicleType: string;

  @IsString()
  citizenshipId: string;

  @IsDate()
  citizenshipIssueDate: Date;

  @IsString()
  citizenshipIssueFrom: string;

  @IsString()
  passportId: string;

  @IsDate()
  passportIssueDate: Date;

  @IsDate()
  passportExpiryDate: Date;

  @IsString()
  passportIssueFrom: string;

  @IsString()
  voterId: string;

  @IsString()
  voterAddress: string;

  @IsEnum(Gender, { message: "Invalid Gender" })
  gender: Gender;

  @IsStrongPassword()
  password: string;
}
