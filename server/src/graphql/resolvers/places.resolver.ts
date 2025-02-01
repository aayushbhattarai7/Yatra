import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Args,
} from "type-graphql";
import webTokenService from "../../service/webToken.service";
import { LoginResponse } from "../../graphql/schema/schema";
import { Guide } from "../../entities/guide/guide.entity";
import { Travel } from "../../entities/travels/travel.entity";
import HttpException from "../../utils/HttpException.utils";
import { Context } from "../../types/context";
import { authentication } from "../../middleware/authentication.middleware";
import { authorization } from "../../middleware/authorization.middleware";
import { Role } from "../../constant/enum";
import { RequestGuide } from "../../entities/user/RequestGuide.entities";
import { RequestTravel } from "../../entities/user/RequestTravels.entity";
import adminService from "../../service/admin.service";
import { Admin } from "../../entities/admin/admin.entity";
import { Message } from "../../constant/message";
import { TrekkingPlace } from "../../entities/place/trekkingplace.entity";
import placeService from "../../service/place.service";
import { PlaceDTO } from "../../dto/place.dto";

@Resolver((of) => TrekkingPlace)
export class PlaceResolver {
  @Mutation(() => String)
  @UseGuards(Admin) 
  async addTrekkingPlace(
    @Args("admin_id") admin_id: string,
    @Args("data") data: PlaceDTO,
    @Args({ name: "image", type: () => const [GraphQLUpload], nullable: true })
    image: FileUpload[],
  ): Promise<string> {
    return placeService.addTrekkingPlace(admin_id, data, image);
  }
}

function UseGuards(AdminGuard: any): (target: PlaceResolver, propertyKey: "addTrekkingPlace", descriptor: TypedPropertyDescriptor<(admin_id: string, data: PlaceDTO, image: FileUpload[]) => Promise<string>>) => void | TypedPropertyDescriptor<...> {
    throw new Error("Function not implemented.");
}
  