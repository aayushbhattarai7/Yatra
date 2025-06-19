import { Request, Response } from "express";
import placeService from "../service/place.service";
import { PlaceDTO } from "../dto/place.dto";
import { StatusCodes } from "../constant/StatusCodes";

export class AdminController {
  async addPlaces(req: Request, res: Response) {
    console.log(req.body, "ha");
    try {
      const admin_id = req.user?.id;
      const data = req.files?.map((file: any) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        };
      });
      console.log("🚀 ~ AdminController ~ data ~ data:", data);
      const trekkingPlace = await placeService.addTrekkingPlace(
        admin_id as string,
        req.body as PlaceDTO,
        data,
      );
      res.status(StatusCodes.CREATED).json({ trekkingPlace });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to add place");
      }
    }
  }
}
