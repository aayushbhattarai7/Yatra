"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const StatusCodes_1 = require("../constant/StatusCodes");
const enum_1 = require("../constant/enum");
const hotel_service_1 = __importDefault(require("../service/hotel.service"));
const webToken_service_1 = __importDefault(require("../service/webToken.service"));
const hotelService = new hotel_service_1.default();
class HotelController {
    async create(req, res) {
        try {
            const { kycType } = req.body;
            const uploadedPhotos = {
                passPhoto: req.files?.passPhoto?.[0]
                    ? {
                        name: req.files.passPhoto[0].filename,
                        mimetype: req.files.passPhoto[0].mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.PASSPHOTO,
                    }
                    : null,
                panCard: req.files?.panCard?.[0]
                    ? {
                        name: req.files.panCard[0].filename,
                        mimetype: req.files.panCard[0].mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.HOTELPANCARD,
                    }
                    : null,
            };
            if (kycType === enum_1.KycType.CITIZENSHIP) {
                const citizenshipFront = req.files?.citizenshipFront?.[0];
                const citizenshipBack = req.files?.citizenshipBack?.[0];
                uploadedPhotos.citizenshipFront = citizenshipFront
                    ? {
                        name: citizenshipFront.filename,
                        mimetype: citizenshipFront.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.CITIZENSHIPFRONT,
                    }
                    : null;
                uploadedPhotos.citizenshipBack = citizenshipBack
                    ? {
                        name: citizenshipBack.filename,
                        mimetype: citizenshipBack.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.CITIZENSHIPBACK,
                    }
                    : null;
            }
            else if (kycType === enum_1.KycType.PASSPORT) {
                const passport = req.files?.passport?.[0];
                uploadedPhotos.passport = passport
                    ? {
                        name: passport.filename,
                        mimetype: passport.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.PASSPORT,
                    }
                    : null;
            }
            else if (kycType === enum_1.KycType.VOTERCARD) {
                const voterCard = req.files?.voterCard?.[0];
                uploadedPhotos.voterCard = voterCard
                    ? {
                        name: voterCard.filename,
                        mimetype: voterCard.mimetype,
                        type: req.body.type,
                        fileType: enum_1.FileType.VOTERCARD,
                    }
                    : null;
            }
            else {
                return res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: "Invalid KYC type provided.",
                });
            }
            console.log(uploadedPhotos);
            const details = await hotelService.create(uploadedPhotos, req.body);
            res.status(StatusCodes_1.StatusCodes.CREATED).json({
                status: true,
                details,
                message: "Hotel is registered successfully",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: error?.message,
                });
            }
        }
    }
    async reSendOtp(req, res) {
        try {
            const { email } = req.body;
            const data = await hotelService.reSendOtp(email);
            res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
                status: true,
                data,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: error?.message,
                });
            }
        }
    }
    async verifyUser(req, res) {
        try {
            const { email } = req.body;
            const { otp } = req.body;
            console.log(req.body);
            const data = await hotelService.verifyUser(email, otp);
            res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
                status: true,
                data,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: error?.message,
                });
            }
        }
    }
    async login(req, res) {
        try {
            const data = await hotelService.login(req.body);
            const tokens = webToken_service_1.default.generateTokens({
                id: data.id,
            }, data.role);
            res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
                data: {
                    id: data.id,
                    firstName: data?.hotelName,
                    email: data?.email,
                    phoneNumber: data.phoneNumber,
                    verified: data.verified,
                    approved: data.approved,
                    tokens: {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                    message: "Loggedin successfully",
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: error?.message,
                });
            }
        }
    }
    async addHotelRoom(req, res) {
        try {
            const hotel_id = req.user?.id;
            const data = await hotelService.addHotelRoom(hotel_id, req.body);
            res.status(StatusCodes_1.StatusCodes.SUCCESS).json({ data });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes_1.StatusCodes.BAD_REQUEST).json({
                    message: error?.message,
                });
            }
        }
    }
}
exports.HotelController = HotelController;
