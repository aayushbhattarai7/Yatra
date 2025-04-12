import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import ReportFile from "./reportFile.entity";
import { ReportStatus } from "../../constant/enum";

@ObjectType()
@Entity("report")
export class Report extends Base {
  @Field()
  @Column({ name: "message" })
  message: string;

  @Field({nullable:true})
  @Column({ name: "admin_response", nullable:true })
  adminResponse: string;
 
 @Field()
   @Column({ enum: ReportStatus, type: "enum", default:ReportStatus.PENDING })
   status: ReportStatus;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.report, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: "reporter_user_id" })
  reporterUser: User;
  @Field(() => User)
  @ManyToOne(() => User, (users) => users.reports, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: "reported_user_id" })
  reportedUser: User;

  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.report, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: "reporter_guide_id" })
  reporterGuide: Guide;
  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.reports, { cascade: true })
  @JoinColumn({ name: "reported_guide_id" })
  reportedGuide: Guide;
  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.reports, { cascade: true })
  @JoinColumn({ name: "reported_travel_id" })
  reportedTravel: Travel;

  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.report, { cascade: true })
  @JoinColumn({ name: "reporter_travel_id" })
  reporterTravel: Travel;

  @Field(()=>[ReportFile])
  @OneToMany(()=>ReportFile, (file)=> file.report, {cascade:true})
  file:ReportFile[]
}
