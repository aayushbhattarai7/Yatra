import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../base.entity";
import { Guide } from "./guide.entity";

@ObjectType()
@Entity("guide_details")
export class GuideDetails extends Base {
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
  @Column({ name: "license_number" })
  licenseNumber: string;

  @Field()
  @Column({ name: "license_validity_from" })
  licenseValidityFrom: string;

  @Field()
  @Column({ name: "license_validity_to" })
  licenseValidityTo: string;

  @Field({nullable:true})
  @Column({ name: "citizenship_id", nullable: true })
  citizenshipId: string;

  @Field({nullable:true})
  @Column({ name: "citizenship_issue_date", nullable: true })
  citizenshipIssueDate: Date;

  @Field({nullable:true})
  @Column({ name: "citizenship_issue_from", nullable: true })
  citizenshipIssueFrom: string;

  @Field({nullable:true})
  @Column({ name: "passport_id", nullable: true })
  passportId: string;

  @Field({nullable:true})
  @Column({ name: "passport_issue_date", nullable: true })
  passportIssueDate: Date;

  @Field({nullable:true})
  @Column({ name: "passport_expiry_date", nullable: true })
  passportExpiryDate: Date;

  @Field({nullable:true})
  @Column({ name: "passport_issue_from", nullable: true })
  passportIssueFrom: string;

  @Field({nullable:true})
  @Column({ name: "voter_id", nullable: true })
  voterId: string;

  @Field({nullable:true})
  @Column({ name: "voter_address", nullable: true })
  voterAddress: string;

  @Field(() => Guide)
  @OneToOne(() => Guide, (guide) => guide.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "travel_id" })
  guide: Guide;
}
