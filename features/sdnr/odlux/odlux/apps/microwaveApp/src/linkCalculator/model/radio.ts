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

import { Modulation } from './modulation';

export type Radio = {
  id: number;
  modelId:number;
  modelName: string;
  type: {
    id: number;
    name: string;
    description: string;
  } | null;
  operationalParameters: RadioOperationalParameters | null;
  calculationParameters: RadioCalculationPrameters | null;
};

export type RadioOperationalParameters = {
  modulations: Modulation;
  C0I: string;
  band: string;
  bandwith: string;
  cir: string;
  eth: string;
  lagE1: string;
  lagEth: string;
  mpls: string;
  pdh: string;
  rxMax: string;
  sdh: string;
  xpic: string;
};

export type RadioEverything = {
  operationalParametersA : RadioOperationalParameters | null;
  operationalParametersB : RadioOperationalParameters | null;
  modulationListA: string[] | null;
  modulationListB: string[] | null;
  radioIdSiteA: number | null;
  radioIdSiteB: number | null;
};

export type RadioCalculationPrameters = {
  transmissionPower:number;
  referenceModulation:string;
};