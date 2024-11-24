import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../base.entity";
import { Travel } from "./travel.entity";

@ObjectType()
@Entity("travel_details")
export class TravelDetails extends Base {
  @Field()
  @Column({ name: "date_of_birth" })
  DOB: Date;

  @Field()
  @Column({ name: "nationality" })
  nationality: string;

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
  @Column({ name: "engine_number" })
  engineNumber: string;

  @Field()
  @Column({ name: "chasis_number" })
  chasisNumber: string;

  @Field()
  @Column({ name: "vehicle_number" })
  vehicleNumber: string;

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

  @Field(() => Travel)
  @OneToOne(() => Travel, (travels) => travels.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "travel_id" })
  travelz: Travel;
}
