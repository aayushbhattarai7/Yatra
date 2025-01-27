import { type Request, type Response } from "express";
import adminService from "../service/admin.service";
import { AdminDTO } from "../dto/admin.dto";
import { StatusCodes } from "../constant/StatusCodes";
import HttpException from "../utils/HttpException.utils";
import webTokenService from "../service/webToken.service";
import chatbotService from "../service/place.service";
export class AdminController {
  async createAdmin(req: Request, res: Response) {
    try {
      const data = await adminService.createAdmin(req.body as AdminDTO);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async loginAdmin(req: Request, res: Response) {
    try {
      const data = await adminService.loginAdmin(req.body as AdminDTO);
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          message: "LoggedIn Successfully",
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

  async getApproveRequestForGuide(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const data = await adminService.getGuideApprovalRequest(
        adminId as string,
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

  async getApproveRequestForTravel(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const data = await adminService.getTravelApprovalRequest(
        adminId as string,
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

  async approveRequest(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const travelId = req.params.id;
      const data = await adminService.approveTravel(
        adminId as string,
        travelId,
      );
      res
        .status(StatusCodes.SUCCESS)
        .json({ message: "Travel approved successfully", data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async approveGuideRequest(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const guideid = req.params.id;
      const data = await adminService.approveGuide(adminId as string, guideid);
      res
        .status(StatusCodes.SUCCESS)
        .json({ message: "Guide approved successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async rejectGuideRequest(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const guideid = req.params.id;
      const { message } = req.body;

      await adminService.rejectGuide(adminId as string, guideid, message);
      res
        .status(StatusCodes.SUCCESS)
        .json({ message: "Guide reject successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }

  async rejectTravelRequest(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const travelId = req.params.id;
      const { message } = req.body;
      console.log(req.body, "ka");
      await adminService.rejectTravel(adminId as string, travelId, message);
      res
        .status(StatusCodes.SUCCESS)
        .json({ message: "Travel reject successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
      }
    }
  }
}
