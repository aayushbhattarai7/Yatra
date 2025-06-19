"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsewaController = void 0;
const esewa_service_1 = __importDefault(require("../service/esewa.service"));
const env_config_1 = require("../config/env.config");
class EsewaController {
  async initializePayment(req, res) {
    try {
      const { productId, amount } = req.body;
      console.log(
        "🚀 ~ EsewaController ~ initializePayment ~ productId:",
        env_config_1.DotenvConfig.ESEWA_PRODUCT_CODE,
        env_config_1.DotenvConfig.ESEWA_SECRET_KEY,
      );
      console.log("🚀 ~ EsewaController ~ initializePayment ~ amount:", amount);
      const paymentDetails = await esewa_service_1.default.initializePayment(
        amount,
        productId,
      );
      console.log(
        "🚀 ~ EsewaController ~ initializePayment ~ paymentDetails:",
        paymentDetails,
      );
      res.json({ success: true, paymentDetails });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
  async completePayment(req, res) {
    try {
      const { token } = req.body;
      console.log("🚀 ~ EsewaController ~ completePayment ~ data:", token);
      const paymentInfo = await esewa_service_1.default.verifyPayment(token);
      res.json({ success: true, message: "Payment successful", paymentInfo });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
exports.EsewaController = EsewaController;
