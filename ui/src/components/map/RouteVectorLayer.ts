import { Extent } from "ol/extent";
import Feature from "ol/Feature";
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";

export default class RouteVectorLayer extends VectorLayer<VectorSource<any>> {
  routeExtent?: Extent;

  constructor(routeGeojson?: string) {
    let routeSource: VectorSource<any> | undefined;
    let routeStyle: Style | undefined;
    let routeExtent: Extent | undefined;

    try {
      if (routeGeojson && routeGeojson.length > 0) {
        // Create geometry and a map feature using the route geojson
        const geojson = new GeoJSON();
        const routeLine = geojson.readGeometry(routeGeojson);
        routeExtent = routeLine.getExtent();

        const routeFeature = new Feature({ geometry: routeLine });
        routeSource = new VectorSource({ features: [routeFeature] });

        routeStyle = new Style({
          stroke: new Stroke({
            color: "rgba(0, 102, 204, 1.0)",
            width: 2,
          }),
        });
      }
    } catch (err) {
      console.log("ERROR", err);
    }

    // Create a vector layer showing the route
    super({ source: routeSource, style: routeStyle });
    this.set("id", "route");

    this.routeExtent = routeExtent;
  }
}
