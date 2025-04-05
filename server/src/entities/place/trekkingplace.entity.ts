import { Entity, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Base from "../base.entity";
import PlaceImage from "./PlaceImages.entity";

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
  @Column({ name: "longitude" })
  longitude: string;

  @Field(() => [PlaceImage]) // ✅ Array of images
  @OneToMany(() => PlaceImage, (images) => images.TrekkingPlace, {
    cascade: true,
  })
  images: PlaceImage[];
}
