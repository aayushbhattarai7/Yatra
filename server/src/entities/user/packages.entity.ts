import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { PackageStatus } from "../../constant/enum";

@ObjectType()
@Entity("travel_packages")
export class TravelPackages extends Base {
  @Field()
  @Column({ name: "from" })
  from: string;

  @Field()
  @Column({ name: "to" })
  to: string;

  @Field()
  @Column({ name: "total_days" })
  totalDays: number;

  @Field()
  @Column({ name: "total_people" })
  totalPeople: number;

  @Field()
  @Column({ name: "booked_people" })
  bookedPeople: number;

  @Field()
  @Column({ name: "vehicle_type" })
  vehicleType: string;

  @Field()
  @Column({ type: "enum", enum: PackageStatus, default: PackageStatus.AVAILABLE })
  status: PackageStatus;

  @Field()
  @Column({ name: "price" })
  price: string;

  @Field({ nullable: true })
  @Column({ name: "advance_price", nullable: true })
  advancePrice: number;

  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.requestedTravel, {
    cascade: true,
  })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;
}
