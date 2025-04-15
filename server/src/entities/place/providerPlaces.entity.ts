import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Base from "../base.entity";
import PlaceImage from "./PlaceImages.entity";
import { TrekkingPlace } from "./trekkingplace.entity";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";

@ObjectType()
@Entity("provider_place")
export class ProviderPlace extends Base {
  @Field(() => TrekkingPlace)
  @ManyToOne(() => TrekkingPlace, (place) => place.providers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "place_id" })
  places: TrekkingPlace;

  @Field(() => Guide,{nullable:true})
  @ManyToOne(() => Guide, (guide) => guide.guidePlaces, { onDelete: "CASCADE", nullable:true })
  @JoinColumn({ name: "guide_id" })
  placeGuide: Guide;

  @Field(() => Travel,{nullable:true})
  @ManyToOne(() => Travel, (travel) => travel.travelPlaces, { onDelete: "CASCADE", nullable:true })
  @JoinColumn({ name: "travel_id" })
  placeTravel: Travel;
}
