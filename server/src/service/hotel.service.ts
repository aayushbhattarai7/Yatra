import HttpException from "../utils/HttpException.utils";
import { passwordRegex } from "../utils/regex.utils";
import { emailRegex } from "../utils/regex.utils";
import { GuideDTO } from "../dto/guide.dto";
import { AppDataSource } from "../config/database.config";
import { Guide } from "../entities/guide/guide.entity";
import bcryptService from "./bcrypt.service";
import GuideKYC from "../entities/guide/guideKyc.entity";
import OtpService from "../utils/otp.utils";
import { HashService } from "./hash.service";
import { Gender, RequestStatus, Role, RoomType } from "../constant/enum";
import { Location } from "../entities/location/location.entity";
import { LocationDTO } from "../dto/location.dto";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { io } from "../socket/socket";
import { Hotel } from "../entities/hotels/hotel.entity";
import { HotelDetails } from "../entities/hotels/hotelDetails.entity";
import { HotelDTO } from "../dto/hotel.dto";
import HotelKyc from "../entities/hotels/hotelKyc.entity";
import { HotelRoomDTO } from "../dto/hotelRoom.dto";
import { HotelRoom } from "../entities/hotels/hotelRoom.entity";
const hashService = new HashService();
const otpService = new OtpService();
class HotelService {
  constructor(
    private readonly hotelRepo = AppDataSource.getRepository(Hotel),
    private readonly locationRepo = AppDataSource.getRepository(Location),
    private readonly hotelDetailsRepo = AppDataSource.getRepository(
      HotelDetails,
    ),
    private readonly guideRequestRepo = AppDataSource.getRepository(
      RequestGuide,
    ),

    private readonly hotelKycRepo = AppDataSource.getRepository(HotelKyc),
    private readonly hotelRoomRepo = AppDataSource.getRepository(HotelRoom),
  ) {}

  async create(image: any[], data: HotelDTO): Promise<Hotel> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          const emailExist = await transactionalEntityManager.findOne(
            this.hotelRepo.target,
            {
              where: { email: data.email },
            },
          );
          if (emailExist)
            throw HttpException.badRequest(
              "Entered email is already registered",
            );

          if (!emailRegex.test(data.email)) {
            throw HttpException.badRequest("Please enter a valid email");
          }
          if (!passwordRegex.test(data.password)) {
            throw HttpException.badRequest(
              "Password requires an uppercase, digit, and special char.",
            );
          }
          const otp = await otpService.generateOTP();
          const expires = Date.now() + 5 * 60 * 1000;
          const payload = `${data.email}.${otp}.${expires}`;
          const hashedOtp = hashService.hashOtp(payload);
          const newOtp = `${hashedOtp}.${expires}`;
          const hotel = transactionalEntityManager.create(
            this.hotelRepo.target,
            {
              email: data.email,
              password: await bcryptService.hash(data.password),
              hotelName: data.hotelName,
              role: Role.HOTEL,
              phoneNumber: data.phoneNumber,
              otp: newOtp,
            },
          );
          const saves = await transactionalEntityManager.save(
            this.hotelRepo.target,
            hotel,
          );
          const hoteldetails = transactionalEntityManager.create(
            this.hotelDetailsRepo.target,
            {
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
            },
          );
          await transactionalEntityManager.save(
            this.hotelDetailsRepo.target,
            hoteldetails,
          );
          if (!hotel) {
            throw HttpException.badRequest("Error Occured");
          } else {
            if (image) {
              const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
              for (const key in image) {
                const file = image[key];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                  throw new Error(
                    "Invalid image type. Only jpg, jpeg, and png are accepted.",
                  );
                }
                const kyc = transactionalEntityManager.create(
                  this.hotelKycRepo.target,
                  {
                    name: file.name,
                    mimetype: file.mimetype,
                    type: file.type,
                    fileType: file.fileType,
                    hotel: saves,
                  },
                );
                const savedImage = await transactionalEntityManager.save(
                  this.hotelKycRepo.target,
                  kyc,
                );
                console.log("Saved Image:", savedImage);

                savedImage.transferHotelKycToUpload(saves.id, savedImage.type);
              }

              await otpService.sendOtp(hotel.email, otp, expires);
            } else {
              throw HttpException.badRequest(
                "Pleas provide all necessary items.",
              );
            }
          }

          return hotel;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw HttpException.badRequest(error?.message);
          } else {
            throw HttpException.internalServerError;
          }
        }
      },
    );
  }

  async reSendOtp(email: string): Promise<string> {
    try {
      if (!email) {
        throw HttpException.notFound("Email not found");
      }
      const hotel = await this.hotelRepo.findOneBy({ email });
      if (!hotel) throw HttpException.unauthorized("You are not authorized");
      if (hotel.verified)
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      const otp = await otpService.generateOTP();
      const expires = Date.now() + 5 * 60 * 1000;
      const payload = `${email}.${otp}.${expires}`;
      const hashedOtp = hashService.hashOtp(payload);
      const newOtp = `${hashedOtp}.${expires}`;

      await this.hotelRepo.update({ email }, { otp: newOtp });
      await otpService.sendOtp(hotel.email, otp, expires);
      return `Otp sent to ${email} successfully`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async verifyUser(email: string, otp: string): Promise<string> {
    try {
      const hotel = await this.hotelRepo.findOneBy({ email });
      if (!hotel) throw HttpException.unauthorized("You are not authorized");

      console.log(otp, "kaa");
      if (hotel.verified === true) {
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      }
      const [hashedOtp, expires] = hotel?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException.badRequest("Otp ie expired");

      const payload = `${email}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid) throw HttpException.badRequest("Invalid OTP");
      await this.hotelRepo.update({ email }, { verified: true });
      return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async login(data: HotelDTO) {
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
        throw HttpException.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );
      if (!hotel.verified) {
        throw HttpException.badRequest(
          "You are not verified, please verify your email first",
        );
      }

      if (!hotel.approved) {
        throw HttpException.badRequest(
          "Your account is not approved yet please wait less than 24 hours to get approval",
        );
      }
      const passwordMatched = await bcryptService.compare(
        data.password,
        hotel.password,
      );
      if (!passwordMatched) {
        throw HttpException.badRequest("Password didnot matched");
      }
      return hotel;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async addHotelRoom(hotel_id: string, data: HotelRoomDTO) {
    try {
      const hotel = await this.hotelRepo.findOneBy({ id: hotel_id });
      if (!hotel) throw HttpException.unauthorized("You are not authorized");

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
}
export default HotelService;
