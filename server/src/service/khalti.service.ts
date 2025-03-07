import axios from "axios";
import {DotenvConfig} from "../config/env.config";
import HttpException from "../utils/HttpException.utils";
class KhaltiService {
    constructor() { }
    
    async verifyPayment(id: any) {
        const headersList = {
            "Authorization": `Key ${DotenvConfig.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
        };
        
        const bodyContent = JSON.stringify({ id });

        const reqOptions = {
            url: `${DotenvConfig.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        };
        
        try {
            const response = await axios.request(reqOptions)
            return response.data
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw HttpException.badRequest(error.message)
            } else {
                throw HttpException.internalServerError("Error occured")
            }
            
        }

    }

    async initializeKhaltiPayment(details: any) {
        const headersList = {
            "Authorization": `Key ${DotenvConfig.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify(details);

        const reqOptions = {
            url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        };
        try {
            const response = await axios.request(reqOptions);
            return response.data;
        } catch (error) {
            console.error("Error initializing Khalti payment:", error);
            throw error;
        }
    }
}
export default new KhaltiService()