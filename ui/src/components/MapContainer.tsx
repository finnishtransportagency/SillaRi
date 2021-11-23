import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Geolocation } from "@capacitor/geolocation";
import { defaults, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import type { Extent } from "ol/extent";
import Feature from "ol/Feature";
import { WMTSCapabilities } from "ol/format";
import { Geometry, Point } from "ol/geom";
import { Layer, Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import MapOL from "ol/Map";
import { get as getProj, fromLonLat } from "ol/proj";
import { register } from "ol/proj/proj4";
import { Source, TileDebug } from "ol/source";
import View from "ol/View";
import proj4 from "proj4";
import TileSource from "ol/source/Tile";
import VectorSource from "ol/source/Vector";
import BackgroundTileLayer from "./map/BackgroundTileLayer";
import BridgeTileLayer from "./map/BridgeTileLayer";
import BridgeVectorLayer from "./map/BridgeVectorLayer";
import RouteTileLayer from "./map/RouteTileLayer";
import RouteVectorLayer from "./map/RouteVectorLayer";
import UserVectorLayer from "./map/UserVectorLayer";
import { getOrigin } from "../utils/request";
import { getRouteGeometry, getRouteBridgeGeometry, onRetry } from "../utils/backendData";
import "./MapContainer.scss";

interface MapContainerProps {
  routeBridgeId: string;
  routeId: string;
}

const MapContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapRef = useRef<HTMLDivElement>(null);

  // The page route provides either routeBridgeId or routeId, but not both
  // These values are checked later, so don't use default values here
  const { routeBridgeId: routeBridgeIdParam, routeId: routeIdParam } = useParams<MapContainerProps>();

  const [backgroundLayer, setBackgroundLayer] = useState<TileLayer<TileSource>>();
  const [bridgeLayer, setBridgeLayer] = useState<Layer<Source>>();
  const [routeLayer, setRouteLayer] = useState<Layer<Source>>();
  const [userLayer, setUserLayer] = useState<VectorLayer<VectorSource<Geometry>>>();
  const [bridgeCoords, setBridgeCoords] = useState<Point>();
  const [routeExtent, setRouteExtent] = useState<Extent>();
  const [mapInitialised, setMapInitialised] = useState<boolean>(false);

  // Only fetch the data if the layers have not been created yet
  const queryRouteBridgeId = routeBridgeIdParam && routeBridgeIdParam.length > 0 ? Number(routeBridgeIdParam) : 0;
  const { data: routeBridge } = useQuery(["getRouteBridge", queryRouteBridgeId], () => getRouteBridgeGeometry(Number(queryRouteBridgeId), dispatch), {
    retry: onRetry,
  });
  const { bridge, routeId = 0 } = routeBridge || {};
  const { identifier: bridgeIdentifier, geojson: bridgeGeojson } = bridge || {};

  // Note: when showing single bridges on the map, the route line is also needed to be shown,
  // so fetch the route data only after routeId has been fetched from the routebridge data
  const queryRouteId = routeIdParam && routeIdParam.length > 0 ? Number(routeIdParam) : routeId;
  const { data: route } = useQuery(["getRoute", queryRouteId], () => getRouteGeometry(queryRouteId, dispatch), {
    retry: onRetry,
    enabled: (!!routeIdParam && routeIdParam.length > 0) || (!!routeBridgeIdParam && routeBridgeIdParam.length > 0 && !!routeId && routeId > 0),
  });
  const { geojson: routeGeojson, routeBridges = [] } = route || {};

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
      const capabilitiesUrl = `${getOrigin()}/api/ui/getbackgroundmapxml?SERVICE=WMTS&REQUEST=GetCapabilities`;
      let capabilities;

      try {
        const capabilitiesResponse = await fetch(capabilitiesUrl, { credentials: "include" });

        if (capabilitiesResponse.ok) {
          // Try to parse the capabilities XML using OpenLayers
          const capabilitiesXML = await (capabilitiesResponse.text() as Promise<string>);
          const parser = new WMTSCapabilities();
          capabilities = parser.read(capabilitiesXML);
          console.log("background capabilities", capabilities);
        }
      } catch (err) {
        console.log("ERROR", err);
      }

      const mmlAttribution = `${t("map.attribution")}: Maanmittauslaitos | Taustakartta`;
      const backgroundMapLayer = new BackgroundTileLayer(projection, mmlAttribution, capabilitiesUrl, capabilities);
      setBackgroundLayer(backgroundMapLayer);
    };

    // Call the asynchronous function here since initBackgroundMap is called from useEffect which is synchronous
    getBackgroundMapLayer();
  };

  const initDataLayers = () => {
    console.log("initDataLayers");
    console.log("initDataLayers bridgeLayer", bridgeLayer, "routeLayer", routeLayer);
    console.log("initDataLayers routeBridge", routeBridge, "route", route);

    // This function is called several times from useEffect when the dependencies change
    // However, the data layers should only be created once
    if (!mapInitialised && !bridgeLayer && !routeLayer) {
      const getGeoServerTileLayers = async () => {
        // Fetch the WMTS capabilities via the backend to avoid a CORS error
        // Note: in development mode, this will use the proxy defined in package.json
        const capabilitiesUrl = `${getOrigin()}/api/ui/getgeoserverlayerxml/gwc/service/wmts?REQUEST=GetCapabilities`;
        let capabilities;

        try {
          const capabilitiesResponse = await fetch(capabilitiesUrl, { credentials: "include" });

          if (capabilitiesResponse.ok) {
            // Try to parse the capabilities XML using OpenLayers
            const capabilitiesXML = await (capabilitiesResponse.text() as Promise<string>);
            const parser = new WMTSCapabilities();
            capabilities = parser.read(capabilitiesXML);
            console.log("data capabilities", capabilities);
          }
        } catch (err) {
          console.log("ERROR", err);
        }

        const bridgeMapLayer = new BridgeTileLayer(projection, capabilitiesUrl, capabilities);
        setBridgeLayer(bridgeMapLayer);

        const routeMapLayer = new RouteTileLayer(projection, capabilitiesUrl, capabilities);
        setRouteLayer(routeMapLayer);
      };

      // Note: the bridge and route detail in redux state is initially undefined
      // When the queries are done and the data is in redux state, the detail will be either an object or null, not undefined anymore
      if (routeBridge !== undefined && route !== undefined) {
        if ((!routeBridgeIdParam || routeBridgeIdParam.length === 0) && (!routeIdParam || routeIdParam.length === 0)) {
          // No specific bridge or route to show, so show all the bridge and route data from geoserver
          getGeoServerTileLayers();
        } else {
          // Show the specific bridges and routes from the geojson values in redux state
          const bridgeMapLayer = new BridgeVectorLayer(routeBridgeIdParam, bridgeGeojson, bridgeIdentifier, routeIdParam, routeBridges);
          setBridgeLayer(bridgeMapLayer);
          setBridgeCoords(bridgeMapLayer.bridgeCoords);

          const routeMapLayer = new RouteVectorLayer(routeGeojson);
          setRouteLayer(routeMapLayer);
          setRouteExtent(routeMapLayer.routeExtent);
        }
      }
    }

    if (!mapInitialised && !userLayer) {
      const userMapLayer = new UserVectorLayer();
      setUserLayer(userMapLayer);
    }
  };

  const initMap = () => {
    console.log("initMap, mapInitialised", mapInitialised);
    console.log("initMap, bridgeLayer", bridgeLayer, "routeLayer", routeLayer);

    // This function is called several times from useEffect when the dependencies change
    // However, the map should only be initialised once, otherwise duplicate OpenLayers viewports are rendered
    if (!mapInitialised && backgroundLayer && bridgeLayer && routeLayer && userLayer) {
      const backgroundTileGrid = backgroundLayer.getSource().getTileGrid();

      // The tile grid and layer for the background map are defined, so create the OpenLayers view and map, and any other related components
      const view = new View({
        zoom: 3,
        center: [400000, 7000000],
        projection,
        resolutions: backgroundTileGrid.getResolutions(),
        minZoom: 0,
        maxZoom: 15,
      });

      // In some cases, there are still duplicate OpenLayers viewports despite the checks above
      // So remove any existing viewports before creating a new OpenLayers map
      if (mapRef.current) {
        while (mapRef.current.firstChild) {
          mapRef.current.removeChild(mapRef.current.firstChild);
        }
      }

      const map = new MapOL({
        target: mapRef.current || undefined,
        layers: [backgroundLayer, routeLayer, bridgeLayer, userLayer],
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

        const debugLayer = new TileLayer({
          source: new TileDebug({
            projection: getProj(projection),
            tileGrid: backgroundTileGrid,
          }),
        });
        map.addLayer(debugLayer);
      }

      // Note: A timeout is needed to get the layers to render properly in Ionic
      setTimeout(() => {
        // Resize the map to fill Ionic's container
        map.updateSize();
        setMapInitialised(true);

        // Perform any other map operations
        if (routeIdParam && routeIdParam.length > 0 && routeExtent) {
          // Zoom to the route extent
          map.getView().fit(routeExtent, { duration: 1000 });
        }

        if (routeBridgeIdParam && routeBridgeIdParam.length > 0 && bridgeCoords) {
          // Zoom to the bridge coordinates
          map.getView().animate({ zoom: 12, center: bridgeCoords.getCoordinates() });
        }
      }, 500);
    }
  };

  const initUserPosition = () => {
    console.log("initUserPosition");

    if (mapInitialised && userLayer) {
      const getUserPosition = async () => {
        try {
          const userPosition = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          console.log("user position", userPosition);

          // Show a marker for the user position if valid coordinates were obtained
          if (userPosition.coords && userPosition.coords.longitude > 0 && userPosition.coords.latitude > 0) {
            const userPoint = new Point(fromLonLat([userPosition.coords.longitude, userPosition.coords.latitude], projection));
            const userFeature = new Feature({ geometry: userPoint });
            userLayer.getSource().clear();
            userLayer.getSource().addFeature(userFeature);
          }
        } catch (err) {
          console.log("ERROR", err);
        }
      };

      getUserPosition();
    }
  };

  // Initialise the background map on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initBackgroundMap, []);

  // Initialise the data layers with bridge and route information as dependencies
  // This means initDataLayers is called several times but only when the dependencies change
  useEffect(initDataLayers, [
    routeBridge,
    route,
    bridgeLayer,
    routeLayer,
    userLayer,
    routeBridgeIdParam,
    bridgeIdentifier,
    bridgeGeojson,
    routeIdParam,
    routeGeojson,
    routeBridges,
    mapInitialised,
  ]);

  // Initialise the OpenLayers map with the background tile layer and other data layers as dependencies
  // This means initMap is called several times but only when the dependencies change
  useEffect(initMap, [
    backgroundLayer,
    bridgeLayer,
    routeLayer,
    userLayer,
    routeBridgeIdParam,
    routeIdParam,
    bridgeCoords,
    routeExtent,
    mapInitialised,
    debug,
  ]);

  // Initialise the marker showing the user position
  // This is called once after the map has been initialised
  useEffect(initUserPosition, [userLayer, mapInitialised]);

  return <div className="map" ref={mapRef} />;
};

export default MapContainer;
