import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "./user.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { RequestStatus, Role } from "../../constant/enum";

@ObjectType()
@Entity("request_travel")
export class RequestTravel extends Base {
  @Field()
  @Column({ name: "from" })
  from: string;

  @Field()
  @Column({ name: "to" })
  to: string;

  @Field()
  @Column({ name: "total_days" })
  totalDays: number;

  @Field({ nullable: true })
  @Column({ name: "user_bargain", nullable: true })
  userBargain: number;
  @Field()
  @Column({ name: "travel_bargain", nullable: true })
  travelBargain: number;

  @Field()
  @Column({ name: "total_people" })
  totalPeople: number;

  @Field()
  @Column({ name: "vehicle_type" })
  vehicleType: string;

  @Field()
  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

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
  @ManyToOne(() => User, (user) => user.requestTravel, { cascade: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.requestedTravel, {
    cascade: true,
  })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;
}
