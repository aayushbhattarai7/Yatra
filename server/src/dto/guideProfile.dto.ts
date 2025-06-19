import { IsEnum, IsNotEmpty } from "class-validator";
import { Gender } from "../constant/enum";
import { Field, InputType } from "type-graphql";

@InputType()
export class GuideProfileDTO{
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
      phoneNumber: string;

       @Field()
        @IsEnum(Gender, { message: "Invalid Gender" })
        gender: Gender;
      
}