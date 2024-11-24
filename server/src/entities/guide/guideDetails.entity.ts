import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Guide } from "./guide.entity";
@Entity("guide_details")
export class GuideDetails extends Base {
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

  @Column({ name: "license_number" })
  licenseNumber: string;

  @Column({ name: "license_validity_from" })
  licenseValidityFrom: string;

  @Column({ name: "license_validity_to" })
  licenseValidityTo: string;

  @Column({ name: "citizenship_id", nullable: true })
  citizenshipId: string;

  @Column({ name: "citizenship_issue_date", nullable: true })
  citizenshipIssueDate: Date;

  @Column({ name: "citizenship_issue_from", nullable: true })
  citizenshipIssueFrom: string;

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

  @OneToOne(() => Guide, (guide) => guide.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "travel_id" })
  guide: Guide;
}
