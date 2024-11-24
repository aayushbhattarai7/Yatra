import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Hotel } from "../../entities/hotels/hotel.entity";
@Entity("book_hotel")
export class BookHotel extends Base {
  @Column({ name: "from" })
  from: string;

  @Column({ name: "to" })
  to: string;

  @Column({ name: "total_days" })
  totalDays: number;

  @Column({ name: "total_people" })
  totalPeople: number;

  @Column({ name: "room_size" })
  roomSIze: number;

  @OneToOne(() => User, (user) => user.bookHotel, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;
}
