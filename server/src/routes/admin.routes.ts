// import { authentication } from "../middleware/authentication.middleware";
// import { AdminController } from "../controllers/admin.controller";
// import { Router } from "express";
// import { authorization } from "../middleware/authorization.middleware";
// import { Role } from "../constant/enum";
// const adminController = new AdminController();
// const router: Router = Router();
// router.post("/signup", adminController.createAdmin);
// router.post("/login", adminController.loginAdmin);

// router.use(authentication());
// router.use(authorization([Role.ADMIN]));
// router.get(
//   "/get-guide-approval-request",
//   adminController.getApproveRequestForGuide,
// );
// router.get(
//   "/get-travel-approval-request",
//   adminController.getApproveRequestForTravel,
// );
// router.patch("/approve-travel-request/:id", adminController.approveRequest);
// router.delete("/reject-guide-request/:id", adminController.rejectGuideRequest);
// router.patch("/reject-travel-request/:id", adminController.rejectTravelRequest);

// export default router;
