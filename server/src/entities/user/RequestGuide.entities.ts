import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "./user.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { PaymentType, RequestStatus, Role } from "../../constant/enum";

@ObjectType()
@Entity("request_guide")
export class RequestGuide extends Base {
  @Field()
  @Column({ name: "from" })
  from: string;

  @Field()
  @Column({ name: "to" })
  to: string;

  @Field()
  @Column({ name: "total_days" })
  totalDays: string;

  @Field()
  @Column({ name: "total_people" })
  totalPeople: string;

  @Field()
  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;
  @Column({ type: "enum", enum: PaymentType, nullable:true })
  paymentType: PaymentType;
  @Field({ nullable: true })
  @Column({ name: "price", nullable: true })
  price: string;

  @Field()
  @Column({
    name: "last_action_by",
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  lastActionBy: Role;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.requestGuide, { cascade: true })
  @JoinColumn({ name: "user_id" })
  users: User;

  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.requestedGuide, { cascade: true })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;
}
