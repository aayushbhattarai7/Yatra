import { IsNotEmpty } from "class-validator";

export class TravelRequestDTO {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  totalDays: number;

  @IsNotEmpty()
  totalPeople: number;

  price: string;

  @IsNotEmpty()
  vehicleType: string;
}
