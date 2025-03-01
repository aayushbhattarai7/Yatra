import UserService from "../service/user.service";
import { StatusCodes } from "../constant/StatusCodes";
import { type Request, type Response } from "express";

const userService = new UserService();
export class UserController {
  async paymentForTravelWithEsewa(req: Request, res: Response) {
    try {
      const userId = req.user?.id
              const { token, requestId } = req.body;

      const data = await userService.advancePaymentForTravelWithEsewa(userId as string,requestId, token);
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
