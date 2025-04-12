"use strict";
// import { Router } from "express";
// import upload from "../utils/fileUpload.utils";
// import { HotelController } from "../controllers/hotel.controller";
// import { authentication } from "../middleware/authentication.middleware";
// import { authorization } from "../middleware/authorization.middleware";
// import { Role } from "../constant/enum";
// const hotelController = new HotelController();
// const router: Router = Router();
// router.post(
//   "/signup",
//   upload.fields([
//     { name: "passPhoto", maxCount: 1 },
//     { name: "citizenshipFront", maxCount: 1 },
//     { name: "citizenshipBack", maxCount: 1 },
//     { name: "panCard", maxCount: 1 },
//     { name: "passport", maxCount: 1 },
//     { name: "voterCard", maxCount: 1 },
//   ]),
//   hotelController.create,
// );
// router.patch("/resend-otp", hotelController.reSendOtp);
// router.post("/verify", hotelController.verifyUser);
// router.post("/login", hotelController.login);
// router.use(authentication());
// router.use(authorization([Role.HOTEL]));
// router.post("/add-room", hotelController.addHotelRoom);
// export default router;
