import { TrekkingPlace } from "../entities/place/trekkingplace.entity";
import { AppDataSource } from "../config/database.config";
import { PlaceDTO } from "../dto/place.dto";
import HttpException from "../utils/HttpException.utils";
import PlaceImage from "../entities/place/PlaceImages.entity";
import { Admin } from "../entities/admin/admin.entity";

class PlaceService {
  constructor(
    private readonly placeImageRepo = AppDataSource.getRepository(PlaceImage),
    private readonly adminrepo = AppDataSource.getRepository(Admin),
    private readonly trekkingPlaceRepo = AppDataSource.getRepository(
      TrekkingPlace,
    ),
  ) {}

  async addTrekkingPlace(
    admin_id: string,
    data: PlaceDTO,
    image: any[],
  ): Promise<string> {
    try {
      const admin = await this.adminrepo.findOneBy({
        id: admin_id,
      });
      if (!admin) throw HttpException.unauthorized("You are not authorized");
      return await AppDataSource.transaction(
        async (transactionalEntityManager) => {
          const trekkingPlace = this.trekkingPlaceRepo.create({
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
          });
          const savePlace = await transactionalEntityManager.save(
            this.trekkingPlaceRepo.target,
            trekkingPlace,
          );
          if (image) {
            const allowedMimeTypes = [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
              "image/bmp",
              "image/tiff",
              "video/mp4",
              "video/ogg",
              "video/webm",
              "video/quicktime",
              "video/x-msvideo",
              "video/x-matroska",
            ];
            for (const key in image) {
              const file = image[key];
              if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error(
                  "Invalid image type. Only jpg, jpeg, and png are accepted.",
                );
              }
              const images = transactionalEntityManager.create(
                this.placeImageRepo.target,
                {
                  name: file.name,
                  mimetype: file.mimetype,
                  type: file.type,
                  TrekkingPlace: savePlace,
                },
              );
              const savedImage = await transactionalEntityManager.save(
                this.placeImageRepo.target,
                images,
              );
              console.log("🚀 ~ PlaceService ~ savedImage:", savedImage);

              savedImage.transferImageToUpload(
                trekkingPlace.id,
                savedImage.type,
              );
            }
          }

          return "Place successfully added";
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getPlaces() {
    try {
      const places = await this.trekkingPlaceRepo.find({
        relations: ["images"],
      });
      return places;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async getTrekkingPlaceByMessage(message: string): Promise<TrekkingPlace> {
    try {
      const trekkingPlace = await this.trekkingPlaceRepo
        .createQueryBuilder("place")
        .where(":message ILIKE '%' || place.name || '%'", { message })
        .getOne();

      if (!trekkingPlace) {
        throw HttpException.notFound("No trekking place found in the message");
      }
      return trekkingPlace;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}

export default new PlaceService();
