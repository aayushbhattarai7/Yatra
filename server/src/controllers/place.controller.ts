import { StatusCodes } from "../constant/StatusCodes";
import { Request, Response } from "express";
import chatbotService from "../service/place.service";
import { PlaceDTO } from "../dto/place.dto";
import placeService from "../service/place.service";
export class PlaceController {
  async addPlaces(req: Request, res: Response) {
    try {
      const admin_id = req.user?.id;
      const data = req.files?.map((file: any) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        };
      });
      const trekkingPlace = await chatbotService.addTrekkingPlace(
        admin_id as string,
        req.body as PlaceDTO,
        data,
      );
      console.log("yessss");
      res.status(StatusCodes.CREATED).json({ trekkingPlace });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to store place");
      }
    }
  }

  async getPlaces(_: Request, res: Response) {
    try {
      const data = await placeService.getPlaces();
      res.status(StatusCodes.CREATED).json({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
  async getTrekkingPlaceByMessage(req: Request, res: Response) {
    try {
      const { message } = req.body;
      const trekkingPlace =
        await chatbotService.getTrekkingPlaceByMessage(message);
      res.send(trekkingPlace);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(500).send("Failed to fetch trekking place");
      }
    }
  }
}
