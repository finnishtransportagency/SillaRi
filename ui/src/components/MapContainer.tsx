import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import MapOL from "ol/Map";
import View from "ol/View";
import { defaults, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { WMTSCapabilities } from "ol/format";
import { Tile } from "ol/layer";
import { get } from "ol/proj";
import { register } from "ol/proj/proj4";
import { TileDebug, WMTS, XYZ } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";
import TileGrid from "ol/tilegrid/TileGrid";
import proj4 from "proj4";
import "./MapContainer.scss";

const MapContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);

  const [backgroundTileGrid, setBackgroundTileGrid] = useState<TileGrid>();
  const [backgroundLayer, setBackgroundLayer] = useState<Tile>();
  const [mapInitialised, setMapInitialised] = useState<boolean>(false);

  const projection = "EPSG:3067";
  const debug = false;

  const initBackgroundMap = () => {
    console.log("initBackgroundMap");

    // This function is only called once
    // Register the projection definition with OpenLayers
    const projectionDefinition = "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    proj4.defs(projection, projectionDefinition);
    register(proj4);

    // Use an asynchronous function for getting the map layer since fetch returns a Promise
    const getBackgroundMapLayer = async () => {
      // Try to use the Väylä map service if possible, so fetch the WMTS capabilities via the backend to avoid a CORS error
      // Note: in development mode, this will use the proxy defined in package.json
      const capabilitiesResponse = await fetch("/api/ui/getbackgroundmapxml?SERVICE=WMTS&REQUEST=GetCapabilities", { credentials: "include" });
      let backgroundMapLayer;

      if (capabilitiesResponse.ok) {
        try {
          // Try to parse the capabilities XML using OpenLayers
          const capabilitiesXML = await (capabilitiesResponse.text() as Promise<string>);
          const parser = new WMTSCapabilities();
          const capabilities = parser.read(capabilitiesXML);
          console.log("capabilities", capabilities);

          if (capabilities) {
            console.log("using WMTS");

            const wmtsOptions = optionsFromCapabilities(capabilities, {
              layer: "taustakartta",
              projection: get(projection),
            });
            console.log("wmtsOptions", wmtsOptions);

            const wmtsSource = new WMTS(wmtsOptions);
            setBackgroundTileGrid(wmtsSource.getTileGrid());

            backgroundMapLayer = new Tile({ source: wmtsSource });
            setBackgroundLayer(backgroundMapLayer);
          }
        } catch (err) {
          console.log("ERROR", err);
        }
      }

      if (!backgroundMapLayer) {
        // Using the Väylä map service was not possible, so use the public Kapsi service as an alternative
        console.log("using XYZ");

        const origin = [-548576, 8388608];
        const resolutions = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        const xyzTileGrid = new TileGrid({ origin, resolutions });
        setBackgroundTileGrid(xyzTileGrid);

        const xyzSource = new XYZ({
          url: "https://tiles.kartat.kapsi.fi/taustakartta_3067/{z}/{x}/{y}.jpg",
          projection: get(projection),
          tileGrid: xyzTileGrid,
          cacheSize: 2048,
          attributions: `${t("map.attribution")}: Maanmittauslaitos | Taustakartta`,
        });
        setBackgroundLayer(new Tile({ source: xyzSource }));
      }
    };

    // Call the asynchronous function here since initBackgroundMap is called from useEffect which is synchronous
    getBackgroundMapLayer();
  };

  const initMap = () => {
    console.log("initMap grid", backgroundTileGrid, "layer", backgroundLayer);

    // This function is called several times from useEffect when the dependencies change
    // However, the map should only be initialised once, otherwise duplicate OpenLayers viewports are rendered
    if (!mapInitialised && backgroundTileGrid && backgroundLayer) {
      // The tile grid and layer for the background map are defined, so create the OpenLayers view and map, and any other related components
      const view = new View({
        zoom: 3,
        center: [400000, 7000000],
        projection,
        resolutions: backgroundTileGrid.getResolutions(),
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
        // For debug purposes, show the mouse coordinates and tile grid overlay
        const mousePositionControl = new MousePosition({
          projection,
          coordinateFormat: createStringXY(0),
        });
        map.addControl(mousePositionControl);

        const debugLayer = new Tile({
          source: new TileDebug({
            projection: get(projection),
            tileGrid: backgroundTileGrid,
          }),
        });
        map.addLayer(debugLayer);
      }

      // Note: A timeout is needed to get the layers to render properly in Ionic
      setTimeout(() => {
        map.updateSize();
        setMapInitialised(true);
      }, 500);
    }
  };

  // Initialise the background map on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initBackgroundMap, []);

  // Initialise the OpenLayers map with the background tile grid and layer as dependencies
  // This means initMap is called several times but only when the dependencies change
  useEffect(initMap, [backgroundTileGrid, backgroundLayer, mapInitialised, debug]);

  return <div className="map" ref={mapRef} />;
};

export default MapContainer;
