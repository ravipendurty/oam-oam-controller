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
// export type TopologyTypes ={
//     rainLoss : RainLoss,
//     freeSpaceLoss: FreeSpaceLoss,
//     absorption : Absorption
// }

export type RainLoss = {
  rainAttenuation: number;
  rainFall: {
    rainrate: number;
    period: string;
  };
};


export type FreeSpaceLoss = {
  fspl: number;
};

export type Absorption = {
  oxygenLoss: number;
  waterLoss: number;
  totalAbsorptionLoss: number;
  period: string;
};


export type LinkBudget = {
  systemOperatingMarginA: number;
  systemOperatingMarginB: number;
  eirpA: number;
  eirpB: number;
  receivedPowerA: number;
  receivedPowerB: number;
};

export type Distance = {
  distanceInKm: number;
};

export type RadioBand = {
  keyId: string;
  name: string;
  duplexspacingMHz: number;
  centerFrequencyMHz: number;
};

export type Model = {
  modelId: number;
  id: number;
  modelName: string;
  operationalParameters: any;
  calculationParameters: any;
  type: { id: number; name: string; description: string };
  band: RadioBand;
};

export type ModelType = {
  id: number; 
  name: string; 
  description: string;
};

