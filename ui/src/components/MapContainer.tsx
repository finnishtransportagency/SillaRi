import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { Plugins } from "@capacitor/core";
import { defaults, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { Extent } from "ol/extent";
import Feature from "ol/Feature";
import { GeoJSON, WMTSCapabilities } from "ol/format";
import { Point } from "ol/geom";
import { Layer, Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import MapOL from "ol/Map";
import { get as getProj, fromLonLat } from "ol/proj";
import { register } from "ol/proj/proj4";
import { TileDebug, Vector as VectorSource, WMTS, XYZ } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import TileGrid from "ol/tilegrid/TileGrid";
import View from "ol/View";
import proj4 from "proj4";
import { routeBridgeQuery } from "../graphql/RouteBridgeQuery";
import { routeQuery } from "../graphql/RouteQuery";
import IBridgeDetail from "../interfaces/IBridgeDetail";
import IRouteDetail from "../interfaces/IRouteDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import "./MapContainer.scss";

interface MapContainerProps {
  routeBridgeId: string;
  routeId: string;
}

const MapContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapRef = useRef<HTMLDivElement>(null);

  const { routeBridgeId: routeBridgeIdParam, routeId: routeIdParam } = useParams<MapContainerProps>();

  const [backgroundTileGrid, setBackgroundTileGrid] = useState<TileGrid>();
  const [backgroundLayer, setBackgroundLayer] = useState<Layer>();
  const [bridgeLayer, setBridgeLayer] = useState<Layer>();
  const [routeLayer, setRouteLayer] = useState<Layer>();
  const [userLayer, setUserLayer] = useState<VectorLayer>();
  const [bridgeCoords, setBridgeCoords] = useState<Point>();
  const [routeExtent, setRouteExtent] = useState<Extent>();
  const [mapInitialised, setMapInitialised] = useState<boolean>(false);

  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedBridgeDetail, selectedRouteDetail } = crossingsState;
  const { bridge, routeId = 0 } = selectedBridgeDetail || {};
  const { identifier: bridgeIdentifier, geojson: bridgeGeojson } = bridge || {};
  const { geojson: routeGeojson, routeBridges = [] } = selectedRouteDetail || {};

  useQuery<IBridgeDetail>(routeBridgeQuery(routeBridgeIdParam && routeBridgeIdParam.length > 0 ? Number(routeBridgeIdParam) : 0), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_BRIDGE, payload: response }),
    onError: (err) => console.error(err),
  });

  // Note: when showing single bridges on the map, the route line is also needed to be shown,
  // so 'skip' is used to fetch the route data only after routeId has been fetched from the routebridge data
  useQuery<IRouteDetail>(routeQuery(routeIdParam && routeIdParam.length > 0 ? Number(routeIdParam) : routeId), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_ROUTE, payload: response }),
    onError: (err) => console.error(err),
    skip: !!routeBridgeIdParam && routeBridgeIdParam.length > 0 && (!routeId || routeId === 0),
  });

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
      let backgroundMapLayer;

      try {
        // Try to use the Väylä map service if possible, so fetch the WMTS capabilities via the backend to avoid a CORS error
        // Note: in development mode, this will use the proxy defined in package.json
        const capabilitiesUrl = "/api/ui/getbackgroundmapxml?SERVICE=WMTS&REQUEST=GetCapabilities";
        const capabilitiesResponse = await fetch(capabilitiesUrl, { credentials: "include" });

        if (capabilitiesResponse.ok) {
          // Try to parse the capabilities XML using OpenLayers
          const capabilitiesXML = await (capabilitiesResponse.text() as Promise<string>);
          const parser = new WMTSCapabilities();
          const capabilities = parser.read(capabilitiesXML);
          console.log("background capabilities", capabilities);

          if (capabilities) {
            console.log("using WMTS for background");

            const wmtsOptions = optionsFromCapabilities(capabilities, {
              layer: "taustakartta",
              projection: getProj(projection),
            });
            console.log("wmtsOptions", wmtsOptions);

            // Modify the URL to fetch tiles via the backend to avoid authentication issues on mobile
            // Use the same URL as for the WMTS capabilities but make sure to receive binary images rather than XML
            wmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];

            const wmtsSource = new WMTS(wmtsOptions);
            setBackgroundTileGrid(wmtsSource.getTileGrid());

            backgroundMapLayer = new TileLayer({ source: wmtsSource });
            backgroundMapLayer.set("id", "background");
            setBackgroundLayer(backgroundMapLayer);
          }
        }
      } catch (err) {
        console.log("ERROR", err);
      }

      if (!backgroundMapLayer) {
        // Using the Väylä map service was not possible, so use the public Kapsi service as an alternative
        console.log("using XYZ for background");

        const origin = [-548576, 8388608];
        const resolutions = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        const xyzTileGrid = new TileGrid({ origin, resolutions });
        setBackgroundTileGrid(xyzTileGrid);

        const xyzSource = new XYZ({
          url: "https://tiles.kartat.kapsi.fi/taustakartta_3067/{z}/{x}/{y}.jpg",
          projection: getProj(projection),
          tileGrid: xyzTileGrid,
          cacheSize: 2048,
          attributions: `${t("map.attribution")}: Maanmittauslaitos | Taustakartta`,
        });

        backgroundMapLayer = new TileLayer({ source: xyzSource });
        backgroundMapLayer.set("id", "background");
        setBackgroundLayer(backgroundMapLayer);
      }
    };

    // Call the asynchronous functions here since initBackgroundMap is called from useEffect which is synchronous
    getBackgroundMapLayer();
  };

  const initDataLayers = () => {
    console.log("initDataLayers");

    // This function is called several times from useEffect when the dependencies change
    // However, the data layers should only be created once
    if (!mapInitialised && !bridgeLayer && !routeLayer) {
      const getEmptyBridgeLayer = () => {
        // Helper function to create an empty vector layer for bridges
        const bridgeMapLayer = new VectorLayer();
        bridgeMapLayer.set("id", "bridge");
        setBridgeLayer(bridgeMapLayer);
      };

      const getEmptyRouteLayer = () => {
        // Helper function to create an empty vector layer for the route
        const routeMapLayer = new VectorLayer();
        routeMapLayer.set("id", "route");
        setRouteLayer(routeMapLayer);
      };

      const getBridgeVectorLayer = () => {
        try {
          if (routeBridgeIdParam && routeBridgeIdParam.length > 0 && bridgeGeojson && bridgeGeojson.length > 0) {
            // Create geometry and a map feature using the bridge geojson
            const geojson = new GeoJSON();
            const bridgePoint = geojson.readGeometry(bridgeGeojson);
            setBridgeCoords(bridgePoint as Point);

            const bridgeFeature = new Feature({ geometry: bridgePoint });
            const bridgeSource = new VectorSource({ features: [bridgeFeature] });

            const bridgeStyle = new Style({
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

            // Create a vector layer showing the single bridge
            const bridgeMapLayer = new VectorLayer({ source: bridgeSource, style: bridgeStyle });
            bridgeMapLayer.set("id", "bridge");
            setBridgeLayer(bridgeMapLayer);
          } else if (routeIdParam && routeIdParam.length > 0 && routeGeojson && routeGeojson.length > 0) {
            // Create geometry and map features using the route bridges geojson
            const geojson = new GeoJSON();
            const bridgeFeatures = routeBridges.map((rb) => {
              const bridgePoint = geojson.readGeometry(rb.bridge.geojson);
              return new Feature({ identifier: rb.bridge.identifier, geometry: bridgePoint });
            });

            const bridgeSource = new VectorSource({ features: bridgeFeatures });

            const bridgeStyleFunction = (feature: Feature, resolution: number) => {
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
            };

            // Create a vector layer showing all the bridges on the route
            const bridgeMapLayer = new VectorLayer({ source: bridgeSource, style: bridgeStyleFunction as StyleFunction });
            bridgeMapLayer.set("id", "bridge");
            setBridgeLayer(bridgeMapLayer);
          } else {
            // No geometry, so create an empty vector layer
            getEmptyBridgeLayer();
          }
        } catch (err) {
          console.log("ERROR", err);
          getEmptyBridgeLayer();
        }
      };

      const getRouteVectorLayer = () => {
        try {
          if (routeGeojson && routeGeojson.length > 0) {
            // Create geometry and a map feature using the route geojson
            const geojson = new GeoJSON();
            const routeLine = geojson.readGeometry(routeGeojson);
            setRouteExtent(routeLine.getExtent());

            const routeFeature = new Feature({ geometry: routeLine });
            const routeSource = new VectorSource({ features: [routeFeature] });

            const routeStyle = new Style({
              stroke: new Stroke({
                color: "rgba(0, 102, 204, 1.0)",
                width: 2,
              }),
            });

            // Create a vector layer showing the route
            const routeMapLayer = new VectorLayer({ source: routeSource, style: routeStyle });
            routeMapLayer.set("id", "route");
            setRouteLayer(routeMapLayer);
          } else {
            // No geometry, so create an empty vector layer
            getEmptyRouteLayer();
          }
        } catch (err) {
          console.log("ERROR", err);
          getEmptyRouteLayer();
        }
      };

      const getGeoServerTileLayers = async () => {
        try {
          // Fetch the WMTS capabilities via the backend to avoid a CORS error
          // Note: in development mode, this will use the proxy defined in package.json
          const capabilitiesUrl = "/api/ui/getgeoserverlayerxml/gwc/service/wmts?REQUEST=GetCapabilities";
          const capabilitiesResponse = await fetch(capabilitiesUrl, { credentials: "include" });

          if (capabilitiesResponse.ok) {
            // Try to parse the capabilities XML using OpenLayers
            const capabilitiesXML = await (capabilitiesResponse.text() as Promise<string>);
            const parser = new WMTSCapabilities();
            const capabilities = parser.read(capabilitiesXML);
            console.log("data capabilities", capabilities);

            if (capabilities) {
              console.log("using WMTS for data");

              const bridgeWmtsOptions = optionsFromCapabilities(capabilities, {
                layer: "sillari:bridge",
                projection: getProj(projection),
              });
              console.log("bridge wmtsOptions", bridgeWmtsOptions);

              const routeWmtsOptions = optionsFromCapabilities(capabilities, {
                layer: "sillari:route",
                projection: getProj(projection),
              });
              console.log("route wmtsOptions", routeWmtsOptions);

              // Modify the URL to fetch tiles via the backend to avoid authentication issues on mobile
              // Use the same URL as for the WMTS capabilities but make sure to receive binary images rather than XML
              bridgeWmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];
              routeWmtsOptions.urls = [capabilitiesUrl.substr(0, capabilitiesUrl.indexOf("?")).replace("xml", "img")];

              // Create tile layers showing the bridges and route
              setBridgeLayer(new TileLayer({ source: new WMTS(bridgeWmtsOptions) }));
              setRouteLayer(new TileLayer({ source: new WMTS(routeWmtsOptions) }));
            } else {
              // No capabilities, so create empty vector layers
              getEmptyBridgeLayer();
              getEmptyRouteLayer();
            }
          } else {
            getEmptyBridgeLayer();
            getEmptyRouteLayer();
          }
        } catch (err) {
          console.log("ERROR", err);
          getEmptyBridgeLayer();
          getEmptyRouteLayer();
        }
      };

      // Note: the bridge and route detail in redux state is initially undefined
      // When the queries are done and the data is in redux state, the detail will be either an object or null, not undefined anymore
      if (selectedBridgeDetail !== undefined && selectedRouteDetail !== undefined) {
        if ((!routeBridgeIdParam || routeBridgeIdParam.length === 0) && (!routeIdParam || routeIdParam.length === 0)) {
          // No specific bridge or route to show, so show all the bridge and route data from geoserver
          getGeoServerTileLayers();
        } else {
          // Show the specific bridges and routes from the geojson values in redux state
          getBridgeVectorLayer();
          getRouteVectorLayer();
        }
      }
    }

    if (!mapInitialised && !userLayer) {
      // The marker feature will be added after initialisation
      const userSource = new VectorSource({ features: [] });

      // Note: to get this to work, the following has been added to location.svg: width='32px' height='32px' fill='#fff'
      const userStyle = new Style({
        image: new Icon({
          src: "assets/location.svg",
          color: "rgba(0, 102, 204, 1.0)",
          anchor: [0.5, 1],
        }),
      });

      const userMapLayer = new VectorLayer({ source: userSource, style: userStyle });
      userMapLayer.set("id", "user");
      setUserLayer(userMapLayer);
    }
  };

  const initMap = () => {
    console.log("initMap, mapInitialised", mapInitialised);

    // This function is called several times from useEffect when the dependencies change
    // However, the map should only be initialised once, otherwise duplicate OpenLayers viewports are rendered
    if (!mapInitialised && backgroundTileGrid && backgroundLayer && bridgeLayer && routeLayer && userLayer) {
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
          const { Geolocation } = Plugins;
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
    selectedBridgeDetail,
    selectedRouteDetail,
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

  // Initialise the OpenLayers map with the background tile grid and layer, and data layers, as dependencies
  // This means initMap is called several times but only when the dependencies change
  useEffect(initMap, [
    backgroundTileGrid,
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
