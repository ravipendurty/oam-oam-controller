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



type Site = {
  lon: number;
  lat: number;
  id: number; 
  tiltDeg: number;
  name: string;
  amslM: number | null;
  radioAntenna: Antenna | null;
  azimuthDeg: number; 
  radio: Radio | null;
  waveguide: Waveguide | null;
  
};
type LinkOperationalParameters = {
  rainPolarity: string;
  rainModel: string;
  rainRate: number;
  absorptionMethod:string;
  calculationPeriod: string;
  bandKeyId: string;
  bandplanKeyId: string;
  selectedChannelList: string[];
  inheritedFrequencyPlanA: 'INHERIT' | 'INVERTED' | '';
  inheritedFrequencyPlanB: 'INHERIT' | 'INVERTED' | '';
};
export type Link = {
  id: number;
  name: string;
  operator: string;
  lengthKm: number;
  type: string;
  siteA: Site;
  siteB: Site;
  operationalParameters : LinkOperationalParameters;
};

type Radio = {
  id: number; 
  modelId: number; 
  modelName : string; 
  operationalParameters: {
    modulationType: string; 
    transmissionPower: number | null;
    enabledAdmModulations : string[];
  };
};

type Antenna = {
  gainDb: number; 
  id: number;
  modelId: number; 
  modelName: string; 
  tiltDeg: number;
  operationalParameters: {
    agl : number;
  };
};

type Waveguide = {
  id: number; 
  modelId: number; 
  modelName: string; 
  lengthM: number; 
  lossDbPerM: number; 
  type: string; 
  operationalParameters: {
    waveguideLength : number;
  };
};