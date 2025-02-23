import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class PaymentDetails {
  @Field()
  transaction_uuid: string;

  @Field()
  signature: string;

  @Field()
  amount: number;

  @Field()
  tax_amount: number;

  @Field()
  total_amount: number;

  @Field()
  product_code: string;

  @Field()
  success_url: string;

  @Field()
  failure_url: string;
}
