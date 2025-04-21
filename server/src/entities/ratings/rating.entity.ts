import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import Base from "../base.entity";
import { User } from "../user/user.entity";
import { Guide } from "../guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";

@ObjectType()
@Entity("rating")
export class Rating extends Base {
  @Field()
  @Column({ name: "rating", type: "float" })
  rating: number;

  @Field()
  @Column({ name: "message" })
  message: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.rating, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => Guide, { nullable: true })
  @ManyToOne(() => Guide, (guide) => guide.ratings, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;

  @Field(() => Travel, { nullable: true })
  @ManyToOne(() => Travel, (travel) => travel.ratings, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "travel_id" })
  travel: Travel;
}
