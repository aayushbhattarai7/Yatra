import { Field } from "type-graphql";

export class LocationDTO {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
