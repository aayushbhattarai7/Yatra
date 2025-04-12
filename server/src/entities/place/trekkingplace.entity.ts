import { Entity, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Base from "../base.entity";
import PlaceImage from "./PlaceImages.entity";
import { FavouritPlace } from "./placefavourite.entity";
import { PlaceRating } from "../../entities/ratings/place.rating.entity";

@ObjectType()
@Entity("place")
export class TrekkingPlace extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;

  @Field()
  @Column({ name: "price" })
  price: string;

  @Field()
  @Column({ name: "location" })
  location: string;

  @Field()
  @Column({ name: "duration" })
  duration: string;

  @Field()
  @Column({ name: "latitude" })
  latitude: string;

  
  @Field()
  @Column({ name: "longitude", nullable:true })
  longitude: string;

  @Field({nullable:true})
  @Column({ name: "overall_rating", type: "float", nullable:true })
  overallRating: number;


  @Field(() => [PlaceImage])
  @OneToMany(() => PlaceImage, (images) => images.TrekkingPlace, {
    cascade: true,
  })
  images: PlaceImage[];

  @Field(() => [FavouritPlace])
  @OneToMany(() => FavouritPlace, (favourite) => favourite.place, {
    cascade: true,
  })
  favourite: FavouritPlace[];

   @Field(() => [PlaceRating])
    @OneToMany(() => PlaceRating, (rating) => rating.place, { cascade: true })
    ratings: PlaceRating[];
}
