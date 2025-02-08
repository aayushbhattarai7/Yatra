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
import { Gender, RequestStatus, Role } from "../constant/enum";
// import { Location } from "../entities/location/location.entity";
import { GuideDetails } from "../entities/guide/guideDetails.entity";
import { LocationDTO } from "../dto/location.dto";
import { RequestGuide } from "../entities/user/RequestGuide.entities";
import { io } from "../socket/socket";
import { LoginDTO } from "../dto/login.dto";
import { Message, rejectRequest } from "../constant/message";
import { In, Not } from "typeorm";
const hashService = new HashService();
const otpService = new OtpService();
class GuideService {
  constructor(
    private readonly guideRepo = AppDataSource.getRepository(Guide),
    // private readonly locationRepo = AppDataSource.getRepository(Location),
    private readonly guideDetailsrepo = AppDataSource.getRepository(
      GuideDetails,
    ),
    private readonly guideRequestRepo = AppDataSource.getRepository(
      RequestGuide,
    ),

    private readonly guideKycRepo = AppDataSource.getRepository(GuideKYC),
  ) {}

  async create(image: any[], data: GuideDTO): Promise<Guide> {
    console.log(image, "shdhshghghfgdfdf");
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          const emailExist = await transactionalEntityManager.findOne(
            this.guideRepo.target,
            {
              where: { email: data.email },
            },
          );
          if (emailExist)
            throw HttpException.badRequest(
              "Entered email is already registered",
            );
          if (!data.email || !data.firstName || !data.lastName)
            throw HttpException.badRequest(
              "Please fill all the required fields",
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
          const guide = transactionalEntityManager.create(
            this.guideRepo.target,
            {
              email: data.email,
              password: await bcryptService.hash(data.password),
              firstName: data.firstName,
              middleName: data?.middleName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              gender: Gender[data.gender as keyof typeof Gender],
              otp: newOtp,
            },
          );
          const saves = await transactionalEntityManager.save(
            this.guideRepo.target,
            guide,
          );
          const guidedetails = transactionalEntityManager.create(
            this.guideDetailsrepo.target,
            {
              DOB: data.DOB,
              nationality: data.nationality,
              province: data.province,
              district: data.district,
              municipality: data.municipality,
              licenseNumber: data.licenseNumber,
              licenseValidityFrom: data.licenseValidityFrom,
              licenseValidityTo: data.licenseValidityTo,
              citizenshipId: data?.citizenshipId,
              citizenshipIssueDate: data?.citizenshipIssueDate,
              citizenshipIssueFrom: data?.citizenshipIssueFrom,
              passportId: data?.passportId,
              passportIssueDate: data?.passportIssueDate,
              passportExpiryDate: data?.passportExpiryDate,
              passportIssueFrom: data?.passportIssueFrom,
              voterId: data?.voterId,
              voterAddress: data?.voterAddress,
              guide: guide,
            },
          );
          await transactionalEntityManager.save(
            this.guideDetailsrepo.target,
            guidedetails,
          );
          if (!guide) {
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
                  this.guideKycRepo.target,
                  {
                    name: file.name,
                    mimetype: file.mimetype,
                    type: file.type,
                    fileType: file.fileType,
                    guide: saves,
                  },
                );
                const savedImage = await transactionalEntityManager.save(
                  this.guideKycRepo.target,
                  kyc,
                );
                console.log("Saved Image:", savedImage);

                savedImage.transferKycToUpload(saves.id, savedImage.type);
              }

              await otpService.sendOtp(guide.email, otp, expires);
            } else {
              throw HttpException.badRequest(
                "Pleas provide all necessary items.",
              );
            }
          }

          return guide;
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
      const guide = await this.guideRepo.findOneBy({ email });
      if (!guide) throw HttpException.unauthorized("You are not authorized");
      if (guide.verified)
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      const otp = await otpService.generateOTP();
      const expires = Date.now() + 5 * 60 * 1000;
      const payload = `${email}.${otp}.${expires}`;
      const hashedOtp = hashService.hashOtp(payload);
      const newOtp = `${hashedOtp}.${expires}`;

      await this.guideRepo.update({ email }, { otp: newOtp });
      await otpService.sendOtp(guide.email, otp, expires);
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
      const guide = await this.guideRepo.findOneBy({ email });
      if (!guide) throw HttpException.unauthorized("You are not authorized");

      if (guide.verified === true) {
        throw HttpException.badRequest(
          "You are already verified please wait for the approval",
        );
      }
      const [hashedOtp, expires] = guide?.otp?.split(".");
      if (Date.now() > +expires)
        throw HttpException.badRequest("Otp ie expired");

      const payload = `${email}.${otp}.${expires}`;
      const isOtpValid = otpService.verifyOtp(hashedOtp, payload);
      if (!isOtpValid) throw HttpException.badRequest("Invalid OTP");
      await this.guideRepo.update({ email }, { verified: true });
      return `Your verification was successful! Please allow up to 24 hours for admin approval.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error?.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async loginGuide(data: LoginDTO) {
    try {
      const guide = await this.guideRepo.findOne({
        where: [{ email: data.email }],
        select: [
          "id",
          "email",
          "password",
          "phoneNumber",
          "approved",
          "verified",
          "firstName",
          "middleName",
          "lastName",
          "role",
        ],
      });
      if (!guide)
        throw HttpException.notFound(
          "Invalid Email, Entered Email is not registered yet",
        );
      if (!guide.verified) {
        throw HttpException.badRequest(
          "You are not verified, please verify your email first",
        );
      }

      if (!guide.approved) {
        throw HttpException.badRequest(
          "Your account is not approved yet please wait less than 24 hours to get approval",
        );
      }
      const passwordMatched = await bcryptService.compare(
        data.password,
        guide.password,
      );
      if (!passwordMatched) {
        throw HttpException.badRequest("Password didnot matched");
      }
      return guide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  // async addLocation(guide_id: string, data: LocationDTO) {
  //   try {
  //     const guide = await this.guideRepo.findOneBy({ id: guide_id });
  //     if (!guide) throw HttpException.unauthorized("you are not authorized");
  //     const isLocation = await this.locationRepo.findOneBy({
  //       guide: { id: guide_id },
  //     });
  //     if (isLocation) {
  //       const updateLocation = this.locationRepo.update(
  //         {
  //           id: isLocation.id,
  //           guide: { id: guide_id },
  //         },
  //         {
  //           latitude: data.latitude,
  //           longitude: data.longitude,
  //         },
  //       );
  //       return updateLocation;
  //     } else {
  //       const addLocation = this.locationRepo.create({
  //         latitude: data.latitude,
  //         longitude: data.longitude,
  //         guide: guide,
  //       });
  //       await this.locationRepo.save(addLocation);
  //       return addLocation;
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       throw HttpException.badRequest(error.message);
  //     } else {
  //       throw HttpException.internalServerError;
  //     }
  //   }
  // }

  async getRequests(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const requests = await this.guideRequestRepo.find({
        where: {
          guide: { id: guide_id },
          guideStatus: Not(
            In([
              RequestStatus.COMPLETED,
              RequestStatus.REJECTED,
              RequestStatus.CANCELLED,
            ]),
          ),
        },
        relations: ["users"],
      });

      return requests;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getGuideDetails(guide_id: string) {
    try {
      const guide = await this.guideRepo.findOne({
        where: {
          id: guide_id,
        },
        relations: ["details", "kyc"],
      });
      console.log("🚀 ~ GuideService ~ getGuideDetails ~ guide:", guide);
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      return guide;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async getHistory(guide_id: string) {
    console.log("🚀 ~ GuideService ~ getHistory ~ guide_id:", guide_id);
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.unauthorized("you are not authorized");
      }
      const requests = await this.guideRequestRepo.find({
        where: {
          guide: { id: guide_id },
          guideStatus: RequestStatus.COMPLETED,
        },
        relations: ["users"],
      });
      console.log("🚀 ~ GuideService ~ getHistory ~ requests:", requests);

      return requests;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async sendPrice(price: string, guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          price: price,
          lastActionBy: Role.GUIDE,
        },
      );
      return Message.priceSent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }

  async acceptRequest(guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          guideStatus: RequestStatus.ACCEPTED,

          lastActionBy: Role.GUIDE,
        },
      );
      await this.guideRepo.update(
        { id: guide_id },
        {
          available: false,
        },
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
  async rejectRequest(guide_id: string, requestId: string) {
    try {
      const guide = await this.guideRepo.findOneBy({ id: guide_id });
      if (!guide) {
        throw HttpException.badRequest("You are not authorized");
      }

      const requests = await this.guideRequestRepo.findOne({
        where: {
          guide: { id: guide_id },
          id: requestId,
        },
      });
      if (!requests) {
        throw HttpException.notFound("no request found");
      }
      const data = await this.guideRequestRepo.update(
        { id: requests.id },
        {
          guideStatus: RequestStatus.REJECTED,
          lastActionBy: Role.GUIDE,
        },
      );
      return rejectRequest("Guide");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("An error occured");
      }
    }
  }
}
export default GuideService;
