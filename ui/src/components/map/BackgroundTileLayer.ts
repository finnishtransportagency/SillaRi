import XML from "ol/format/XML";
import { Tile as TileLayer } from "ol/layer";
import { get as getProj } from "ol/proj";
import { Tile as TileSource, WMTS, XYZ } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";
import TileGrid from "ol/tilegrid/TileGrid";

export default class BackgroundTileLayer extends TileLayer<TileSource> {
  constructor(projection: string, mmlAttribution: string, capabilitiesUrl: string, capabilities?: XML) {
    let backgroundSource: TileSource | undefined;

    if (capabilities) {
      console.log("using WMTS for background");

      const wmtsOptions = optionsFromCapabilities(capabilities, {
        layer: "taustakartta",
        projection: getProj(projection),
      });
      console.log("wmtsOptions", wmtsOptions);

      if (wmtsOptions) {
        // Modify the URL to fetch tiles via the backend to avoid authentication issues on mobile
        // Use the same URL as for the WMTS capabilities but make sure to receive binary images rather than XML
        wmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];

        const wmtsSource = new WMTS(wmtsOptions);
        backgroundSource = wmtsSource;
      }
    }

    if (!backgroundSource) {
      // Using the Väylä map service was not possible, so use the public Kapsi service as an alternative
      console.log("using XYZ for background");

      const origin = [-548576, 8388608];
      const resolutions = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
      const xyzTileGrid = new TileGrid({ origin, resolutions });

      const xyzSource = new XYZ({
        url: "https://tiles.kartat.kapsi.fi/taustakartta_3067/{z}/{x}/{y}.jpg",
        projection: projection,
        tileGrid: xyzTileGrid,
        cacheSize: 2048,
        attributions: mmlAttribution,
      });
      backgroundSource = xyzSource;
    }

    // Create a tile layer showing the background map
    super({ source: backgroundSource });
    this.set("id", "background");
  }
}
