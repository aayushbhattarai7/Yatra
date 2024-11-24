import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role } from "../../constant/enum";
import { Location } from "../location/location.entity";
import { RequestTravel } from "./RequestTravels.entity";
import { RequestGuide } from "./RequestGuide.entities";
import { BookHotel } from "../../entities/hotels/bookHotel.entity";
import { HotelRoom } from "../../entities/hotels/hotelRoom.entity";
@Entity("user")
export class User extends Base {
  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name", nullable: true })
  middleName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ name: "password", select: false })
  password: string;

  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;

  @OneToOne(() => BookHotel, (bookHotel) => bookHotel.user, { cascade: true })
  bookHotel: BookHotel;

  @OneToMany(() => RequestTravel, (requestTravel) => requestTravel.user, {
    onDelete: "CASCADE",
  })
  requestTravel: RequestTravel;

  @OneToMany(() => RequestGuide, (requestGuide) => requestGuide.users, {
    onDelete: "CASCADE",
  })
  requestGuide: RequestGuide;
}
