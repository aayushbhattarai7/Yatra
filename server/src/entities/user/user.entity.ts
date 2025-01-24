import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role } from "../../constant/enum";
import { Location } from "../location/location.entity";
import { RequestTravel } from "./RequestTravels.entity";
import { RequestGuide } from "./RequestGuide.entities";
import { BookHotel } from "../../entities/hotels/bookHotel.entity";

@ObjectType()
@Entity("user")
export class User extends Base {
  @Field()
  @Column({ name: "first_name" })
  firstName: string;

  @Field({ nullable: true })
  @Column({ name: "middle_name", nullable: true })
  middleName: string;

  @Field()
  @Column({ name: "last_name" })
  lastName: string;

  @Field()
  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @Field()
  @Column({ name: "email", unique: true })
  email: string;

  @Field()
  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Field()
  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Field()
  @Column({ name: "password", select: false })
  password: string;
  @Field()
  @Column({ name: "tokens", nullable: true })
  tokens: string;

  @Field(() => Location)
  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;

  @Field(() => BookHotel)
  @OneToOne(() => BookHotel, (bookHotel) => bookHotel.user, { cascade: true })
  bookHotel: BookHotel;

  @Field(() => [RequestTravel])
  @OneToMany(() => RequestTravel, (requestTravel) => requestTravel.user, {
    onDelete: "CASCADE",
  })
  requestTravel: RequestTravel[];

  @Field(() => [RequestGuide])
  @OneToMany(() => RequestGuide, (requestGuide) => requestGuide.users, {
    onDelete: "CASCADE",
  })
  requestGuide: RequestGuide[];
}
