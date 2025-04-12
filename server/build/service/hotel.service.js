"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const regex_utils_1 = require("../utils/regex.utils");
const regex_utils_2 = require("../utils/regex.utils");
const database_config_1 = require("../config/database.config");
const bcrypt_service_1 = __importDefault(require("./bcrypt.service"));
const otp_utils_1 = __importDefault(require("../utils/otp.utils"));
const hash_service_1 = require("./hash.service");
const enum_1 = require("../constant/enum");
const location_entity_1 = require("../entities/location/location.entity");
const RequestGuide_entities_1 = require("../entities/user/RequestGuide.entities");
const hotel_entity_1 = require("../entities/hotels/hotel.entity");
const hotelDetails_entity_1 = require("../entities/hotels/hotelDetails.entity");
const hotelKyc_entity_1 = __importDefault(require("../entities/hotels/hotelKyc.entity"));
const hotelRoom_entity_1 = require("../entities/hotels/hotelRoom.entity");
const hashService = new hash_service_1.HashService();
const otpService = new otp_utils_1.default();
class HotelService {
    hotelRepo;
    locationRepo;
    hotelDetailsRepo;
    guideRequestRepo;
    hotelKycRepo;
    hotelRoomRepo;
    constructor(hotelRepo = database_config_1.AppDataSource.getRepository(hotel_entity_1.Hotel), locationRepo = database_config_1.AppDataSource.getRepository(location_entity_1.Location), hotelDetailsRepo = database_config_1.AppDataSource.getRepository(hotelDetails_entity_1.HotelDetails), guideRequestRepo = database_config_1.AppDataSource.getRepository(RequestGuide_entities_1.RequestGuide), hotelKycRepo = database_config_1.AppDataSource.getRepository(hotelKyc_entity_1.default), hotelRoomRepo = database_config_1.AppDataSource.getRepository(hotelRoom_entity_1.HotelRoom)) {
        this.hotelRepo = hotelRepo;
        this.locationRepo = locationRepo;
        this.hotelDetailsRepo = hotelDetailsRepo;
        this.guideRequestRepo = guideRequestRepo;
        this.hotelKycRepo = hotelKycRepo;
        this.hotelRoomRepo = hotelRoomRepo;
    }
    async create(image, data) {
        return await database_config_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            try {
                const emailExist = await transactionalEntityManager.findOne(this.hotelRepo.target, {
                    where: { email: data.email },
                });
                if (emailExist)
                    throw HttpException_utils_1.default.badRequest("Entered email is already registered");
                if (!regex_utils_2.emailRegex.test(data.email)) {
                    throw HttpException_utils_1.default.badRequest("Please enter a valid email");
                }
                if (!regex_utils_1.passwordRegex.test(data.password)) {
                    throw HttpException_utils_1.default.badRequest("Password requires an uppercase, digit, and special char.");
                }
                const otp = await otpService.generateOTP();
                const expires = Date.now() + 5 * 60 * 1000;
                const payload = `${data.email}.${otp}.${expires}`;
                const hashedOtp = hashService.hashOtp(payload);
                const newOtp = `${hashedOtp}.${expires}`;
                const hotel = transactionalEntityManager.create(this.hotelRepo.target, {
                    email: data.email,
                    password: await bcrypt_service_1.default.hash(data.password),
                    hotelName: data.hotelName,
                    role: enum_1.Role.HOTEL,
                    phoneNumber: data.phoneNumber,
                    otp: newOtp,
                });
                const saves = await transactionalEntityManager.save(this.hotelRepo.target, hotel);
                const hoteldetails = transactionalEntityManager.create(this.hotelDetailsRepo.target, {
                    pan_issue_date: data.pan_issue_date,
                    province: data.province,
                    district: data.district,
                    municipality: data.municipality,
                    citizenshipId: data?.citizenshipId,
                    citizenshipIssueDate: data?.citizenshipIssueDate,
                    citizenshipIssueFrom: data?.citizenshipIssueFrom,
                    panNumber: data.panNumber,
                    nameOfTaxPayer: data.nameOfTaxPayer,
                    businessName: data.businessName,
                    passportId: data?.passportId,
                    passportIssueDate: data?.passportIssueDate,
                    passportExpiryDate: data?.passportExpiryDate,
                    passportIssueFrom: data?.passportIssueFrom,
                    voterId: data?.voterId,
                    voterAddress: data?.voterAddress,
                    hotel: hotel,
                });
                await transactionalEntityManager.save(this.hotelDetailsRepo.target, hoteldetails);
                if (!hotel) {
                    throw HttpException_utils_1.default.badRequest("Error Occured");
                }
                else {
                    if (image) {
                        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
                        for (const key in image) {
                            const file = image[key];
                            if (!allowedMimeTypes.includes(file.mimetype)) {
                                throw new Error("Invalid image type. Only jpg, jpeg, and png are accepted.");
                            }
                            const kyc = transactionalEntityManager.create(this.hotelKycRepo.target, {
                                name: file.name,
                                mimetype: file.mimetype,
                                type: file.type,
                                fileType: file.fileType,
                                hotel: saves,
                            });
                            const savedImage = await transactionalEntityManager.save(this.hotelKycRepo.target, kyc);
                            console.log("Saved Image:", savedImage);
                            savedImage.transferHotelKycToUpload(saves.id, savedImage.type);
                        }
                        await otpService.sendOtp(hotel.email, otp, expires);
                    }
                    else {
                        throw HttpException_utils_1.default.badRequest("Pleas provide all necessary items.");
                    }
                }
                return hotel;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw HttpException_utils_1.default.badRequest(error?.message);
                }
                else {
                    throw HttpException_utils_1.default.internalServerError;
                }
            }
        });
    }
    async reSendOtp(email) {
        try {
            if (!email) {
                throw HttpException_utils_1.default.notFound("Email not found");
            }
            const hotel = await this.hotelRepo.findOneBy({ email });
            if (!hotel)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            if (hotel.verified)
                throw HttpException_utils_1.default.badRequest("You are already verified please wait for the approval");
            const otp = await otpService.generateOTP();
            const expires = Date.now() + 5 * 60 * 1000;
            const payload = `${email}.${otp}.${expires}`;
            const hashedOtp = hashService.hashOtp(payload);
            const newOtp = `${hashedOtp}.${expires}`;
            await this.hotelRepo.update({ email }, { otp: newOtp });
            await otpService.sendOtp(hotel.email, otp, expires);
            return `Otp sent to ${email} successfully`;
        }
        catch (error) {
            if (error instanceof Error) {
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async verifyUser(email, otp) {
        try {
            const hotel = await this.hotelRepo.findOneBy({ email });
            if (!hotel)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            console.log(otp, "kaa");
            if (hotel.verified === true) {
                throw HttpException_utils_1.default.badRequest("You are already verified please wait for the approval");
            }
            const [hashedOtp, expires] = hotel?.otp?.split(".");
            if (Date.now() > +expires)
                throw HttpException_utils_1.default.badRequest("Otp ie expired");
            const payload = `${email}.${otp}.${expires}`;
            const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
            if (!isOtpValid)
                throw HttpException_utils_1.default.badRequest("Invalid OTP");
            await this.hotelRepo.update({ email }, { verified: true });
            return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                throw HttpException_utils_1.default.badRequest(error?.message);
            }
            else {
                throw HttpException_utils_1.default.internalServerError;
            }
        }
    }
    async login(data) {
        try {
            console.log(data, "adtadta");
            const hotel = await this.hotelRepo.findOne({
                where: [{ email: data.email }],
                select: [
                    "id",
                    "email",
                    "password",
                    "phoneNumber",
                    "approved",
                    "verified",
                    "hotelName",
                    "role",
                ],
            });
            if (!hotel)
                throw HttpException_utils_1.default.notFound("Invalid Email, Entered Email is not registered yet");
            if (!hotel.verified) {
                throw HttpException_utils_1.default.badRequest("You are not verified, please verify your email first");
            }
            if (!hotel.approved) {
                throw HttpException_utils_1.default.badRequest("Your account is not approved yet please wait less than 24 hours to get approval");
            }
            const passwordMatched = await bcrypt_service_1.default.compare(data.password, hotel.password);
            if (!passwordMatched) {
                throw HttpException_utils_1.default.badRequest("Password didnot matched");
            }
            return hotel;
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
    async addHotelRoom(hotel_id, data) {
        try {
            const hotel = await this.hotelRepo.findOneBy({ id: hotel_id });
            if (!hotel)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            // const room = this.hotelRoomRepo.create({
            //   roomType: RoomType[data.roomType as keyof typeof RoomType],
            //   roomDescription: data.roomDescription,
            //   isAttachedBathroom: data.isAttachedBathroom,
            //   maxOccupancy: data.maxOccupancy,
            //   roomSize: data.roomSize,
            //   Amenities: data.Amenities,
            //   pricePerNight: data.pricePerNight,
            //   isAvailable: data.isAvailable,
            //   hotels: hotel,
            // });
            // await this.hotelRoomRepo.save(room);
            return;
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
exports.default = HotelService;
