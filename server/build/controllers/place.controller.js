"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
const StatusCodes_1 = require("../constant/StatusCodes");
const place_service_1 = __importDefault(require("../service/place.service"));
const place_service_2 = __importDefault(require("../service/place.service"));
class PlaceController {
    async addPlaces(req, res) {
        try {
            const admin_id = req.user?.id;
            const data = req.files?.map((file) => {
                return {
                    name: file?.filename,
                    mimetype: file?.mimetype,
                    type: req.body?.type,
                };
            });
            const trekkingPlace = await place_service_1.default.addTrekkingPlace(admin_id, req.body, data);
            console.log("yessss");
            res.status(StatusCodes_1.StatusCodes.CREATED).json({ trekkingPlace });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).send({ message: error.message });
            }
            else {
                res.status(500).send("Failed to store place");
            }
        }
    }
    async getPlaces(_, res) {
        try {
            const data = await place_service_2.default.getPlaces();
            res.status(StatusCodes_1.StatusCodes.CREATED).json({ data });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).send({ message: error.message });
            }
            else {
                res.status(500).send("Failed to fetch trekking place");
            }
        }
    }
    async getTrekkingPlaceByMessage(req, res) {
        try {
            const { message } = req.body;
            const trekkingPlace = await place_service_1.default.getTrekkingPlaceByMessage(message);
            res.send(trekkingPlace);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).send({ message: error.message });
            }
            else {
                res.status(500).send("Failed to fetch trekking place");
            }
        }
    }
}
exports.PlaceController = PlaceController;
