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

export type SiteManagerAreas = {
  id: string;
  name: string;
  'tree-level': number;
  'parent-id'?: string;
  'area-count'?: number;
  'site-count'?: number;
  'site-level'?: boolean;
  'areas'?: SiteManagerAreas[];
};

export interface ITreeViewItem {
  id: string;
  name: string;
  isSite: boolean;
  isCategory: boolean;
  parentId: string;
  areaCount: number;
  siteCount: number;
  isNodeSelected: boolean;
  uuid?: number;
  treeLevel?: number;
  siteLevel?: boolean;
  url?: string;
  linkType?: string;
  children?: ITreeViewItem[];
}

export type Sites = {
  id: string;
  uuid: string;
  name: string;
  amslInMeters: string;
  type: string;
  'area-id': string;
  'item-count': number;
  address: {
    streetAndNr: string;
    city: string;
    zipCode: string;
    country: string;
  };
  operator: string;
  location: {
    lon: string;
    lat: string;
  };
};

export interface SearchSiteIdResult {
  areas: SiteManagerAreas[];
  sites: Sites[];
  isError: boolean;
  errorMessage: string;
}

export interface SitesListResult {
  sites: Sites[];
  isError: boolean;
  errorMessage: string;
}

export type SiteManagerCategories = {
  id: string;
  name: string;
  url: string;
  'link-type': string;
};

export type SiteManagerCategoryItems = {
  name: string;
  url: string;
  'last-update': string;
}[];

export type SiteManagerSiteOrderItemsDetails = {
  assignedUser: string;
  state: string;
  note: string;
  tasks: {
    type: string;
    description: string;
    completed: boolean;
  }[];
}[];

export type LinkDetails = {
  administrativeState: string;
  deviceA: { id: number; nodeId: string; uuid: string };
  deviceB: { id: number; nodeId: string; uuid: string };
  id: number;
  labels: [];
  lifecycleState: string;
  name: string;
  operationalState: string;
  operatorId: string;
  siteA: {
    areaId: string;
    areaName: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    operatorId: string;
    uuid: string;
  };
  siteB: {
    areaId: string;
    areaName: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    operatorId: string;
    uuid: string;
  };
  type: string;
  uuid: string;
};

export type DeviceDetails = {
  areaId: string;
  areaName: string;
  calculationParameters: string;
  id: number;
  manufacturerId: number;
  manufacturerName: string;
  modelId: number;
  modelName: string;
  nodeId: string;
  operationalParameters: string;
  siteId: number;
  siteName: string;
  uuid: string;
};

export type SiteConfigurationFreqPlan = [
  {
    id: number;
    siteId: number;
    band: {
      id: number;
      name: string;
      duplexspacingMhz: number;
    };
    status: string;
    configuration: string;
    comment: string;
  },
];

export type addEditSiteConfig = {
  configuration: string;
  comment: string;
};


export type Bands = [
  {
    id: number;
    name: string;
    duplexspacingMhz: number;
  },
];
