import { ObjectType, Field, ID } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from "typeorm";
import { randomUUID } from "crypto";

@ObjectType()
@Entity()
abstract class Base extends BaseEntity {
  @Field(() => ID)
  @Column({ name: "id", primary: true, type: "uuid" })
  id: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created-at", type: "timestamp with time zone"  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;

  @BeforeInsert()
  generateUUID() {
    this.id = randomUUID();
  }
}

export default Base;
