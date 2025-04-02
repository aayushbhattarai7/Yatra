import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import TravelKyc from "./travelKyc.entity";
import { TravelDetails } from "./travelDetails.entity";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import { Notification } from "../../entities/notification/notification.entity";
import { Chat } from "../../entities/chat/chat.entity";
import { Room } from "../../entities/chat/room.entity";
import { Rating } from "../../entities/ratings/rating.entity";

@ObjectType()
@Entity("travel")
export class Travel extends Base {
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
  @Column({ type: "enum", enum: Role, default: Role.TRAVEL })
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
  @Column({ name: "vehicle_type" })
  vehicleType: string;
  @Field()
  @Column({ name: "connects", nullable: true })
  connects: number;

  @Field()
  @Column({ name: "available", default: true })
  available: boolean;

  @Field({ nullable: true })
  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @Field(() => Location)
  @OneToOne(() => Location, (location) => location.travel, { cascade: true })
  location: Location;

   @Field(() => Rating, { nullable: true })
    @OneToMany(() => Rating, (rating) => rating.travel, { cascade: true })
    ratings: Rating;


  @Field(() => [TravelKyc])
  @OneToMany(() => TravelKyc, (kyc) => kyc.travels, { cascade: true })
  kyc: TravelKyc[];

  @Field(() => TravelDetails)
  @OneToOne(() => TravelDetails, (details) => details.travelz, {
    cascade: true,
  })
  details: TravelDetails;

  @Field(() => RequestTravel)
  @ManyToOne(() => RequestTravel, (requestedTravel) => requestedTravel.travel, {
    onDelete: "CASCADE",
  })
  requestedTravel: RequestTravel;

  @Field(() => [Notification])
  @OneToMany(
    () => Notification,
    (notifications) => notifications.receiverTravel,
    {
      onDelete: "CASCADE",
    },
  )
  notifications: Notification[];
  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.senderTravel, {
    onDelete: "CASCADE",
  })
  notification: Notification[];

  @OneToMany(() => Chat, (chat) => chat.senderTravel)
  sendMessage: Chat[];
  @OneToMany(() => Chat, (chat) => chat.receiverTravel)
  receiveMessage: Chat[];

  @OneToMany(() => Room, (room) => room.travel)
  travels: Room[];
}
