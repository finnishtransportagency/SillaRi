import XML from "ol/format/XML";
import { Tile as TileLayer } from "ol/layer";
import { get as getProj } from "ol/proj";
import { WMTS } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";

export default class RouteTileLayer extends TileLayer {
  constructor(projection: string, capabilitiesUrl: string, capabilities?: XML) {
    let routeSource: WMTS | undefined;

    if (capabilities) {
      console.log("using WMTS for data");

      const routeWmtsOptions = optionsFromCapabilities(capabilities, {
        layer: "sillari:route",
        projection: getProj(projection),
      });
      console.log("route wmtsOptions", routeWmtsOptions);

      // Modify the URL to fetch tiles via the backend to avoid authentication issues on mobile
      // Use the same URL as for the WMTS capabilities but make sure to receive binary images rather than XML
      routeWmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];

      routeSource = new WMTS(routeWmtsOptions);
    }

    // Create a tile layer showing the route
    super({ source: routeSource });
    this.set("id", "route");
  }
}
