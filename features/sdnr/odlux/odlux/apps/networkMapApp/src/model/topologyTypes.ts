/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import { Coordinate } from './coordinates';

type Point = {
  type: 'Point';
  coordinates: number[];
};

type LineString = {
  type: 'LineString';
  coordinates: number[][];
};

export type Geometry = Point | LineString;

export type Feature = {
  type: 'Feature';
  properties: {
    id: number;
    subType?: string;
    layer?: string;
    labels?: string[];
    xPonder?: boolean;
    polarization?: string;
  };
  geometry: Geometry;
};

export type Address = {
  streetAndNr: string;
  city: string;
  zipCode: string | null;
  country: string;
};

export type Service = {
  id: number;
  name: string;
  backupForServiceId: number | null;
  lifecycleState: string;
  administrativeState: string;
  operationalState: string;
  created: string;
  modified: string;
  route: Coordinate[];
  length: number;
  feature: Feature;
};

export type Site = {
  id: number;
  uuid: string;
  name: string;
  address: Address;
  heightAmslInMeters?: number; //AboveGroundLevel
  antennaHeightAmslInMeters?: number;
  operator: string;
  location:{ lon: number; lat: number };
  devices: Device[];
  links: {
    id: number;
    name: string;
    azimuth: number | null;
  }[];
  furtherInformation: string;
  feature: Feature;
};

export type Device = {
  id: string;
  type?: string;
  name: string;
  manufacturer: string;
  owner: string;
  status?: string;
  port: number[];
};

type Antenna = {
  id: string;
  name: string;
  height: number;
  gain: number;
};

type LinkDetailLocation = {
  lon: number;
  lat: number;
  siteId: number;
  siteName: string | null;
  amsl: number | null;
  azimuth: number | null;
  antenna: Antenna;
  radio: {
    id: number;
    name: string;
  };
  waveguide: {
    id: number;
    name: string;
  };
};

export type Link = {
  id: number;
  uuid: string;
  name: string;
  operator: string;
  length: number;
  polarization: string;
  frequency: number | null;
  siteA: LinkDetailLocation;
  siteB: LinkDetailLocation;
  feature: Feature;
};

export enum DetailsTypes {
  service = 'service',
  site = 'site',
  link = 'link',
}

export const isSite = (data: Link | Site | Service): data is Site => data.feature.properties.layer === DetailsTypes.site;

export const isLink = (data: Link | Site | Service): data is Link => data.feature.properties.layer === DetailsTypes.link;

export const isService = (data: Link | Site | Service): data is Service => data.feature.properties.layer === DetailsTypes.service;
