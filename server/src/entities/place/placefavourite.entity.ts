import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Base from "../base.entity";
import PlaceImage from "./PlaceImages.entity";
import { TrekkingPlace } from "./trekkingplace.entity";
import { User } from "../../entities/user/user.entity";

@ObjectType()
@Entity("favourite_place")
export class FavouritPlace extends Base {
  @Field(() => TrekkingPlace)
  @ManyToOne(() => TrekkingPlace, (place) => place.favourite, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "place_id" })
  place: TrekkingPlace;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.favourite, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
