"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trekkingplace_entity_1 = require("../entities/place/trekkingplace.entity");
const database_config_1 = require("../config/database.config");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const PlaceImages_entity_1 = __importDefault(require("../entities/place/PlaceImages.entity"));
const admin_entity_1 = require("../entities/admin/admin.entity");
const message_1 = require("../constant/message");
const user_entity_1 = require("../entities/user/user.entity");
const placefavourite_entity_1 = require("../entities/place/placefavourite.entity");
class PlaceService {
    placeImageRepo;
    adminrepo;
    userrepo;
    favouritePlaceRepo;
    trekkingPlaceRepo;
    constructor(placeImageRepo = database_config_1.AppDataSource.getRepository(PlaceImages_entity_1.default), adminrepo = database_config_1.AppDataSource.getRepository(admin_entity_1.Admin), userrepo = database_config_1.AppDataSource.getRepository(user_entity_1.User), favouritePlaceRepo = database_config_1.AppDataSource.getRepository(placefavourite_entity_1.FavouritPlace), trekkingPlaceRepo = database_config_1.AppDataSource.getRepository(trekkingplace_entity_1.TrekkingPlace)) {
        this.placeImageRepo = placeImageRepo;
        this.adminrepo = adminrepo;
        this.userrepo = userrepo;
        this.favouritePlaceRepo = favouritePlaceRepo;
        this.trekkingPlaceRepo = trekkingPlaceRepo;
    }
    async addTrekkingPlace(admin_id, data, image) {
        try {
            const admin = await this.adminrepo.findOneBy({
                id: admin_id,
            });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            return await database_config_1.AppDataSource.transaction(async (transactionalEntityManager) => {
                const trekkingPlace = this.trekkingPlaceRepo.create({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    location: data.location,
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
                const savePlace = await transactionalEntityManager.save(this.trekkingPlaceRepo.target, trekkingPlace);
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
                            throw new Error("Invalid image type. Only jpg, jpeg, and png are accepted.");
                        }
                        const images = transactionalEntityManager.create(this.placeImageRepo.target, {
                            name: file.name,
                            mimetype: file.mimetype,
                            type: file.type,
                            TrekkingPlace: savePlace,
                        });
                        const savedImage = await transactionalEntityManager.save(this.placeImageRepo.target, images);
                        console.log("🚀 ~ PlaceService ~ savedImage:", savedImage);
                        savedImage.transferImageToUpload(trekkingPlace.id, savedImage.type);
                    }
                }
                return "Place successfully added";
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getPlaces() {
        try {
            const places = await this.trekkingPlaceRepo.find({
                relations: ["images"],
            });
            return places;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async deletePlace(admin_id, placeId) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: admin_id });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
            if (!place)
                throw HttpException_utils_1.default.notFound("Place not found");
            await this.trekkingPlaceRepo.delete({ id: placeId });
            return (0, message_1.deletedMessage)("place");
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getTrekkingPlaceByMessage(message) {
        try {
            const trekkingPlace = await this.trekkingPlaceRepo
                .createQueryBuilder("place")
                .where(":message ILIKE '%' || place.name || '%'", { message })
                .getOne();
            if (!trekkingPlace) {
                throw HttpException_utils_1.default.notFound("No trekking place found in the message");
            }
            return trekkingPlace;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async addPlaceToFavourite(userId, placeId) {
        try {
            const user = await this.userrepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            console.log("🚀 ~ PlaceService ~ addPlaceToFavourite ~ user:", user);
            const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
            if (!place)
                throw HttpException_utils_1.default.notFound("Place not found");
            const isFavourite = await this.favouritePlaceRepo.findOne({ where: {
                    user: { id: userId }, place: { id: placeId }
                }, relations: ["place", "user"] });
            console.log("🚀 ~ PlaceService ~ addPlaceToFavourite ~ isFavourite:", isFavourite);
            if (isFavourite) {
                console.log("vamo");
                await this.favouritePlaceRepo.delete({ id: isFavourite.id });
                return `Place removed from favourite`;
            }
            else {
                const addToFavourite = this.favouritePlaceRepo.create({
                    user,
                    place
                });
                await this.favouritePlaceRepo.save(addToFavourite);
                return `Place added to favourite`;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async removePlaceToFavourite(userId, placeId) {
        console.log("🚀 ~ PlaceService ~ removePlaceToFavourite ~ placeId:", placeId);
        try {
            const user = await this.userrepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const place = await this.trekkingPlaceRepo.findOneBy({ id: placeId });
            if (!place)
                throw HttpException_utils_1.default.notFound("Place not found");
            const isFavourite = await this.favouritePlaceRepo.findOneBy({ user: { id: userId }, place: { id: placeId } });
            if (!isFavourite)
                throw HttpException_utils_1.default.notFound("Favourite place not found");
            await this.favouritePlaceRepo.delete({ id: isFavourite.id });
            return `Place removed from favourite`;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async getFavouritePlace(userId) {
        console.log("🚀 ~ PlaceService ~ getFavouritePlace ~ userId:", userId);
        try {
            const user = await this.userrepo.findOneBy({ id: userId });
            if (!user)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const getFavoutite = await this.favouritePlaceRepo.find({ where: { user: { id: userId } }, relations: ["user", "place", "place.images"] });
            console.log("🚀 ~ PlaceService ~ getFavouritePlace ~ getFavoutite:", getFavoutite);
            return getFavoutite;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
}
exports.default = new PlaceService();
