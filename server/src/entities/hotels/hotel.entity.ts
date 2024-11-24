import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import HotelKyc from "./hotelKyc.entity";
import { HotelDetails } from "./hotelDetails.entity";
import { BookHotel } from "./bookHotel.entity";
import { HotelRoom } from "./hotelRoom.entity";
@Entity("hotel")
export class Hotel extends Base {
  @Column({ name: "hotel_name" })
  hotelName: string;

  @Column({ type: "enum", enum: Role, default: Role.HOTEL })
  role: Role;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Column({ name: "password", select: false })
  password: string;

  @Column({ name: "otp", nullable: true })
  otp: string;

  @Column({ name: "verified", default: false })
  verified: boolean;

  @Column({ name: "approved", default: false })
  approved: boolean;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  approval: Status;

  @Column({ name: "available", default: true })
  available: boolean;

  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @OneToOne(() => Location, (location) => location.hotel, { cascade: true })
  location: Location;

  @OneToMany(() => BookHotel, (book) => book.hotel, { cascade: true })
  book: BookHotel;
  @OneToMany(() => HotelRoom, (room) => room.hotels, { cascade: true })
  room: HotelRoom;

  @OneToMany(() => HotelKyc, (kyc) => kyc.hotel, { cascade: true })
  kyc: HotelKyc;

  @OneToOne(() => HotelDetails, (details) => details.hotel, {
    cascade: true,
  })
  details: HotelDetails;
}
