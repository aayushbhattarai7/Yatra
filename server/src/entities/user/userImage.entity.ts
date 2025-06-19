import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../../entities/base.entity";
import { FileType, MediaType } from "../../constant/enum";
import { User } from "./user.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForGuide,
  getTempFolderPathForUser,
  getUploadFolderpathForGuide,
  getUploadFolderpathForUser,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";

@ObjectType()
@Entity("user_image")
class UserImage extends Base {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({
    name: "mimetype",
    nullable: true,
  })
  mimetype: string;

  @Field()
  @Column({ enum: MediaType, type: "enum" })
  type: MediaType;

  @Field({ nullable: true })
  @Column({ enum: FileType, type: "enum", nullable: true })
  fileType: FileType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field()
  public path: string;

  transferImageToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForUser(), this.name);
    const UPLOAD_PATH = path.join(
      getUploadFolderpathForUser(),
      type.toLowerCase(),
      this.id.toString(),
    );
    !fs.existsSync(UPLOAD_PATH) &&
      fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name));
  }

  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`;
  }
}
export default UserImage;
