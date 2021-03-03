import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import MapOL from "ol/Map";
import View from "ol/View";
import { defaults, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { Tile } from "ol/layer";
import { get } from "ol/proj";
import { register } from "ol/proj/proj4";
import { TileDebug, XYZ } from "ol/source";
import TileGrid from "ol/tilegrid/TileGrid";
import proj4 from "proj4";
import "./MapContainer.scss";

const MapContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);

  const debug = false;

  // NOTE: This is just for testing OpenLayers in Ionic, the real background map, layers and settings will be defined later
  const initMap = () => {
    console.log("initMap");

    const projection = "EPSG:3067";
    const projectionDefinition = "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    proj4.defs(projection, projectionDefinition);
    register(proj4);

    const origin = [-548576, 8388608];
    const resolutions = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
    const layerGrid = new TileGrid({
      origin,
      resolutions,
    });

    const source = new XYZ({
      url: "https://tiles.kartat.kapsi.fi/taustakartta_3067/{z}/{x}/{y}.jpg",
      projection: get(projection),
      tileGrid: layerGrid,
      cacheSize: 2048,
      attributions: `${t("map.attribution")}: Maanmittauslaitos | Taustakartta`,
    });

    const backgroundLayer = new Tile({
      source,
    });

    const view = new View({
      zoom: 3,
      center: [400000, 7000000],
      projection,
      resolutions,
      minZoom: 0,
      maxZoom: 15,
    });

    const map = new MapOL({
      target: mapRef.current || undefined,
      layers: [backgroundLayer],
      view,
      controls: defaults(),
    });

    if (debug) {
      const mousePositionControl = new MousePosition({
        projection,
        coordinateFormat: createStringXY(0),
      });
      map.addControl(mousePositionControl);

      const debugLayer = new Tile({
        source: new TileDebug({
          projection: get(projection),
          tileGrid: layerGrid,
        }),
      });
      map.addLayer(debugLayer);
    }

    // Note: A timeout is needed to get the layers to render properly in Ionic
    setTimeout(() => {
      map.updateSize();
    }, 500);
  };

  // Initialise the map on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initMap, []);

  return <div className="map" ref={mapRef} />;
};

export default MapContainer;
