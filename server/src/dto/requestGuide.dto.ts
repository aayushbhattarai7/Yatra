import { IsNotEmpty } from "class-validator";

export class GuideRequestDTO {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  totalDays: string;

  @IsNotEmpty()
  totalPeople: string;

  price: string;
}
