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

export const URL_API = '/topology/network';
export const SITEDOC_URL = '/sitedoc';
export const URL_TILE_API = '/tiles';
export const URL_BASEPATH = 'network';

export const TERRAIN_URL = '/terrain'; //http://10.20.11.249:5200 maybe?  /terrain
export const TILE_URL = '/tiles'; //http://tile.openstreetmap.org  /tiles
   
export const ELECTROMAGNETC_FIELD = '/electromagnetic-field/';
export const ANTENNA_MAP = '/electromagnetic-field/';

export const OSM_STYLE = {
  'version': 8,
  'sources': {
    'raster-tiles': {
      'type': 'raster',
      'tiles': [
        TILE_URL + '/{z}/{x}/{y}.png',
      ],
      'tileSize': 256,
      'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    'signal-level': {
      'type': 'raster',
      'tiles': [
        ELECTROMAGNETC_FIELD + '?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=layers=campusos%3Abest_server_test',
      ],
      'tileSize': 256,
    },
    'antenna-map': {
      'type': 'raster',
      'tiles': [
        ELECTROMAGNETC_FIELD + '?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=layers=campusos%3Asector_markers',
      ],
      'tileSize': 256,
    },
  },
  'layers': [
    {
      'id': 'osm-map',
      'type': 'raster',
      'source': 'raster-tiles',
      'minZoom': 0,
      'maxZoom': 18,
    },
    {
      'id': 'signal level',
      'type': 'raster',
      'source': 'signal-level',
      'minZoom': 0,
      'maxZoom': 18,
      'background-opacity': 1,
      'layout': {
        'visibility': 'none',
      },
    },   
    {
      'id': 'antenna map',
      'type': 'raster',
      'source': 'antenna-map',
      'minZoom': 0,
      'maxZoom': 18,
      'background-opacity': 1,
      'layout': {
        'visibility': 'none',
      },
    },   
  ],
};


