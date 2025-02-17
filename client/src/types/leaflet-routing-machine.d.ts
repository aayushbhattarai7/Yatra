import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      // You can add more specific options here if desired
      [key: string]: any;
    }
    interface Control {
      addTo(map: L.Map): this;
      remove(): this;
    }
    function control(options?: RoutingControlOptions): Control;

    interface PlanOptions {
      // Add any properties you need
      [key: string]: any;
    }
    function plan(waypoints: L.LatLng[], options?: PlanOptions): any;
  }
  // Extend the L namespace with a Routing property
  export var Routing: {
    control(options?: Routing.RoutingControlOptions): Routing.Control;
    plan(waypoints: L.LatLng[], options?: Routing.PlanOptions): any;
  };
}
