import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { PaymentType, RequestStatus, Role } from "../../constant/enum";
import { Travel } from "../../entities/travels/travel.entity";

@ObjectType()
@Entity("notification")
export class Notification extends Base {
  @Field()
  @Column({ name: "message" })
  message: string;

  @Field()
@Column({ default: false })
    isRead: boolean;



  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notification, { cascade: true, nullable:true })
  @JoinColumn({ name: "sender_user_id" })
  senderUser: User;
  @Field(() => User)
  @ManyToOne(() => User, (users) => users.notifications, { cascade: true, nullable:true })
  @JoinColumn({ name: "receiver_user_id" })
  receiverUser: User;

  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.notification, { cascade: true, nullable:true })
  @JoinColumn({ name: "sender_guide_id" })
  senderGuide: Guide;
  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.notifications, { cascade: true })
  @JoinColumn({ name: "receiver_guide_id" })
  receiverGuide: Guide;
  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.notifications, { cascade: true })
  @JoinColumn({ name: "receiver_travel_id" })
  receiverTravel: Travel;
    
  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.notification, { cascade: true })
  @JoinColumn({ name: "sender_travel_id" })
  senderTravel: Travel;
}
