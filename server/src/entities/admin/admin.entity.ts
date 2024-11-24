import { Column, Entity, OneToMany } from "typeorm";
import Base from "../base.entity";
import { Role } from "../../constant/enum";
@Entity("admin")
export class Admin extends Base {
  @Column({ name: "full_name" })
  name: string;

  @Column({ type: "enum", enum: Role, default: Role.ADMIN })
  role: Role;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "password", select: false })
  password: string;
}
