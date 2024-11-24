import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { FileType, MediaType } from "../../constant/enum";
import { Travel } from "./travel.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForTravel,
  getUploadFolderpathForTravel,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
@Entity("travelkyc")
class TravelKyc extends Base {
  @Column({ nullable: true })
  name: string;

  @Column({
    name: "mimetype",
    nullable: true,
  })
  mimetype: string;

  @Column({ enum: MediaType, type: "enum" })
  type: MediaType;

  @Column({ enum: FileType, type: "enum" })
  fileType: FileType;

  @ManyToOne(() => Travel, (travels) => travels.kyc, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "travel_id" })
  travels: Travel;

  public path: string;

  transferTravelKycToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForTravel(), this.name);
    const UPLOAD_PATH = path.join(
      getUploadFolderpathForTravel(),
      type.toLowerCase(),
      this.id.toString(),
    );
    !fs.existsSync(UPLOAD_PATH) &&
      fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name));
    const paths = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`;
  }
  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`;
  }
}
export default TravelKyc;
