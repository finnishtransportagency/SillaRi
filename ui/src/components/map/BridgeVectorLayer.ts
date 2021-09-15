import Feature from "ol/Feature";
import { GeoJSON } from "ol/format";
import { Geometry, Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { StyleFunction, StyleLike } from "ol/style/Style";
import IRouteBridge from "../../interfaces/IRouteBridge";

export default class BridgeVectorLayer extends VectorLayer<VectorSource<any>> {
  bridgeCoords?: Point;

  constructor(routeBridgeIdParam?: string, bridgeGeojson?: string, bridgeIdentifier?: string, routeIdParam?: string, routeBridges?: IRouteBridge[]) {
    let bridgeSource: VectorSource<any> | undefined;
    let bridgeStyle: StyleLike | undefined;
    let bridgeCoords: Point | undefined;

    try {
      if (routeBridgeIdParam && routeBridgeIdParam.length > 0 && bridgeGeojson && bridgeGeojson.length > 0) {
        // Create a vector layer showing the single bridge by creating geometry and a map feature using the bridge geojson
        const geojson = new GeoJSON();
        const bridgePoint = geojson.readGeometry(bridgeGeojson);
        bridgeCoords = bridgePoint as Point;

        const bridgeFeature = new Feature({ geometry: bridgePoint });
        bridgeSource = new VectorSource({ features: [bridgeFeature] });

        bridgeStyle = new Style({
          stroke: new Stroke({
            color: "#000000",
            width: 2,
          }),
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "#FF7700",
            }),
            stroke: new Stroke({
              color: "#FFFFFF",
              width: 1,
            }),
          }),
          text: new Text({
            text: bridgeIdentifier,
            stroke: new Stroke({
              color: "#FFFFFF",
              width: 1,
            }),
            offsetY: -14,
          }),
        });
      } else if (routeIdParam && routeIdParam.length > 0 && routeBridges && routeBridges.length > 0) {
        // Create a vector layer showing all the bridges on the route by creating geometry and map features using the route bridges geojson
        const geojson = new GeoJSON();
        const bridgeFeatures = routeBridges.map((rb) => {
          const bridgePoint = geojson.readGeometry(rb.bridge.geojson);
          return new Feature({ identifier: rb.bridge.identifier, geometry: bridgePoint });
        });

        bridgeSource = new VectorSource({ features: bridgeFeatures });

        bridgeStyle = ((feature: Feature<Geometry>, resolution: number) => {
          return new Style({
            stroke:
              resolution <= 8
                ? new Stroke({
                    color: "#000000",
                    width: 2,
                  })
                : undefined,
            image: new Circle({
              radius: resolution <= 8 ? 10 : 5,
              fill: new Fill({
                color: "#FF7700",
              }),
              stroke: new Stroke({
                color: "#FFFFFF",
                width: 1,
              }),
            }),
            text:
              resolution <= 8 && feature.getGeometry() instanceof Point
                ? new Text({
                    text: feature.get("identifier"),
                    stroke: new Stroke({
                      color: "#FFFFFF",
                      width: 1,
                    }),
                    offsetY: -14,
                  })
                : undefined,
          });
        }) as StyleFunction;
      }
    } catch (err) {
      console.log("ERROR", err);
    }

    // Create a vector layer showing the single bridge or all the bridges on the route
    super({ source: bridgeSource, style: bridgeStyle });
    this.set("id", "bridge");

    // For a single bridge, store the coordinates for zooming to later
    this.bridgeCoords = bridgeCoords;
  }
}
