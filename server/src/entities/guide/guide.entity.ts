import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import GuideKYC from "./guideKyc.entity";
import { GuideDetails } from "./guideDetails.entity";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { Notification } from "../../entities/notification/notification.entity";
import { Chat } from "../../entities/chat/chat.entity";
import { Room } from "../../entities/chat/room.entity";
import { Rating } from "../../entities/ratings/rating.entity";
import { Report } from "../../entities/user/report.entity";
import { ProviderPlace } from "../../entities/place/providerPlaces.entity";

@ObjectType()
@Entity("guide")
export class Guide extends Base {
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
  @Column({ type: "enum", enum: Role, default: Role.GUIDE })
  role: Role;

  @Field()
  @Column({ name: "email", unique: true })
  email: string;

  @Field()
  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Field({ nullable: true })
  @Column({ name: "guiding_location", nullable: true })
  guiding_location: string;

  @Field()
  @Column({ name: "connects", nullable: true })
  connects: number;

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
  @Column({ name: "available", default: true })
  available: boolean;

  @Field()
  @Column({ name: "verified", default: false })
  verified: boolean;

  @Field()
  @Column({ name: "approved", default: false })
  approved: boolean;

  @Field()
  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  approval: Status;

  @Field({ nullable: true })
  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @Field(() => Location, { nullable: true })
  @OneToOne(() => Location, (location) => location.guide, { cascade: true })
  location: Location;

  @Field(() => [Rating], { nullable: true })
  @OneToMany(() => Rating, (ratings) => ratings.guide, { cascade: true })
  ratings: Rating[];

  @Field(() => GuideDetails)
  @OneToOne(() => GuideDetails, (details) => details.guide, { cascade: true })
  details: GuideDetails;

  @Field(() => [GuideKYC])
  @OneToMany(() => GuideKYC, (kyc) => kyc.guide, { cascade: true })
  kyc: GuideKYC[];

  @Field(() => RequestGuide)
  @ManyToOne(() => RequestGuide, (requestedGuide) => requestedGuide.guide, {
    onDelete: "CASCADE",
  })
  requestedGuide: RequestGuide;

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.senderGuide, {
    onDelete: "CASCADE",
  })
  notification: Notification[];
  @Field(() => [Notification])
  @OneToMany(
    () => Notification,
    (notifications) => notifications.receiverGuide,
    {
      onDelete: "CASCADE",
    },
  )
  notifications: Notification[];

  @OneToMany(() => Chat, (chat) => chat.senderGuide)
  sendMessage: Chat[];
  @OneToMany(() => Chat, (chat) => chat.receiverGuide)
  receiveMessage: Chat[];

   @Field(() => [ProviderPlace])
    @OneToMany(() => ProviderPlace, (guidePlace) => guidePlace.placeGuide, {
      cascade: true,
    })
    guidePlaces: ProviderPlace[];
    
  @OneToMany(() => Room, (room) => room.guide)
  guides: Room[];

    @Field(() => [Report])
      @OneToMany(() => Report, (report) => report.reporterGuide, {
        onDelete: "CASCADE",
      })
      report: Report[];
    
      @Field(() => [Report])
      @OneToMany(() => Report, (reports) => reports.reportedGuide, {
        onDelete: "CASCADE",
      })
      reports: Report[];
}
