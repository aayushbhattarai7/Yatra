import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import Base from "../base.entity";

@ObjectType()
@Entity("support")
export class Support extends Base {
  @Field()
  @Column({ name: "name" })
  name: string;
  
  @Field()
  @Column({ name: "message" })
  message: string;

  @Field()
  @Column({ name: "email" })
  email: string;

}
