import { Field, ObjectType } from "type-graphql";

@ObjectType()
class RevenueEntry {
  @Field()
  name: string;

  @Field()
  revenue: number;
}

@ObjectType()
export class RevenueGroupedResponse {
  @Field(() => [RevenueEntry])
  daily: RevenueEntry[];

  @Field(() => [RevenueEntry])
  weekly: RevenueEntry[];

  @Field(() => [RevenueEntry])
  monthly: RevenueEntry[];

  @Field(() => [RevenueEntry])
  yearly: RevenueEntry[];
}
