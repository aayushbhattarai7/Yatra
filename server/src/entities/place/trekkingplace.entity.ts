import { Entity, Column, OneToMany } from "typeorm";
import Base from "../base.entity";
import PlaceImage from "./PlaceImages.entity";

@Entity("place")
export class TrekkingPlace extends Base {
  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ name: "price" })
  price: string;

  @Column({ name: "location" })
  location: string;

  @Column({ name: "duration" })
  duration: string;

  @Column({ name: "latitude" })
  latitude: string;

  @Column({ name: "longitude" })
  longitude: string;

  @OneToMany(() => PlaceImage, (images) => images.TrekkingPlace, {
    cascade: true,
  })
  images: PlaceImage;
}
