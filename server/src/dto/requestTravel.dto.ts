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
export class TravelRequestDTO {
  @Field()
  @IsNotEmpty()
  from: string;

  @Field()
  @IsNotEmpty()
  to: string;

  @Field()
  @IsNotEmpty()
  totalDays: string;

  @Field()
  @IsNotEmpty()
  totalPeople: string;

  @Field()
  @IsNotEmpty()
  vehicleType: string;

  @Field()
  price: string;

  @Field()
  DOB: Date;

 
}
