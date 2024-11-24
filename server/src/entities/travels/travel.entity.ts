import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender, Role, Status } from "../../constant/enum";
import { Location } from "../location/location.entity";
import TravelKyc from "./travelKyc.entity";
import { TravelDetails } from "./travelDetails.entity";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
@Entity("travel")
export class Travel extends Base {
  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name", nullable: true })
  middleName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ type: "enum", enum: Role, default: Role.TRAVEL })
  role: Role;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

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

  @Column({ name: "vehicle_type" })
  vehicleType: string;

  @Column({ name: "available", default: true })
  available: boolean;

  @Column({ name: "approve_status", nullable: true })
  approveStatus: string;

  @OneToOne(() => Location, (location) => location.travel, { cascade: true })
  location: Location;

  @OneToMany(() => TravelKyc, (kyc) => kyc.travels, { cascade: true })
  kyc: TravelKyc;

  @OneToOne(() => TravelDetails, (details) => details.travelz, {
    cascade: true,
  })
  details: TravelDetails;

  @ManyToOne(() => RequestTravel, (requestedTravel) => requestedTravel.travel, {
    onDelete: "CASCADE",
  })
  requestedTravel: RequestTravel;
}
