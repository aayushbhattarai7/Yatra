import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Base from "../../entities/base.entity";
import { FileType, MediaType } from "../../constant/enum";
import { User } from "./user.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForReport,
  getUploadFolderpathForUser,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
import { Report } from "./report.entity";

@ObjectType()
@Entity("report_file")
class ReportFile extends Base {
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
  @Column({ enum: MediaType, type: "enum", default:MediaType.REPORT })
  type: MediaType;

  @Field(() => Report)
  @ManyToOne(() => Report, (report) => report.file, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "report_id" })
  report: Report;

  @Field()
  public path: string;

  transferImageToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForReport(), this.name);
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
export default ReportFile;
