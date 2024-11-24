import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Hotel } from "../../entities/hotels/hotel.entity";
import { RoomType } from "../../constant/enum";
@Entity("hotel_room")
export class HotelRoom extends Base {
  @Column({ type: "enum", enum: RoomType })
  roomType: RoomType;

  @Column({ name: "room_description" })
  roomDescription: string;

  @Column({ name: "is_Attached_bathroom" })
  isAttachedBathroom: boolean;

  @Column({ name: "max_occupancy" })
  maxOccupancy: number;

  @Column({ name: "room_size" })
  roomSize: number;

  @Column({ name: "amenities" })
  Amenities: string;

  @Column({ name: "price_per_night" })
  pricePerNight: number;

  @Column({ name: "is_available" })
  isAvailable: boolean;

  @ManyToOne(() => Hotel, (hotels) => hotels.room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hotel_id" })
  hotels: Hotel;
}
