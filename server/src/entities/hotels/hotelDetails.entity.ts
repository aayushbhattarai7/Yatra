import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Hotel } from "./hotel.entity";
@Entity("hotel_details")
export class HotelDetails extends Base {
  @Column({ name: "pan_issue_date" })
  pan_issue_date: String;

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

  @Column({ name: "pan_number" })
  panNumber: string;

  @Column({ name: "name_of_tax_payer" })
  nameOfTaxPayer: string;

  @Column({ name: "business_name" })
  businessName: string;

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

  @OneToOne(() => Hotel, (hotel) => hotel.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
