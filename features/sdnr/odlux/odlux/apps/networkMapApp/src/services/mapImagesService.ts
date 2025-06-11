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

import maplibregl from 'maplibre-gl';

import apartment from '../../icons/apartment.png';
import dataCenter from '../../icons/datacenter.png';
import factory from '../../icons/factory.png';
import lamp from '../../icons/lamp.png';
import dataCenterRed from '../../icons/datacenterred.png';
import factoryRed from '../../icons/factoryred.png';
import lampRed from '../../icons/lampred.png';


type ImagesLoaded = (allImagesLoaded: boolean) => void;

export const ImagesMap: { name: string; url: string }[] = [
  { name: 'data-center', url: dataCenter },
  { name: 'house', url: apartment },
  { name: 'factory', url: factory },
  { name: 'lamp', url: lamp },
  { name: 'data-center-red', url: dataCenterRed },
  { name: 'factory-red', url: factoryRed },
  { name: 'lamp-red', url: lampRed },
];

export const addImages = (map: maplibregl.Map, callback?: ImagesLoaded) => {
  ImagesMap.forEach(image => {
    map.loadImage(
      image.url,
      (error: any, img: any) => {
        if (error) throw error;
        map.addImage(image.name, img);
    
        // continue if all images are loaded
        if (callback && ImagesMap.every(({ name }) => map.hasImage(name))) {
          callback(true);
        }
      });
  });
};