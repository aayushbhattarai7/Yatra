import UserService from "../service/user.service";
import { StatusCodes } from "../constant/StatusCodes";
import { type Request, type Response } from "express";
import { UserDTO } from "../dto/user.dto";
import webTokenService from "../service/webToken.service";
import { IsLatitude } from "class-validator";
import { LocationDTO } from "../dto/location.dto";
import { GuideRequestDTO } from "../dto/requestGuide.dto";
import { TravelRequestDTO } from "../dto/requestTravel.dto";
import { DotenvConfig } from "../config/env.config";
import Stripe from "stripe";
const userService = new UserService();
export class UserController {
  async create(req: Request, res: Response) {
    try {
      const data = await userService.signup(req.body as UserDTO);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error?.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await userService.login(req.body as UserDTO);
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      console.log("🚀 ~ UserController ~ login ~ tokens:", data.role);
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          message: "LoggedIn successfully",
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async addLocation(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const data = await userService.addLocation(
        user_id as string,
        req.body as LocationDTO,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async getLocation(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const data = await userService.getLocation(user_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async findGuide(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const data = await userService.findGuide(user_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async findTravel(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      console.log(req.body);
      const data = await userService.findTravel(user_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async requestGuide(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const guide_id = req.params.id;
      console.log(req.body);
      await userService.requestGuide(
        user_id as string,
        guide_id,
        req.body as GuideRequestDTO,
      );
      res.status(StatusCodes.SUCCESS).json({
        message:
          "Your request for a guide has been received. Please wait a moment for a response.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async requestTravel(req: Request, res: Response) {
    console.log("yessss", req.params.id, req.user?.id);
    try {
      const user_id = req.user?.id;
      console.log("🚀 ~ UserController ~ requestTravel ~ user_id:", user_id);
      const travel_id = req.params.id;
      // await userService.requestTravel(
      //   user_id as string,
      //   travel_id,
      //   req.body as TravelRequestDTO,
      // );
      res.status(StatusCodes.SUCCESS).json({
        message:
          "Your request for a travel has been received. Please wait a moment for a response.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async getTravelrequest(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const data = await userService.getOwnTravelRequests(user_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async getGuiderequest(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const data = await userService.getOwnGuideRequests(user_id as string);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Internal server error" });
      }
    }
  }

  async sendTravelPrice(req: Request, res: Response) {
    try {
      const user_id = req.user?.id as string;
      const requestId = req.params.id;
      console.log("🚀 ~ UserController ~ sendPrice ~ requestId:", requestId);
      const { price } = req.body;
      const data = await userService.sendTravelPrice(price, user_id, requestId);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async sendGuidePrice(req: Request, res: Response) {
    try {
      const user_id = req.user?.id as string;
      const requestId = req.params.id;
      const { price } = req.body;
      const data = await userService.sendGuidePrice(price, user_id, requestId);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async acceptTravelRequest(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const requestId = req.params.id;
      const data = await userService.acceptTravelRequest(
        user_id as string,
        requestId,
      );
      res
        .status(StatusCodes.SUCCESS)
        .json({ data, message: "Request accepted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
  async acceptGuideRequest(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const requestId = req.params.id;
      const data = await userService.acceptGuideRequest(
        user_id as string,
        requestId,
      );
      res
        .status(StatusCodes.SUCCESS)
        .json({ data, message: "Request accepted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async getTravelLocation(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const travel_id = req.params.id;

      const data = await userService.getTravelLocation(
        user_id as string,
        travel_id,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async getGuideLocation(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const guide_id = req.params.id;
      const data = await userService.getGuideLocation(
        user_id as string,
        guide_id,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async advancePaymentForTravel(req: Request, res: Response) {
    try {
      const userId = req.user?.id as string;
      const travelId = req.params.id;
      const { amount } = req.body;
      const data = userService.advancePaymentForTravel(
        userId,
        travelId,
        amount,
      );
      res
        .status(StatusCodes.SUCCESS)
        .json({ clientSecret: (await data).client_secret });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  }
}
