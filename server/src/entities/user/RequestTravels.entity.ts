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

  @Field()
  @Column({ name: "total_people" })
  totalPeople: number;

  @Field()
  @Column({ name: "vehicle_type" })
  vehicletype: string;

  @Field()
  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  travelStatus: RequestStatus;

  @Field()
  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  userStatus: RequestStatus;

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
