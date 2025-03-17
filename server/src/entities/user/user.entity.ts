import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role } from "../../constant/enum";
import { Location } from "../location/location.entity";
import { RequestTravel } from "./RequestTravels.entity";
import { RequestGuide } from "./RequestGuide.entities";
import { BookHotel } from "../../entities/hotels/bookHotel.entity";
import { Notification } from "../../entities/notification/notification.entity";
import { Chat } from "../../entities/chat/chat.entity";
import { Room } from "../../entities/chat/room.entity";

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
  @Column({ name: "verified", nullable: true })
  verified: boolean;

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

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.senderUser, {
    onDelete: "CASCADE",
  })
  notification: Notification[];
  
  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.receiverUser, {
    onDelete: "CASCADE",
  })
  notifications: Notification[];

  @OneToMany(() => Chat, (chat) => chat.senderUser)
  sendMessage: Chat[]

  @OneToMany(() => Chat, (chat) => chat.receiverUser)
  receiveMessage: Chat[]

  @OneToMany(() => Room, (room) => room.user)
  users: Room[]

}
