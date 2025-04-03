import userService from "../service/user.service";
import { StatusCodes } from "../constant/StatusCodes";
import { type Request, type Response } from "express";
import { ChatService } from "../service/chat.service";
import { UserDTO } from "../dto/user.dto";
const chatService = new ChatService();
export class UserController {
  async create(req: Request, res: Response) {
    try {
      const image = req.files?.map((file: any) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        }
      })
      const data = await userService.signup(req.body as UserDTO, image);
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
}
