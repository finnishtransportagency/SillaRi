import XML from "ol/format/XML";
import { Tile as TileLayer } from "ol/layer";
import { get as getProj } from "ol/proj";
import { WMTS } from "ol/source";
import TileSource from "ol/source/Tile";
import { optionsFromCapabilities } from "ol/source/WMTS";

export default class BridgeTileLayer extends TileLayer<TileSource> {
  constructor(projection: string, capabilitiesUrl: string, capabilities?: XML) {
    let bridgeSource: WMTS | undefined;

    if (capabilities) {
      console.log("using WMTS for data");

      const bridgeWmtsOptions = optionsFromCapabilities(capabilities, {
        layer: "sillari:bridge",
        projection: getProj(projection),
      });
      console.log("bridge wmtsOptions", bridgeWmtsOptions);

      if (bridgeWmtsOptions) {
        // Modify the URL to fetch tiles via the backend to avoid authentication issues on mobile
        // Use the same URL as for the WMTS capabilities but make sure to receive binary images rather than XML
        bridgeWmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];

        bridgeSource = new WMTS(bridgeWmtsOptions);
      }
    }

    // Create a tile layer showing the bridges
    super({ source: bridgeSource });
    this.set("id", "bridge");
  }
}
