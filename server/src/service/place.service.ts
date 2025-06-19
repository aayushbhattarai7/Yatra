import { TrekkingPlace } from "../entities/place/trekkingplace.entity";
import { AppDataSource } from "../config/database.config";
import { PlaceDTO } from "../dto/place.dto";
import HttpException from "../utils/HttpException.utils";
import PlaceImage from "../entities/place/PlaceImages.entity";
import { Admin } from "../entities/admin/admin.entity";
import { deletedMessage } from "../constant/message";
import { User } from "../entities/user/user.entity";
import { FavouritPlace } from "../entities/place/placefavourite.entity";

class PlaceService {
  constructor(
    private readonly placeImageRepo = AppDataSource.getRepository(PlaceImage),
    private readonly adminrepo = AppDataSource.getRepository(Admin),
    private readonly userrepo = AppDataSource.getRepository(User),
    private readonly favouritePlaceRepo = AppDataSource.getRepository(
      FavouritPlace,
    ),
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
        relations: ["images","ratings"],
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

  async getTopPlaces() {
    try {
      const topPlaces = await this.trekkingPlaceRepo.find({
        relations: ["images"],
        order: { overallRating: "DESC" },
        take: 3,
      });
  
      return topPlaces;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  
  
  
  async deletePlace(admin_id: string, placeId: string) {
    try {
      const admin = await this.adminrepo.findOneBy({ id: admin_id });
      if (!admin) throw HttpException.unauthorized("You are not authorized");

      const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
      if (!place) throw HttpException.notFound("Place not found");
      await this.trekkingPlaceRepo.delete({ id: placeId });
      return deletedMessage("place");
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

  async addPlaceToFavourite(userId: string, placeId: string) {
    try {
      const user = await this.userrepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
      if (!place) throw HttpException.notFound("Place not found");
      const isFavourite = await this.favouritePlaceRepo.findOne({
        where: {
          user: { id: userId },
          place: { id: placeId },
        },
        relations: ["place", "user"],
      });
       
      if (isFavourite) {
        await this.favouritePlaceRepo.delete({ id: isFavourite.id });
        return `Place removed from favourite`;
      } else {
        const addToFavourite = this.favouritePlaceRepo.create({
          user,
          place,
        });
        await this.favouritePlaceRepo.save(addToFavourite);
        return `Place added to favourite`;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async removePlaceToFavourite(userId: string, placeId: string) {
    try {
      const user = await this.userrepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
      if (!place) throw HttpException.notFound("Place not found");
      const isFavourite = await this.favouritePlaceRepo.findOneBy({
        user: { id: userId },
        place: { id: placeId },
      });
      if (!isFavourite)
        throw HttpException.notFound("Favourite place not found");
      await this.favouritePlaceRepo.delete({ id: isFavourite.id });
      return `Place removed from favourite`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getFavouritePlace(userId: string) {
    console.log("🚀 ~ PlaceService ~ getFavouritePlace ~ userId:", userId)
    try {
      const user = await this.userrepo.findOneBy({ id: userId });
      if (!user) throw HttpException.unauthorized("You are not authorized");

      const getFavoutite = await this.favouritePlaceRepo.find({
        where: { user: { id: userId } },
        relations: ["user", "place", "place.images"],
      });
      console.log("🚀 ~ PlaceService ~ getFavouritePlace ~ getFavoutite:", getFavoutite)
      return getFavoutite;
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
