import { IsNotEmpty } from "class-validator";

export class LocationDTO {
  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  longitude: string;
}
