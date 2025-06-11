/* eslint-disable @typescript-eslint/no-shadow */
/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2021 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import React, { FC, useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import maplibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { render } from 'react-dom';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { SetReachableAction } from '../actions/lineOfSightCommonActions';
import { ClearSavedChartAction, SetEndpointAction, SetHeightA, SetHeightB, SetMapCenterAction, SetStartPointAction } from '../actions/lineOfSightMapActions';

import { GPSProfileResult } from '../model/lineOfSightGPSProfileResult';
import { Height } from '../model/lineOfSightHeight';
import { LatLon } from '../model/lineOfSightLatLon';

import { getGPSProfile } from '../service/lineOfSightHeightService';
import { addBaseLayer, addBaseSource, addPoint, calculateMidPoint } from '../utils/lineOfSightMap';
import { max, min } from '../utils/lineOfSightMath';

import ConnectionErrorPopup from './lineOfSightConnectionErrorPoup';
import { HeightChart } from './lineOfSightHeightChart';
import MapContextMenu from './lineOfSightMapContextMenu';
import MapInfo from './lineOfSightMapInfo';

import { OSM_STYLE, URL_BASEPATH } from '../config';

type MapProps = RouteComponentProps;

const styles = makeStyles({
  chart: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

let map: maplibregl.Map;

const Map: FC<MapProps> = (props) => {

  const center = useSelectApplicationState(state => state.microwave.map.center);
  const zoom = useSelectApplicationState(state => state.microwave.map.zoom);
  const start = useSelectApplicationState(state => state.microwave.map.start);
  const end = useSelectApplicationState(state => state.microwave.map.end);
  const siteAHeight = useSelectApplicationState(state => state.microwave.map.heightA);
  const siteBHeight = useSelectApplicationState(state => state.microwave.map.heightB);
  const ready = useSelectApplicationState(state => state.microwave.map.ready);

  const dispatch = useApplicationDispatch();
  const clearChartAction = () => dispatch(new ClearSavedChartAction);
  const setMapPosition = (point: LatLon, zoom: number) => dispatch(new SetMapCenterAction(point, zoom));
  const setHeightStart = (height: Height) => dispatch(new SetHeightA(height));
  const setHeightEnd = (height: Height) => dispatch(new SetHeightB(height));
  const setStartPosition = (position: LatLon | null) => dispatch(new SetStartPointAction(position));
  const setEndPosition = (position: LatLon | null) => dispatch(new SetEndpointAction(position));
  const setReachable = (reachable: boolean | null) => dispatch(new SetReachableAction(reachable));

  const [data, setData] = useState<GPSProfileResult[] | number>(Number.NaN);
  const [dataMin, setDataMin] = useState<GPSProfileResult | undefined>();
  const [dataMax, setDataMax] = useState<GPSProfileResult | undefined>();
  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<{ map: maplibregl.Map | null }>({ map: null });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const classes = styles();

  const heightA = siteAHeight !== null ? siteAHeight.amsl + siteAHeight.antennaHeight : 0;
  const heightB = siteBHeight !== null ? siteBHeight.amsl + siteBHeight.antennaHeight : 0;

  const handleResize = () => {

    if (map) {
      // wait a moment until resizing actually happened
      window.setTimeout(() => map.resize(), 500);
    }
  };

  useEffect(() => {
    window.addEventListener('menu-resized', handleResize);
    return () => {
      window.removeEventListener('menu-resized', handleResize);
      const center = mapRef.current.map?.getCenter();
      const mapZoom = mapRef.current.map?.getZoom();
      if (center) {
        setMapPosition({ latitude: center.lat, longitude: center.lng }, mapZoom!);
      }
      setReachable(null);
    };

  }, []);



  const zoomInOnLink = (start: LatLon, end: LatLon) => {
    const center = calculateMidPoint(start.latitude, start.longitude, end.latitude, end.longitude);
    const newBounds = new maplibre.LngLatBounds();
    const allValues = { center, start, end };
    Object.values(allValues).forEach(value => {
      if (value) {
        newBounds.extend([value.longitude, value.latitude]);
      }
    });
    //zooms in/out to accumulate bounding box
    map.fitBounds(newBounds, { padding: 20 });
  };

  const drawChart = () => {
    if (start && end) {
      addBaseSource(map, 'route');
      addBaseLayer(map, 'route');
      zoomInOnLink(start, end);
      const json = `{
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [${start.longitude}, ${start.latitude}],
              [${end.longitude}, ${end.latitude}]
            ]}
          }`;
      (map.getSource('route') as maplibregl.GeoJSONSource).setData(JSON.parse(json));
      getGPSProfile({ latitude: start.latitude, longitude: start.longitude }, { latitude: end.latitude, longitude: end.longitude }).then(data => {
        if (Array.isArray(data)) {
          setDataMin(min(data, d => d.height));
          setDataMax(max(data, d => d.height));
        }
        setData(data);
      });
    } else if (start || end) {
      const point = start !== null ? start : end!;
      addBaseSource(map, 'route');
      addBaseLayer(map, 'route');
      addPoint(map, point);
    } else {
      //delete layers and source
      //used instead of clearing source data because it has better performance 
      //(setting data to empty results in a noticeable lag of line being cleared)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      mapRef.current.map?.getLayer('line') && mapRef.current.map?.removeLayer('line') &&
        mapRef.current.map?.removeLayer('points') && mapRef.current.map?.removeSource('route');
    }
  };

  const updateLosUrl = () => {
    if (start && end) {
      const locationPart = `lat1=${start.latitude}&lon1=${start.longitude}&lat2=${end.latitude}&lon2=${end.longitude}`;
      let heightPart = '';
      if (siteAHeight && siteBHeight) {
        heightPart = `&amslA=${siteAHeight.amsl}&antennaHeightA=${siteAHeight.antennaHeight}&amslB=${siteBHeight.amsl}&antennaHeightB=${siteBHeight.antennaHeight}`;
      }
      props.history.replace(`/${URL_BASEPATH}/los?${locationPart}${heightPart}`);
    } else if (!start && !end) {
      props.history.replace(`/${URL_BASEPATH}`);
    }
  };

  const updateHeightA = (value: number, value2: number) => {
    setHeightStart({ amsl: value, antennaHeight: value2 });
  };

  const updateHeightB = (value: number, value2: number) => {
    setHeightEnd({ amsl: value, antennaHeight: value2 });
  };

  const OnEndPosition = (position: maplibregl.LngLat) => {
    setEndPosition({ latitude: position.lat, longitude: position.lng });
  };

  const OnStartPosition = (position: maplibregl.LngLat) => {
    setStartPosition({ latitude: position.lat, longitude: position.lng });
  };

  const mapMoveEnd = () => {
    const mapZoom = Number(map.getZoom().toFixed(2));
    const lat = Number(map.getCenter().lat.toFixed(4));
    const lon = Number(map.getCenter().lng.toFixed(4));
    setMapPosition({ latitude: lat, longitude: lon }, mapZoom);
  };

  const setupMap = () => {
    let initialLat = center.latitude;
    let initialLon = center.longitude;
    let initialZoom = zoom;

    map = new maplibre.Map({
      container: mapContainerRef.current!,
      style: OSM_STYLE as any,
      center: [initialLon, initialLat],
      zoom: initialZoom,
    });

    mapRef.current.map = map;

    map.on('load', () => {

      map.setMaxZoom(18);
      setMapLoaded(true);

      //add source, layer
      addBaseSource(map, 'route');
      addBaseLayer(map, 'route');

    });

    let currentPopup: maplibregl.Popup | null = null;
    map.on('contextmenu', (e) => {
      if (currentPopup)
        currentPopup.remove();
      //change height if start/end changes
      const popupNode = document.createElement('div');
      render(
        <MapContextMenu pos={e.lngLat}
          onStart={(p) => { OnStartPosition(p); if (currentPopup) currentPopup.remove(); }}
          onEnd={(p) => { OnEndPosition(p); if (currentPopup) currentPopup.remove(); }}
          onHeightA={(p, p1) => updateHeightA(p, p1)}
          onHeightB={(p, p1) => updateHeightB(p, p1)} />,
        popupNode);

      currentPopup = new maplibre.Popup()
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(map);
    });
    map.on('moveend', mapMoveEnd);
  };

  useEffect(() => {
    if (ready) {
      setupMap();
    }
  }, [ready]);

  useEffect(() => {
    if (ready && isMapLoaded) {
      drawChart();
      updateLosUrl();
    }
  }, [start, end, isMapLoaded]);

  return <>
    <div id="map" style={{ width: '100%', height: '100%', position: 'relative' }} ref={mapContainerRef} >
      <MapInfo minHeight={dataMin} maxHeight={dataMax} />
      <ConnectionErrorPopup reachable={ready} />

      {typeof data === 'object'
        ? (
          < div className={classes.chart} onClick={() => {
            setData(Number.NaN);
            setDataMax(undefined);
            setDataMin(undefined);
            clearChartAction();
          }}>
            <HeightChart heightPosA={heightA} heightPosB={heightB} width={mapContainerRef.current?.clientWidth!} height={mapContainerRef.current?.clientHeight!} data={data} dataMin={dataMin!} dataMax={dataMax!} />
          </div>
        )
        : null
      }

    </div>
  </>;
};

export default withRouter(Map);