import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class HotelDTO {
  @IsNotEmpty()
  hotelName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  pan_issue_date: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  municipality: string;

  @IsNotEmpty()
  panNumber: string;

  @IsNotEmpty()
  licenseValidityFrom: string;

  @IsNotEmpty()
  nameOfTaxPayer: string;

  @IsString()
  businessName: string;

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

  @IsStrongPassword()
  password: string;
}
