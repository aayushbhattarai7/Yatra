import { Column, Entity, OneToMany } from "typeorm";
import Base from "../base.entity";
import { Role } from "../../constant/enum";
import { Field, ObjectType } from "type-graphql";
import { Notification } from "../../entities/notification/notification.entity";

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

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.senderAdmin, {
    onDelete: "CASCADE",
  })
  notification: Notification[];


  @Field(() => [Notification])
  @OneToMany(() => Notification,(notifications) => notifications.receiverAdmin, {onDelete: "CASCADE"})
  notifications: Notification[];
}
