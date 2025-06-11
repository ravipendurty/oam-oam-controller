/* eslint-disable no-param-reassign */
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

import { LatLon } from '../model/lineOfSightLatLon';

export const addBaseSource = (map: maplibregl.Map, name: string) => {
  if (!map.getSource(name))
    map.addSource(name, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
};

export const addPoint = (map: maplibregl.Map, point: LatLon) => {
  const json = `{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": 
        [${point.longitude}, ${point.latitude}]
      }
    }`;
  (map.getSource('route') as maplibregl.GeoJSONSource).setData(JSON.parse(json));
};

export const addBaseLayer = (map: maplibregl.Map, sourceName: string) => {
  if (!map.getLayer('line'))
    map.addLayer({
      'id': 'line',
      'type': 'line',
      'source': sourceName,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': '#88A',
        'line-width': 6,
        'line-opacity': 0.75,
      },
    });

  if (!map.getLayer('points'))
    map.addLayer({
      id: 'points',
      type: 'circle',
      source: sourceName,
      paint: {
        'circle-radius': 5,
        'circle-color': '#223b53',
        'circle-stroke-color': '#225ba3',
        'circle-stroke-width': 3,
        'circle-opacity': 0.5,
      },
    });
};

const degrees_to_radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const radians_to_degrees = (radians: number) => {
  var pi = Math.PI;
  return radians * (180 / pi);
};

//taken from https://www.movable-type.co.uk/scripts/latlong.html
export const calculateMidPoint = (lat1: number, lon1: number, lat2: number, lon2: number): LatLon => {
  const dLon = degrees_to_radians(lon2 - lon1);
  //convert to radians
  lat1 = degrees_to_radians(lat1);
  lat2 = degrees_to_radians(lat2);
  lon1 = degrees_to_radians(lon1);

  const Bx = Math.cos(lat2) * Math.cos(dLon);
  const By = Math.cos(lat2) * Math.sin(dLon);
  const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
  const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  const coordinate: LatLon = { latitude: radians_to_degrees(lat3), longitude: radians_to_degrees(lon3) };
  return coordinate;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export const calculateDistanceInMeter = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const lonRad1 = toRad(lon1);
  const latRad1 = toRad(lat1);
  const lonRad2 = toRad(lon2);
  const latRad2 = toRad(lat2);
  const dLon = lonRad2 - lonRad1;
  const dLat = latRad2 - latRad1;
  const a = Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(latRad1) * Math.cos(latRad2) *
    Math.pow(Math.sin(dLon / 2), 2);
  const c = 2 * Math.asin(Math.sqrt(a));

  return 6378 * c;
};



