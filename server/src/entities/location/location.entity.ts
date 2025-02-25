import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { Hotel } from "../../entities/hotels/hotel.entity";

@ObjectType()
@Entity("location")
export class Location extends Base {
  @Field()
  @Column({ name: "latitude", type:"float" })
  latitude: number;

  @Field()
  @Column({ name: "longitude", type:"float" })
  longitude: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => Guide, { nullable: true })
  @OneToOne(() => Guide, (guide) => guide.location, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;

  @Field()
  @OneToOne(() => Travel, (travel) => travel.location, { onDelete: "CASCADE", nullable:true })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;

  @Field()
  @OneToOne(() => Hotel, (hotel) => hotel.location, { onDelete: "CASCADE", nullable:true })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
