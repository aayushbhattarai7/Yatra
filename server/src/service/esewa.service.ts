import axios from 'axios';
import { EsewaUtil } from '../utils/generateHash';
import { DotenvConfig } from '../config/env.config';

export class EsewaService {
    async initializePayment(amount: number, transactionUuid: string) {
        const { signature, signedFields } = EsewaUtil.createSignature(amount, transactionUuid);

        return { signature, signedFields };
    }

    async verifyPayment(encodedData: string) {
        const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        const calculatedSignature = EsewaUtil.verifySignature(decodedData);
        if (calculatedSignature !== decodedData.signature) {
            throw new Error('Invalid signature');
        }

        const productCode = DotenvConfig.ESEWA_PRODUCT_CODE!;
        const gatewayUrl = DotenvConfig.ESEWAPAYMENT_URL!;

        const response = await axios.get(`${gatewayUrl}/api/epay/transaction/status/`, {
            params: {
                product_code: productCode,
                total_amount: decodedData.total_amount,
                transaction_uuid: decodedData.transaction_uuid
            }
        });
        console.log("🚀 ~ EsewaService ~ verifyPayment ~ response:", response)

        if (
            response.data.status !== "COMPLETE" ||
            response.data.transaction_uuid !== decodedData.transaction_uuid ||
            Number(response.data.total_amount) !== Number(decodedData.total_amount)
        ) {
            throw new Error('Payment verification failed');
        }

        return { verifiedData: response.data, decodedData };
    }
}
