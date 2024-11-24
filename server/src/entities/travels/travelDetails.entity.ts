import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Travel } from "./travel.entity";
@Entity("travel_details")
export class TravelDetails extends Base {
  @Column({ name: "date_of_birth" })
  DOB: Date;

  @Column({ name: "nationality" })
  nationality: string;

  @Column({ name: "province" })
  province: string;

  @Column({ name: "district" })
  district: string;

  @Column({ name: "municipality" })
  municipality: string;

  @Column({ name: "citizenship_id", nullable: true })
  citizenshipId: string;

  @Column({ name: "citizenship_issue_date", nullable: true })
  citizenshipIssueDate: Date;

  @Column({ name: "citizenship_issue_from", nullable: true })
  citizenshipIssueFrom: string;

  @Column({ name: "engine_number" })
  engineNumber: string;

  @Column({ name: "chasis_number" })
  chasisNumber: string;

  @Column({ name: "vehicle_number" })
  vehicleNumber: string;

  @Column({ name: "passport_id", nullable: true })
  passportId: string;

  @Column({ name: "passport_issue_date", nullable: true })
  passportIssueDate: Date;

  @Column({ name: "passport_expiry_date", nullable: true })
  passportExpiryDate: Date;

  @Column({ name: "passport_issue_from", nullable: true })
  passportIssueFrom: string;

  @Column({ name: "voter_id", nullable: true })
  voterId: string;

  @Column({ name: "voter_address", nullable: true })
  voterAddress: string;

  @OneToOne(() => Travel, (travels) => travels.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "travel_id" })
  travelz: Travel;
}
