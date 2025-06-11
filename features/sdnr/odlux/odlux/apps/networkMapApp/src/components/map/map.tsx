/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2020 highstreet technologies GmbH Intellectual Property. All rights reserved.
 * =================================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 * ============LICENSE_END==========================================================================
 */

import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { handleConnectionChange, IsBusyCheckingConnectivityAction, setTileServerReachableAction, setTopologyServerReachableAction } from '../../actions/connectivityAction';
import { LoadNetworkElementDetails } from '../../actions/detailsAction';
import { loadLayers, SetCoordinatesAction, updateStatistics, ZoomToFinishedAction } from '../../actions/mapActions';
import { OSM_STYLE, URL_API } from '../../config';
import { BoundingBox } from '../../model/boundingBox';
import { Coordinate, MapCoordinate } from '../../model/coordinates';
import { Feature } from '../../model/topologyTypes';
import { dataService } from '../../services/dataService';
import { addImages } from '../../services/mapImagesService';
import mapLayerService from '../../utils/mapLayers';
import { getUniqueFeatures, increaseBoundingBox } from '../../utils/mapUtils';
import { ConnectionInfo } from './connectionInfo';
import { FilterBar } from './filterBar';
import MapLayer from './layerSelection';
import MapControl from './mapControl';
import MapPopup from './mapPopup';
import SearchBar from './searchBar';
import Statistics from './statistics';

const MAX_ZOOM = 18;
const MIN_ZOOM = 0;

const LogLevel = +(localStorage.getItem('log.odlux.mapComponent') || 0);

const NetworkFilterObserver: FC<{ value: string; onDidUpdate: (val: string) => void }>  = ({ value, onDidUpdate }) => {
  useEffect(() => {
    onDidUpdate(value);
  }, [value]);
  return null;
};

type MapSelectionPopup = {
  isOpen: boolean;
  elements: Feature[];
  type: string;
  position: {
    left: number;
    top: number;
  };
} | null;

let map: maplibregl.Map;
let lastBoundingBox: maplibregl.LngLatBounds;

const useStyles = makeStyles({
  map: {
    display: 'flex',
    position: 'relative', 
    height: '100%',
  },
});

type MapContext = {
  furtherLayerNames: string[];
  areLayersLoaded: boolean;
  isLoadingInProgress: boolean;
  enqueuedBoundingBoxes: maplibregl.LngLatBounds[];
  isInitialLoadOfMap: boolean;
};

