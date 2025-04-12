import { Column, Entity, OneToMany } from "typeorm";
import Base from "../base.entity";
import { Role } from "../../constant/enum";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity("admin")
export class Admin extends Base {
  @Field()
  @Column({ name: "full_name" })
  name: string;

  @Field()
  @Column({ type: "enum", enum: Role, default: Role.ADMIN })
  role: Role;

  @Field()
  @Column({ name: "email", unique: true })
  email: string;

  @Field()
  @Column({ name: "password", select: false })
  password: string;
}
