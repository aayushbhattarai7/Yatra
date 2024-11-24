import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { MediaType } from "../../constant/enum";
import { TrekkingPlace } from "./trekkingplace.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForPlace,
  getUploadFolderpathForplace,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
@Entity("placesImages")
class PlaceImage extends Base {
  @Column({ nullable: true })
  name: string;

  @Column({
    name: "mimetype",
    nullable: true,
  })
  mimetype: string;

  @Column({ enum: MediaType, type: "enum" })
  type: MediaType;

  @ManyToOne(() => TrekkingPlace, (TrekkingPlace) => TrekkingPlace.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "TrekkingPlace_id" })
  TrekkingPlace: TrekkingPlace;

  public path: string;

  transferImageToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForPlace(), this.name);
    const UPLOAD_PATH = path.join(
      getUploadFolderpathForplace(),
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
export default PlaceImage;
