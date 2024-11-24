import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import Base from "../base.entity";
import { User } from "./user.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { RequestStatus, Role } from "../../constant/enum";
@Entity("request_travel")
export class RequestTravel extends Base {
  @Column({ name: "from" })
  from: string;

  @Column({ name: "to" })
  to: string;

  @Column({ name: "total_days" })
  totalDays: number;

  @Column({ name: "total_people" })
  totalPeople: number;

  @Column({ name: "vehicle_type" })
  vehicletype: string;

  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  travelStatus: RequestStatus;

  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  userStatus: RequestStatus;

  @Column({ name: "price", nullable: true })
  price: string;

  @Column({
    name: "last_action_by",
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  lastActionBy: Role;

  @ManyToOne(() => User, (user) => user.requestTravel, { cascade: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Travel, (travel) => travel.requestedTravel, {
    cascade: true,
  })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;
}
