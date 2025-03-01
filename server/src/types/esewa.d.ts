declare module "esewajs" {
  export function EsewaPaymentGateway(
    amount: number,
    taxAmount: number,
    serviceCharge: number,
    deliveryCharge: number,
    productId: string,
    merchantId: string,
    secret: string,
    successUrl: string,
    failureUrl: string,
    baseUrl: string,
  ): Promise<{ request: { res: { responseUrl: string } } }>;

  export function EsewaCheckStatus(
    amount: number,
    productId: string,
    merchantId: string,
    statusUrl: string,
  ): Promise<{ status: number }>;
}
