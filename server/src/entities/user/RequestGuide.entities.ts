import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "./user.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { RequestStatus, Role } from "../../constant/enum";
@Entity("request_guide")
//Cris334411#
export class RequestGuide extends Base {
  @Column({ name: "from" })
  from: string;

  @Column({ name: "to" })
  to: string;

  @Column({ name: "total_days" })
  totalDays: string;

  @Column({ name: "total_people" })
  totalPeople: string;

  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  guideStatus: RequestStatus;

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

  @ManyToOne(() => User, (users) => users.requestGuide, { cascade: true })
  @JoinColumn({ name: "user_id" })
  users: User;

  @ManyToOne(() => Guide, (guide) => guide.requestedGuide, { cascade: true })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;
}
