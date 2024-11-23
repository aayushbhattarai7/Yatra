import { IsEnum, IsNotEmpty } from "class-validator";
import { RoomType } from "../constant/enum";

export class HotelRoomDTO {
  @IsNotEmpty()
  @IsEnum(RoomType)
  roomType: RoomType;

  @IsNotEmpty()
  roomDescription: string;

  @IsNotEmpty()
  isAttachedBathroom: boolean;

  @IsNotEmpty()
  maxOccupancy: number;

  @IsNotEmpty()
  roomSize: number;

  @IsNotEmpty()
  Amenities: string;

  @IsNotEmpty()
  pricePerNight: number;

  @IsNotEmpty()
  isAvailable: boolean;
}
