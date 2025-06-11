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

export type Antenna = {
  modelId: number;
  id:number;
  modelName: string;
  type: {
    id: number;
    name: string;
    description: string;
  } | null;
  operationalParameters: AntennaOperationalParameters | null;
  calculationParameters : AntennaCalculationPrameters | null;
};
export type AntennaOperationalParameters = {
  style: string;
  xpol: string;
  band: number;
  diameter: string;
  agl: number;
  amsl:number;
  gain: number;
  xpd: string;
  ipi: string;
  fbRation: string;
};
export type AntennaCalculationPrameters = {
    
};
