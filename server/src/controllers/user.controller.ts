import userService from "../service/user.service";
import { StatusCodes } from "../constant/StatusCodes";
import { type Request, type Response } from "express";
import { ChatService } from "../service/chat.service";
import { UserDTO } from "../dto/user.dto";
const chatService = new ChatService();
export class UserController {
  async create(req: Request, res: Response) {
    try {
      const profileImage = req.files?.profile?.[0];
      const coverImage = req.files?.cover?.[0];
      const image = {
        profile: profileImage
          ? {
              name: profileImage.filename,
              mimetype: profileImage.mimetype,
              path: profileImage.path,
            }
          : null,
        cover: coverImage
          ? {
              name: coverImage.filename,
              mimetype: coverImage.mimetype,
              path: coverImage.path,
            }
          : null,
      };
      console.log(req.body, "-body");
      const data = await userService.signup(req.body as UserDTO, image as any);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
    }
  }
  async updateprofile(req: Request, res: Response) {
    const id = req.user?.id as string;
    console.log("🚀 ~ UserController ~ updateprofile ~ id:", id);
    try {
      const profileImage = req.files?.profile?.[0];
      const coverImage = req.files?.cover?.[0];
      const image = {
        profile: profileImage
          ? {
              name: profileImage.filename,
              mimetype: profileImage.mimetype,
              path: profileImage.path,
            }
          : null,
        cover: coverImage
          ? {
              name: coverImage.filename,
              mimetype: coverImage.mimetype,
              path: coverImage.path,
            }
          : null,
      };
      const data = await userService.updateProfile(
        id,
        req.body as UserDTO,
        image as any,
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error?.message,
        });
    }
  }

  async paymentForTravelWithEsewa(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;

      const data = await userService.advancePaymentForTravelWithEsewa(
        userId as string,
        requestId,
        token,
      );
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async chatWithTravel(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const travelId = req.params.id;
      const { message } = req.body;
      const data = await chatService.chatWithTravel(
        userId as string,
        travelId,
        message,
      );
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForGuideWithEsewa(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForGuideWithEsewa ~ requestId:",
        requestId,
      );

      const data = await userService.advancePaymentForGuideWithEsewa(
        userId as string,
        requestId,
        token,
      );
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForTravelWithKhalti(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { pidx, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForTravelWithKhalti ~ requestId:",
        requestId,
      );

      const data = await userService.advancePaymentForTravelWithKhalti(
        userId as string,
        requestId,
        pidx,
      );
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async paymentForGuideWithKhalti(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { token, requestId } = req.body;
      console.log(
        "🚀 ~ UserController ~ paymentForGuideWithEsewa ~ requestId:",
        requestId,
      );

      const data = await userService.advancePaymentForGuideWithEsewa(
        userId as string,
        requestId,
        token,
      );
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }

    async reportTravel(req: Request, res: Response) {
      try {
        const userId = req.user?.id as string;
        console.log("🚀 ~ UserController ~ reportTravel ~ userId:", req.files)
        const travelId = req.params.id;
        const {message} = req.body
        const data = req.files?.map((file: any) => {
          return {
            name: file?.filename,
            mimetype: file?.mimetype,
            type: req.body?.type,
          }
        })
        const details = await userService.reportTravel(
          userId,
          travelId,
          message,
          data as any,
        
        );
        res.status(StatusCodes.CREATED).json({
          status: true,
          details,
          message: "Guide is registered successfully",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: error?.message,
          });
        }
      }
    }
    async reportGuide(req: Request, res: Response) {
      try {
        const userId = req.user?.id as string;
        const guideId = req.params.id;
        const {message} = req.body
        const data = req.files?.map((file: any) => {
          return {
            name: file?.filename,
            mimetype: file?.mimetype,
            type: req.body?.type,
          }
        })
        const details = await userService.reportGuide(
          userId,
          guideId,
          message,
          data as any,
        
        );
        res.status(StatusCodes.CREATED).json({
          status: true,
          details,
          message: "Guide is registered successfully",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: error?.message,
          });
        }
      }
    }
}
