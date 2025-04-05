import { Router } from "express";
import user from "./user.routes";
import khalti from "./khalti.routes";
import esewa from "./esewa.routes";
import travel from "./travel.routes";
import guide from "./guide.routes";
import admin from "./admin.routes";
export interface Route {
  path: string;
  route: Router;
}
const router = Router();
const routes: Route[] = [
 
  {
    path: "/user",
    route: user,
  },
  {
    path: "/khalti",
    route: khalti,
  },
  {
    path: "/esewa",
    route: esewa,
  },
  {
    path: "/travel",
    route: travel,
  },
  {
    path: "/guide",
    route: guide,
  },
  {
    path: "/admin",
    route: admin,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
