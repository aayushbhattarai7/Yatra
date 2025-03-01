import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { Gender, KycType, Role } from "../constant/enum";
import { Field, InputType } from "type-graphql";
@InputType()
export class GuideDTO {
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
  email: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: string;

  @Field()
  @IsEnum(Role, { message: "Invalid Gender" })
  role: Role;

  @Field()
  @IsNotEmpty()
  DOB: String;

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
  @IsEnum(KycType, { message: "Invalid Kyc" })
  kycType: KycType;

  @Field()
  @IsNotEmpty()
  licenseNumber: string;

  @Field()
  latitude: string;

  @Field()
  longitude: string;

  @Field()
  @IsNotEmpty()
  licenseValidityFrom: string;

  @Field()
  @IsNotEmpty()
  licenseValidityTo: string;

  @Field({ nullable: true })
  citizenshipId: string;

  @Field({ nullable: true })
  @IsDate()
  citizenshipIssueDate: Date;

  @Field({ nullable: true })
  citizenshipIssueFrom: string;

  @Field({ nullable: true })
  passportId: string;

  @Field({ nullable: true })
  @IsDate()
  passportIssueDate: Date;

  @Field({ nullable: true })
  @IsDate()
  passportExpiryDate: Date;

  @Field({ nullable: true })
  passportIssueFrom: string;

  @Field({ nullable: true })
  voterId: string;

  @Field({ nullable: true })
  voterAddress: string;

  @Field()
  @IsEnum(Gender, { message: "Invalid Gender" })
  gender: Gender;

  @Field()
  @IsStrongPassword()
  password: string;
}
