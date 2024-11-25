import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import HotelKyc from "./hotelKyc.entity";
import { HotelDetails } from "./hotelDetails.entity";
import { BookHotel } from "./bookHotel.entity";
import { HotelRoom } from "./hotelRoom.entity";

@ObjectType()
@Entity("hotel")
export class Hotel extends Base {
  @Field()
  @Column({ name: "hotel_name" })
  hotelName: string;

  @Field()
  @Column({ type: "enum", enum: Role, default: Role.HOTEL })
  role: Role;

  @Field()
  @Column({ name: "email", unique: true })
  email: string;

  @Field()
  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Field()
  @Column({ name: "password", select: false })
  password: string;

  @Field({ nullable: true })
  @Column({ name: "otp", nullable: true })
  otp: string;

  @Field()
  @Column({ name: "verified", default: false })
  verified: boolean;

  @Field()
  @Column({ name: "approved", default: false })
  approved: boolean;

  @Field()
  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  approval: Status;

  @Field()
  @Column({ name: "available", default: true })
  available: boolean;

  @Field({ nullable: true })
  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @Field(() => Location)
  @OneToOne(() => Location, (location) => location.hotel, { cascade: true })
  location: Location;

  @Field(() => [BookHotel])
  @OneToMany(() => BookHotel, (book) => book.hotel, { cascade: true })
  book: BookHotel[];
  @Field(() => [HotelKyc])
  @OneToMany(() => HotelKyc, (kyc) => kyc.hotel, { cascade: true })
  kyc: HotelKyc[];

  @Field(() => HotelDetails)
  @OneToOne(() => HotelDetails, (details) => details.hotel, {
    cascade: true,
  })
  details: HotelDetails;
}
