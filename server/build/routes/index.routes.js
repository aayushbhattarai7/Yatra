"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const khalti_routes_1 = __importDefault(require("./khalti.routes"));
const esewa_routes_1 = __importDefault(require("./esewa.routes"));
const travel_routes_1 = __importDefault(require("./travel.routes"));
const guide_routes_1 = __importDefault(require("./guide.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const router = (0, express_1.Router)();
const routes = [
  {
    path: "/user",
    route: user_routes_1.default,
  },
  {
    path: "/khalti",
    route: khalti_routes_1.default,
  },
  {
    path: "/esewa",
    route: esewa_routes_1.default,
  },
  {
    path: "/travel",
    route: travel_routes_1.default,
  },
  {
    path: "/guide",
    route: guide_routes_1.default,
  },
  {
    path: "/admin",
    route: admin_routes_1.default,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
exports.default = router;
