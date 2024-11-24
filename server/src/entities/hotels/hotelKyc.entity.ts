import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { FileType, MediaType } from "../../constant/enum";
import { Hotel } from "./hotel.entity";
import path from "path";
import fs from "fs";
import {
  getTempFolderPathForHotel,
  getUploadFolderpathForHotel,
} from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
@Entity("hotelKyc")
class HotelKyc extends Base {
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

  @ManyToOne(() => Hotel, (hotel) => hotel.kyc, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel;

  public path: string;

  transferHotelKycToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForHotel(), this.name);
    const UPLOAD_PATH = path.join(
      getUploadFolderpathForHotel(),
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
export default HotelKyc;
