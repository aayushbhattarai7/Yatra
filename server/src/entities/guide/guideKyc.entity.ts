import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { FileType, MediaType } from "../../constant/enum";
import { Guide } from "./guide.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForGuide,
  getUploadFolderpathForGuide,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
@Entity("guidekyc")
class GuideKYC extends Base {
  @Column({ nullable: true })
  name: string;

  @Column({
    name: "mimetype",
    nullable: true,
  })
  mimetype: string;

  @Column({ enum: MediaType, type: "enum" })
  type: MediaType;

  @Column({ enum: FileType, type: "enum", nullable: true })
  fileType: FileType;

  @ManyToOne(() => Guide, (guide) => guide.kyc, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "guide_id" })
  guide: Guide;

  public path: string;

  transferKycToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForGuide(), this.name);
    const UPLOAD_PATH = path.join(
      getUploadFolderpathForGuide(),
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
export default GuideKYC;