const Map: FC = memo(() => {

  const mapContext = useRef<MapContext>({
    furtherLayerNames: [],
    enqueuedBoundingBoxes: [],
    areLayersLoaded: false,
    isLoadingInProgress: false,
    isInitialLoadOfMap: false,
  });

  const networkFilter = useSelectApplicationState(state => state.network.filter);
  const selectedLink = useSelectApplicationState(state => state.network.map.selectedLink);
  const selectedSite = useSelectApplicationState(state => state.network.map.selectedSite);
  const selectedService = useSelectApplicationState(state => state.network.map.selectedService);
  const zoomToElement = useSelectApplicationState(state => state.network.map.zoomToElement);

  const { lat, lon, zoom } = useSelectApplicationState(state => state.network.map.coordinates); 

  const isTopologyServerReachable = useSelectApplicationState(state => state.network.connectivity.isTopologyServerAvailable);
  const isTileServerReachable = useSelectApplicationState(state => state.network.connectivity.isTileServerAvailable);
  const isConnectivityCheckBusy = useSelectApplicationState(state => state.network.connectivity.isBusy);
  const showIcons = useSelectApplicationState(state => state.network.map.allowIconSwitch);
  const settings = useSelectApplicationState(state => state.network.settings);
  const layers = useSelectApplicationState(state => state.network.map.layersContainer.elements);

  const dispatch = useApplicationDispatch();

  const updateLayers = () => dispatch(loadLayers());
  const loadSelectedElement = (type: string, id: string) => dispatch(LoadNetworkElementDetails(type, id));
  const updateMapPosition = (pLat: string, pLon: string, pZoom: string) => dispatch(new SetCoordinatesAction(pLat, pLon, pZoom));
  const updateMapStatistics = (boundingBox: BoundingBox) => dispatch(updateStatistics(boundingBox));
  const setTileServerLoaded = (reachable: boolean) => dispatch(setTileServerReachableAction(reachable));
  const setTopologyServerLoaded = (reachable: boolean) => dispatch(setTopologyServerReachableAction(reachable));
  const connectionChanged = (newState: boolean) => dispatch(handleConnectionChange(newState));
  const setConnectivityCheck = (done: boolean) => dispatch(new IsBusyCheckingConnectivityAction(done));
  const zoomFinished = () => dispatch(new ZoomToFinishedAction());

  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map>();

  const [bearing, setBearing] = useState(0);
  const [popup, setPopup] = useState<MapSelectionPopup>(null);

  const updateTheme = () => {
    mapLayerService.availableThemes = settings.themes;
    if (settings.mapSettings?.styling?.theme) {
      mapLayerService.selectedTheme = settings.mapSettings?.styling.theme;
    }
  };

  const updateOpacity = () => {
    if (settings.mapSettings && settings.mapSettings.tileOpacity) {
      mapLayerService.changeMapOpacity(map, Number(settings.mapSettings.tileOpacity));
    }
  };

  const loadGeoJsonAndAddToMapLayer = async (layer: string, url: string) => {

    //No actions used because the geojson data is only used and needed for the map
    //maybe move out into another map service

    const response = await dataService.getGeojsonData(url);

    if (response.status === 404 || response.status === 400) {
      return true;
    }
    if (response.status !== 200) {
      return false;
    }
    if (map.getSource(layer)) {
      (map.getSource(layer) as maplibregl.GeoJSONSource).setData(response.data);
    }
    return true;
    
  };

  /***
   * Load bounding box data and add it to the map
   */
  const loadBBoxDataAndAddToMap = useCallback(async (startLat: number, startLon: number, endLat: number, endLon: number) => {

    if (LogLevel > 3) {
      console.log(`MapComponent::loadBBoxDataAndAddToMap - lat: ${startLat}, lon: ${startLon}, lat2: ${endLat}, lon2: ${endLon}, networkFilter: ${networkFilter.value}`);
    }

    const servicesLoaded = loadGeoJsonAndAddToMapLayer('services', `${URL_API}/services/geojson/${startLat},${startLon},${endLat},${endLon}?filter=${encodeURIComponent(networkFilter.value)}`);
    const linksLoaded = loadGeoJsonAndAddToMapLayer('lines', `${URL_API}/links/geojson/${startLat},${startLon},${endLat},${endLon}?filter=${encodeURIComponent(networkFilter.value)}`);
    const sitesLoaded = loadGeoJsonAndAddToMapLayer('points', `${URL_API}/sites/geojson/${startLat},${startLon},${endLat},${endLon}?filter=${encodeURIComponent(networkFilter.value)}`);

    const results = await Promise.all([servicesLoaded, linksLoaded, sitesLoaded]);

    mapContext.current.isLoadingInProgress = false;

    const areGeojsonEndpointsReachable = (results[0] && results[1] && results[2]);

    if (isTopologyServerReachable !== areGeojsonEndpointsReachable) {
      connectionChanged(areGeojsonEndpointsReachable);
    }

    if (LogLevel > 3) {
      console.log(`MapComponent::loadBBoxDataAndAddToMap - loaded data for bbox: ${startLat},${startLon},${endLat},${endLon}`, results);
    }

    return results;
  }, [networkFilter.value]);

  const loadMapData = async (bbox: maplibregl.LngLatBounds, force = false) => {

    // Todo: (if we get the time) maybe split bounding box into smaller parts to increase loading speed
    // currently the entire bbox gets loaded (-> potentially huge load)

    if (LogLevel > 3) {
      console.log(`MapComponent::loadMapData - bbox: ${bbox.getNorth()}, ${bbox.getWest()}, ${bbox.getSouth()}, ${bbox.getEast()} : isLoadingInProgress: ${mapContext.current.isLoadingInProgress}`);
    }
   
    try {
      if (mapContext.current.isInitialLoadOfMap) {
        mapContext.current.isInitialLoadOfMap = false;
        
        await loadBBoxDataAndAddToMap(lastBoundingBox.getWest(), lastBoundingBox.getSouth(), lastBoundingBox.getEast(), lastBoundingBox.getNorth());
      } else {
        if (!mapContext.current.isLoadingInProgress) { // only load data if loading not in progress
          mapContext.current.isLoadingInProgress = true;
      
          // new bbox is bigger than old one
          if (bbox.contains(lastBoundingBox.getNorthEast()) && bbox.contains(lastBoundingBox.getSouthWest()) && lastBoundingBox !== bbox) {  //if new bb is bigger than old one

            //calculate new boundingBox
            const increasedBoundingBox = increaseBoundingBox(map);
            lastBoundingBox = bbox;
            await loadBBoxDataAndAddToMap(increasedBoundingBox.west, increasedBoundingBox.south, increasedBoundingBox.east, increasedBoundingBox.north);

          } else if (!force && lastBoundingBox.contains(bbox.getNorthEast()) && lastBoundingBox.contains(bbox.getSouthWest())) { // last one contains new one
            // bbox is contained in last one, do nothing
            mapContext.current.isLoadingInProgress = false;

          } else { // bbox is not fully contained in old one, extend

            lastBoundingBox.extend(bbox);
            await loadBBoxDataAndAddToMap(lastBoundingBox.getWest(), lastBoundingBox.getSouth(), lastBoundingBox.getEast(), lastBoundingBox.getNorth());
          }

          mapContext.current.isLoadingInProgress = false;

          if (mapContext.current.enqueuedBoundingBoxes.length > 0) { // load last not loaded bounding box
            loadMapData(mapContext.current.enqueuedBoundingBoxes.pop()!);
            mapContext.current.enqueuedBoundingBoxes = [];
          }
        } else {
          mapContext.current.enqueuedBoundingBoxes.push(bbox);
        }
      }
    } catch (e) {
      mapContext.current.isLoadingInProgress = false;
    }
  };

  const isLayerVisible = (layer: string) => {
    const layerEl = layers.find(el => el.name === layer);
    return layerEl ? layerEl.displayed : false;
  };

  const changeSizeOfPoints = (newSize: number, displaySelectedPoints: boolean, overrideCircleStyle?: true) => {
    if (map.getLayer('points') && isLayerVisible('Sites')) {
      map.setPaintProperty('points', 'circle-radius', overrideCircleStyle ? newSize : [ 'match', ['get', 'xPonder'], 'true',  9,  7 ]);
    }
  };

  const changeSizeOfLines = (newSize: number) => {
    map.setPaintProperty('fibre-lines', 'line-width', newSize);
    map.setPaintProperty('microwave-lines', 'line-width', newSize);
  };

  const reduceSizeOfFeatures = () => {
    changeSizeOfPoints(2, false, true);
    if (map.getZoom() <= 4) {
      changeSizeOfLines(1);
    } else {
      changeSizeOfLines(2);
    }
  };

  const adjustPointStyle = (mapZoom: number) => {
    if (mapZoom > 11) {
      changeSizeOfPoints(7, true);
    } else if (mapZoom > 10) {
      changeSizeOfPoints(5, true);
    } else if (mapZoom > 9) {
      changeSizeOfPoints(3, true);
    } else {
      reduceSizeOfFeatures();
    }
  };

  /***
  * Show selection popup if multiple map elements (sites / links / ...) were clicked
  */
  const showSelectionPopup = (features: maplibregl.MapGeoJSONFeature[], type: 'site' | 'link', top: number, left: number) => {
    const elements: Feature[] = features.map(feature => {
      return {
        properties: feature.properties as any,
        geometry: feature.geometry as any,
        type: feature.type,
      };
    });
    
    setPopup({ isOpen: true, elements: elements, type: type, position: { left: left, top: top } });
  };
  
  const loadDetails = (feature: maplibregl.MapGeoJSONFeature[], type: 'site' | 'link', top: number, left: number) => {
    if (feature.length > 1) {
      showSelectionPopup(feature, type, top, left);
    } else {
      // load details data
      const id = feature[0].properties!.id;
      const typeOfFeature = feature[0].properties?.layer || 'site';
      loadSelectedElement(typeOfFeature, id);
    }
  };

  const handleResize = () => {
    if (map) {
      // wait a moment until resizing actually happened
      window.setTimeout(() => map.resize(), 500);
    }
  };

  const handleMapMove = () => {
    const mapZoom = map.getZoom();
    const boundingBox = map.getBounds();
    loadMapData(boundingBox);
    adjustPointStyle(mapZoom);
  };

  const handleMapClick = (e: any) => {
    const linkLayerNames = mapContext.current.furtherLayerNames.map(layer => layer + '-links');
    const serviceLayerNames = mapContext.current.furtherLayerNames.map(layer => layer + '-services');

    if (!map.getLayer('point-lamps')) { // data is shown as points

      const clickedLines = getUniqueFeatures(map.queryRenderedFeatures([[e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]], {
        layers: ['microwave-lines', 'fibre-lines', 'services', 'backup-services', ...linkLayerNames, ...serviceLayerNames],
      }), 'id');

      const clickedSites = getUniqueFeatures(map.queryRenderedFeatures([[e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]], {
        layers: ['points', ...mapContext.current.furtherLayerNames],
      }), 'id');

      if (clickedSites.length != 0) {

        loadDetails(clickedSites, 'site', e.point.x, e.point.y);
      } else if (clickedLines.length != 0) {
        loadDetails(clickedLines, 'link', e.point.x, e.point.y);
      }

    } else { // data is shown as icons

      const clickedSites = getUniqueFeatures(map.queryRenderedFeatures(e.point, { layers: ['point-lamps', 'point-building', 'point-data-center', 'point-factory', 'points', ...mapContext.current.furtherLayerNames] }), 'id');
      const clickedLines = getUniqueFeatures(map.queryRenderedFeatures([[e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]], {
        layers: ['microwave-lines', 'fibre-lines', 'services', 'backup-services', ...linkLayerNames, ...serviceLayerNames ],
      }), 'id');

      if (clickedSites.length > 0)
        loadDetails(clickedSites, 'site', e.point.x, e.point.y);
      else if (clickedLines.length != 0) {
        loadDetails(clickedLines, 'link', e.point.x, e.point.y);
      }
    }
  };

  const handleMapMoveEnd = () => {

    const boundingBox = map.getBounds();
    loadMapData(boundingBox);
   
    const mapZoom = map.getZoom().toFixed(2);
    const mapLat = map.getCenter().lat.toFixed(4);
    const mapLon = map.getCenter().lng.toFixed(4);

    if (LogLevel > 3) {
      console.log(`MapComponent::map move end - lat: ${mapLat} lon: ${mapLon} zoom: ${mapZoom}`);
    }

    if (lat !== mapLat || lon !== mapLon || zoom !== mapZoom) {
      updateMapPosition(mapLat, mapLon, mapZoom);
      updateMapStatistics(BoundingBox.createFromBoundingBox(map.getBounds()));
    }

    //switch icon layers if applicable
    mapLayerService.showIconLayers(map, showIcons);
  };

  const getAdditionalLayers = (pMap: maplibregl.Map) => {

    layers.forEach((el) => {

      if (!pMap.getLayer(el.name) && !el.base) { //base layers skipped ("points", "links", ... are added via addCommonLayers) 

        mapContext.current.furtherLayerNames.push(el.name);
      }
    });
  };

  const isZoomValid = (pZoom: number) => !Number.isNaN(pZoom) && pZoom >= MIN_ZOOM && pZoom <= MAX_ZOOM;

  const areCoordinatesValid = (pLat: number, pLon: number) => {

    const isLatValid = !Number.isNaN(pLat) && pLat >= -90 && pLat <= 90;
    const isLonValid = !Number.isNaN(pLon) && pLon >= -180 && pLon <= 180;

    if (isLatValid && isLonValid) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Moves map to coordinates and zooms in / out
   * @param coordinates lat, lon, zoom
   */
  const moveMapToCoordinates = (pMap: maplibregl.Map, coordinates: MapCoordinate) => {
    if (LogLevel > 3) {
      console.log(`MapComponent::move map to coordinates - lat: ${coordinates.lat}, lon: ${coordinates.lon}, zoom: ${coordinates.zoom}`);
    }

    if (areCoordinatesValid(coordinates.lat, coordinates.lon)) {
      let newZoom = -1;

      if (isZoomValid(coordinates.zoom)) {
        newZoom = coordinates.zoom;
      }

      pMap?.flyTo({
        center: [
          coordinates.lon,
          coordinates.lat,
        ], zoom: newZoom !== -1 ? newZoom : newZoom,
        essential: true,
      });
    }
  };

  /**
   * 
   * Moves map to include center, start and endpoint of a feature
   * 
   * @param center 
   * @param start 
   * @param end 
   */
  const centerMapOnFeature = (pMap: maplibregl.Map, center: Coordinate | null, start?: Coordinate, end?: Coordinate) => {
   
    let newBounds = new maplibregl.LngLatBounds();
    const allValues = { center, start, end };
    Object.values(allValues).forEach(value => {
      if (value) {
        newBounds.extend([value.lon, value.lat]);
      }
    });
  
    //zooms in/out to accommodate bounding box
    pMap?.fitBounds(newBounds, { padding: 20 });
  };

  const updateMapBasedOnLayers = (pMap: maplibregl.Map) => {

    layers.forEach(el => {

      //deactivate / activate layers

      if (el.name == 'Links') {
        pMap.setLayoutProperty('fibre-lines', 'visibility', el.displayed ? 'visible' : 'none');
        pMap.setLayoutProperty('microwave-lines', 'visibility', el.displayed ? 'visible' : 'none');

      } else if (el.name == 'Sites') {
        pMap.setLayoutProperty('points', 'visibility', el.displayed ? 'visible' : 'none');

        if (el.displayed) {
          const mapZoom = pMap.getZoom();
          adjustPointStyle(mapZoom);
        }
      } else if (el.name == 'Services') {
        pMap.setLayoutProperty('services', 'visibility', el.displayed ? 'visible' : 'none');
      } else if (pMap.getLayer(el.name)) {

        pMap.setLayoutProperty(el.name, 'visibility', el.displayed ? 'visible' : 'none');
        if (pMap.getLayer(el.name + '-links') && pMap.getLayer(el.name + '-services')) {

          pMap.setLayoutProperty(el.name + '-links', 'visibility', el.displayed ? 'visible' : 'none');
          pMap.setLayoutProperty(el.name + '-services', 'visibility', el.displayed ? 'visible' : 'none');
        }
      }
    });
  };

  const rearrangeLayers = (pMap: maplibregl.Map) => {
    pMap.moveLayer('services');
    pMap.moveLayer('selectedPoints');
  };

  const setupMap = () => {

    let initialLat = lat;
    let initialLon = lon;
    let initialZoom = zoom;
    mapContext.current.isInitialLoadOfMap = true;

    if (settings.mapSettings?.startupPosition) {
      if (settings.mapSettings.startupPosition.latitude) {
        initialLat = settings.mapSettings.startupPosition.latitude;
      }

      if (settings.mapSettings.startupPosition.longitude) {
        initialLon = settings.mapSettings.startupPosition.longitude;
      }

      if (settings.mapSettings.startupPosition.zoom) {
        initialZoom = settings.mapSettings.startupPosition.zoom;
      }
    }

    map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: OSM_STYLE as any,
      center: [Number(initialLon), Number(initialLat)],
      zoom: Number(initialZoom),
    });

    mapRef.current = map;

    map.on('load', () => {
     
      if (LogLevel > 3) {
        console.log('MapComponent::map loaded');
      }

      map.setMaxZoom(MAX_ZOOM);
      const bbox = map.getBounds();

      if (lastBoundingBox == null) {
        lastBoundingBox = bbox;
      }

      updateMapPosition(bbox.getCenter().lat.toFixed(4), bbox.getCenter().lng.toFixed(4), map.getZoom().toFixed(2));
      mapLayerService.addBaseSources(map, selectedSite, selectedLink, selectedService);
      
      //loading icons used in "icon switch" logic
      addImages(map, () => {
        if (map.getZoom() > 11 && showIcons) {
          mapLayerService.addIconLayers(map);
        } else {
          mapLayerService.addBaseLayers(map);
          if (map.getZoom() < 9) {
            reduceSizeOfFeatures();
          }
        }
        updateOpacity();
        if (!mapContext.current.areLayersLoaded) {
          mapContext.current.areLayersLoaded = true;
          getAdditionalLayers(map);
          mapLayerService.addLayersToMap(map,  mapContext.current.furtherLayerNames);
          rearrangeLayers(map);
        }
        updateMapBasedOnLayers(map);
      });

      const boundingBox = map.getBounds();
      loadMapData(boundingBox);
      updateMapStatistics(BoundingBox.createFromBoundingBox(boundingBox));
      map.on('click', handleMapClick);
      map.on('move', handleMapMove);
      map.on('moveend', handleMapMoveEnd);
      map.on('rotate', (ev) => {
        const targetMap = ev.target;
        setBearing(targetMap.getBearing());
      });
    });
  };

  useEffect(() => {

    // resize the map, if menu gets collapsed
    window.addEventListener('menu-resized', handleResize);

    //pass themes to mapLayerService
    updateTheme();

    // try if connection to tile + topology server are available
    Promise.all([
      dataService.tryReachTileServer(),
      dataService.tryReachTopologyServer(),
      updateLayers(),
    ]).then(([tileServerReachableResult, topologyServerReachableResult]) => {
      setTileServerLoaded(tileServerReachableResult);
      setTopologyServerLoaded(topologyServerReachableResult);
      
      //both done 
      setConnectivityCheck(false);
    });

    return () => {
      //unregister events
      window.removeEventListener('menu-resized', handleResize);

      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.off('moveend', handleMapMoveEnd);
        mapRef.current.off('move', handleMapMove);
      }

      // will be checked again on next load
      setConnectivityCheck(true);
    };
  }, []);

  useEffect(() => {
    updateTheme();
  }, [settings]);

  // load map
  useEffect(() => {
  
    // if everything done loading/reachable, load map
    if (!isConnectivityCheckBusy && isTopologyServerReachable && isTileServerReachable && !settings.isLoadingData) {

      if (mapRef.current === undefined) {
        setupMap();
      } else
      if (mapRef.current.getContainer() !== mapContainerRef.current) {
        // reload map, because the current container (fresh div) doesn't hold the map and changing containers isn't supported
        mapRef.current.remove();
        setupMap();
      }
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = undefined;
      }
    };
  }, [isConnectivityCheckBusy, isTopologyServerReachable, isTileServerReachable, settings.isLoadingData]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedSite !== null) {

      if (mapRef.current.getSource('selectedPoints')) {
        (mapRef.current.getSource('selectedLine') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
        (mapRef.current.getSource('selectedPoints') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [selectedSite] });
      }

      if (mapRef.current.getLayer('point-lamps')) {

        //reset filters (remove earlier 'selected' (bigger) icons)

        mapRef.current.setFilter('point-lamps', ['==', 'type', 'street lamp']);
        mapRef.current.setFilter('point-data-center', ['==', 'type', 'data center']);
        mapRef.current.setFilter('point-building', ['==', 'type', 'high rise building']);
        mapRef.current.setFilter('point-factory', ['==', 'type', 'factory']);
      }
    } else if (selectedLink !== null) {
      if (mapRef.current.getLayer('point-lamps')) {
        mapRef.current.setFilter('point-lamps', ['==', 'type', 'street lamp']);
        mapRef.current.setFilter('point-data-center', ['==', 'type', 'data center']);
        mapRef.current.setFilter('point-building', ['==', 'type', 'high rise building']);
        mapRef.current.setFilter('point-factory', ['==', 'type', 'factory']);
      }

      if (mapRef.current.getSource('selectedLine')) {
        (mapRef.current.getSource('selectedPoints') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
        (mapRef.current.getSource('selectedLine') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [selectedLink] });
      }
    } else if (selectedService !== null) {
      if (mapRef.current.getLayer('point-lamps')) {
        mapRef.current.setFilter('point-lamps', ['==', 'type', 'street lamp']);
        mapRef.current.setFilter('point-data-center', ['==', 'type', 'data center']);
        mapRef.current.setFilter('point-building', ['==', 'type', 'high rise building']);
        mapRef.current.setFilter('point-factory', ['==', 'type', 'factory']);
      }

      if (mapRef.current.getSource('selectedLine')) {
        (mapRef.current.getSource('selectedPoints') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
        (mapRef.current.getSource('selectedLine') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [selectedService] });
      }
    } else if (selectedLink == null && selectedService == null && selectedSite == null) {
      //if nothing is selected, remove highlighting (happens after eg changing the details url / element not found)
      if (mapRef.current.getSource('selectedLine')) {
        (mapRef.current.getSource('selectedPoints') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
        (mapRef.current.getSource('selectedLine') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
      }
    }

  }, [selectedSite, selectedLink, selectedService]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapRef.current?.getZoom() > 11) {
      mapLayerService.showIconLayers(map, showIcons);
    }
  }, [showIcons]);

  useEffect(() => {
    if (LogLevel > 3) {
      console.log(`MapComponent:: store state coordinates changed to: lat: ${lat} lon: ${lon} zoom: ${zoom}`);
    }

    if (!mapRef.current) {
      return;
    }

    const center = mapRef.current.getCenter();
    const isMapAtSamePosition = center.lat.toFixed(4) === lat && center.lng.toFixed(4) === lon && mapRef.current.getZoom().toFixed(2) === zoom;
  
    if (!isMapAtSamePosition) {
      moveMapToCoordinates(mapRef.current, { lat: Number(lat), lon: Number(lon), zoom: Number(zoom) });
    }
    
  }, [lat, lon, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (zoomToElement) {
      centerMapOnFeature(mapRef.current, zoomToElement.center, zoomToElement.start, zoomToElement.end);
      mapRef.current.once('zoomend', () => { zoomFinished(); });
    }
  }, [zoomToElement]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapContext.current.areLayersLoaded) {
      mapContext.current.areLayersLoaded = true;
      getAdditionalLayers(mapRef.current);
      mapLayerService.addLayersToMap(mapRef.current,  mapContext.current.furtherLayerNames);
      rearrangeLayers(mapRef.current);
    }
    updateMapBasedOnLayers(mapRef.current);
  }, [layers]);

  const handleZoomIn = () => {
    if (!map.isZooming())
      map.zoomIn();
  };

  const handleZoomOut = () => {
    if (!map.isZooming())
      map.zoomOut();
  };

  const handleAlignBearingNorth = () => {
    if (!map.isMoving())
      map.resetNorth();
  };

  const styles = useStyles();

  if (LogLevel > 3) {
    console.log(`MapComponent::render - lat: ${lat}, lon: ${lon}, zoom: ${zoom}, networkFilter: ${networkFilter.value}, showIcons: ${showIcons}`);
  }

  return (
    <>
      <NetworkFilterObserver value={networkFilter.value} onDidUpdate={() => {
        if (LogLevel > 3) {
          console.log(`MapComponent::render - networkFilter changed to ${networkFilter.value} ${mapRef.current}`);
        }
        if (!mapRef.current) {
          return;
        }
        const boundingBox = mapRef.current.getBounds();
        loadMapData(boundingBox, true);
      }} />
      {
        !settings.isLoadingData
          ? (
            <div aria-label="network-map" id="map" className={styles.map} ref={mapContainerRef} >
              {(popup && popup.isOpen)
                ? (<MapPopup {...popup} onClose={() => { setPopup(null); }} />)
                : null
              }
              <MapControl bearing={bearing} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onAlignNorth={handleAlignBearingNorth} />
              <FilterBar />
              <SearchBar />
              <Statistics />
              <MapLayer />
              <ConnectionInfo />
            </div>
          )
          : (
            <div />
          )
      }
    </>
  );
});

Map.displayName = 'Map';

export { Map };
