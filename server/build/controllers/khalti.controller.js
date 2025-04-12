"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhaltiController = void 0;
const khalti_service_1 = __importDefault(require("../service/khalti.service"));
class KhaltiController {
    async initializePayment(req, res) {
        try {
            const paymentDetails = await khalti_service_1.default.initializeKhaltiPayment(req.body);
            res.json({ success: true, paymentDetails });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ success: false, error: err.message });
            }
        }
    }
    async verifyPayment(req, res) {
        try {
            const { pidx, txnId, amount, mobile, purchase_order_id, purchase_order_name, transaction_id, } = req.query;
            const paymentDetails = await khalti_service_1.default.verifyPayment(pidx);
            res.json({ success: true, paymentDetails });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ success: false, error: err.message });
            }
        }
    }
}
exports.KhaltiController = KhaltiController;
