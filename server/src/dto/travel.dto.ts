import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { Gender } from "../constant/enum";
import { Field, InputType } from "type-graphql";

@InputType()
export class TravelDTO {

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
  kycType: string;

  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: string;

  @Field()
  @IsNotEmpty()
  DOB: Date;

  @Field()
  @IsNotEmpty()
  nationality: string;

  @Field()
  @IsNotEmpty()
  province: string;

  @Field()
  @IsNotEmpty()
  district: string;

@Field()
  @IsNotEmpty()
  municipality: string;

  @Field()
  @IsNotEmpty()
  engineNumber: string;

  @Field()
  @IsNotEmpty()
  chasisNumber: string;

  @Field()
  @IsNotEmpty()
  vehicleNumber: string;

  @Field()
  @IsNotEmpty()
  vehicleType: string;

  @Field()
  @IsString()
  citizenshipId: string;

  @Field()
  @IsDate()
  citizenshipIssueDate: Date;

  @Field()
  @IsString()
  citizenshipIssueFrom: string;

  @Field()
  @IsString()
  passportId: string;

  @Field()
  @IsDate()
  passportIssueDate: Date;

  @Field()
  @IsDate()
  passportExpiryDate: Date;

  @Field()
  @IsString()
  passportIssueFrom: string;

  @Field()
  @IsString()
  voterId: string;

  @Field()
  @IsString()
  voterAddress: string;

  @Field()
  @IsEnum(Gender, { message: "Invalid Gender" })
  gender: Gender;

  @Field()
  @IsStrongPassword()
  password: string;
}
