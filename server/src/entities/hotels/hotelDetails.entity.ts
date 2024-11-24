import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../base.entity";
import { Hotel } from "./hotel.entity";

@ObjectType()
@Entity("hotel_details")
export class HotelDetails extends Base {
  @Field()
  @Column({ name: "pan_issue_date" })
  pan_issue_date: String;

  @Field()
  @Column({ name: "province" })
  province: string;

  @Field()
  @Column({ name: "district" })
  district: string;

  @Field()
  @Column({ name: "municipality" })
  municipality: string;

  @Field()
  @Column({ name: "citizenship_id", nullable: true })
  citizenshipId: string;

  @Field()
  @Column({ name: "citizenship_issue_date", nullable: true })
  citizenshipIssueDate: Date;

  @Field()
  @Column({ name: "citizenship_issue_from", nullable: true })
  citizenshipIssueFrom: string;

  @Field()
  @Column({ name: "pan_number" })
  panNumber: string;

  @Field()
  @Column({ name: "name_of_tax_payer" })
  nameOfTaxPayer: string;

  @Field()
  @Column({ name: "business_name" })
  businessName: string;

  @Field()
  @Column({ name: "passport_id", nullable: true })
  passportId: string;

  @Field()
  @Column({ name: "passport_issue_date", nullable: true })
  passportIssueDate: Date;

  @Field()
  @Column({ name: "passport_expiry_date", nullable: true })
  passportExpiryDate: Date;

  @Field()
  @Column({ name: "passport_issue_from", nullable: true })
  passportIssueFrom: string;

  @Field()
  @Column({ name: "voter_id", nullable: true })
  voterId: string;

  @Field()
  @Column({ name: "voter_address", nullable: true })
  voterAddress: string;

  @Field(() => Hotel)
  @OneToOne(() => Hotel, (hotel) => hotel.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
