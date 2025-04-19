import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { ActiveStatus, Gender, Role } from "../../constant/enum";
import { Location } from "../location/location.entity";
import { RequestTravel } from "./RequestTravels.entity";
import { RequestGuide } from "./RequestGuide.entities";
import { BookHotel } from "../../entities/hotels/bookHotel.entity";
import { Notification } from "../../entities/notification/notification.entity";
import { Chat } from "../../entities/chat/chat.entity";
import { Room } from "../../entities/chat/room.entity";
import { Rating } from "../../entities/ratings/rating.entity";
import UserImage from "./userImage.entity";
import { FavouritPlace } from "../../entities/place/placefavourite.entity";
import { Report } from "./report.entity";
import { PlaceRating } from "../../entities/ratings/place.rating.entity";

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
  @Column({ name: "travel_style", default:"Nature Explorer" })
  travelStyle: string;

  @Field({nullable:true})
  @Column({ name: "explorer_level", default:1 })
  exploreLevel: number;

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

  @Field({nullable:true})
  @Column({ type: "enum", enum: ActiveStatus, default:ActiveStatus.AVAILABLE, nullable:true })
  status: ActiveStatus;

  @Field()
  @Column({ name: "password", select: false })
  password: string;
  @Field()
  @Column({ name: "tokens", nullable: true })
  tokens: string;
  
  @Field()
  @Column({ name: "available", default: false })
  available: boolean;

  @Field({ nullable: true })
  @Column({ name: "otp", nullable: true })
  otp: string;

  @Field(() => Location, { nullable: true })
  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.user, { cascade: true })
  rating: Rating[];

  @Field(() => [PlaceRating])
  @OneToMany(() => PlaceRating, (rating) => rating.user, { cascade: true })
  placeRating: PlaceRating[];

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

  @Field(() => [Chat])
  @OneToMany(() => Chat, (chat) => chat.senderUser)
  sendMessage: Chat[];

  @Field(() => [Chat])
  @OneToMany(() => Chat, (chat) => chat.receiverUser)
  receiveMessage: Chat[];

  @Field(() => [Room])
  @OneToMany(() => Room, (room) => room.user)
  users: Room[];

  @Field(() => [UserImage], { nullable: true })
  @OneToMany(() => UserImage, (image) => image.user, { nullable: true })
  image: UserImage[];

  @Field(() => [FavouritPlace], { nullable: true })
  @OneToMany(() => FavouritPlace, (favourite) => favourite.user)
  favourite: FavouritPlace[];

  @Field(() => [Report])
  @OneToMany(() => Report, (report) => report.reporterUser, {
    onDelete: "CASCADE",
  })
  report: Report[];

  @Field(() => [Report])
  @OneToMany(() => Report, (reports) => reports.reportedUser, {
    onDelete: "CASCADE",
  })
  reports: Report[];
}
