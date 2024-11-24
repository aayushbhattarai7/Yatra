import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { Hotel } from "../../entities/hotels/hotel.entity";
@Entity("location")
export class Location extends Base {
  @Column({ name: "latitude" })
  latitude: string;

  @Column({ name: "longitude" })
  longitude: string;

  @OneToOne(() => User, (user) => user.location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => Guide, (guide) => guide.location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;

  @OneToOne(() => Travel, (travel) => travel.location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;

  @OneToOne(() => Hotel, (hotel) => hotel.location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
