import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import { TrekkingPlace } from "../../entities/place/trekkingplace.entity";

@ObjectType()
@Entity("place_rating")
export class PlaceRating extends Base {
  @Field()
  @Column({ name: "rating", type: "float" })
  rating: number;

  @Field()
  @Column({ name: "message" })
  message: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.placeRating, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => TrekkingPlace, { nullable: true })
  @ManyToOne(() => TrekkingPlace, (place) => place.ratings, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "place_id" })
  place: TrekkingPlace;

}
