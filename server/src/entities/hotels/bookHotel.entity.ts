import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Hotel } from "../../entities/hotels/hotel.entity";

@ObjectType()
@Entity("book_hotel")
export class BookHotel extends Base {
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
  @Column({ name: "room_size" })
  roomSIze: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.bookHotel, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => Hotel)
  @ManyToOne(() => Hotel, (hotel) => hotel.book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
