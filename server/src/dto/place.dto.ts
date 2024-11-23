import { IsNotEmpty } from "class-validator";

export class PlaceDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  longitude: string;
}
