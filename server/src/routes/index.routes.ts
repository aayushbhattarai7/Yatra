import { Router } from "express";
// import place from "./place.routes";
// import user from "./user.routes";
// import admin from "./admin.routes";
// import guide from "./guide.routes";
import travel from "./travel.routes";
// import hotel from "./hotel.routes";
export interface Route {
  path: string;
  route: Router;
}
const router = Router();
const routes: Route[] = [
  // {
  //   path: "/place",
  //   route: place,
  // },
  // {
  //   path: "/user",
  //   route: user,
  // },
  // {
  //   path: "/admin",
  //   route: admin,
  // },
  // {
  //   path: "/guide",
  //   route: guide,
  // },
  {
    path: "/travel",
    route: travel,
  },
  // {
  //   path: "/hotel",
  //   route: hotel,
  // },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
