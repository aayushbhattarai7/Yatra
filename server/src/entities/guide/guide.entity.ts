import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import GuideKYC from "./guideKyc.entity";
import { GuideDetails } from "./guideDetails.entity";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
@Entity("guide")
export class Guide extends Base {
  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name", nullable: true })
  middleName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ type: "enum", enum: Role, default: Role.GUIDE })
  role: Role;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @Column({ name: "guiding_location", nullable: true })
  guiding_location: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ name: "password", select: false })
  password: string;

  @Column({ name: "otp", nullable: true })
  otp: string;

  @Column({ name: "verified", default: false })
  verified: boolean;

  @Column({ name: "approved", default: false })
  approved: boolean;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  approval: Status;

  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @OneToOne(() => Location, (location) => location.guide, { cascade: true })
  location: Location;

  @OneToOne(() => GuideDetails, (details) => details.guide, { cascade: true })
  details: GuideDetails;

  @OneToMany(() => GuideKYC, (kyc) => kyc.guide, { cascade: true })
  kyc: GuideKYC;

  @ManyToOne(() => RequestGuide, (requestedGuide) => requestedGuide.guide, {
    onDelete: "CASCADE",
  })
  requestedGuide: RequestGuide;
}
