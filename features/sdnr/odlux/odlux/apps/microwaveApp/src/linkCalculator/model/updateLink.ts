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
   modulationType: string;
   transmissionPower: number;
   waveguideLength: number | null;
   agl: number;
   radioModelId: number;
   waveguideModelId: number;
   radioAntennaModelId: number;
   enabledAdmModulations: string[];
 
 };
 type LinkOperationalParameters = {
   rainPolarity: string;
   rainModel: string;
   rainRate: number;
   absorptionMethod: string;
   calculationPeriod: string;
   bandKeyId: string;
   bandplanKeyId: string;
   selectedChannelList: SaveChannel[];
 };

export type UpdateLink = {
  siteA: Site;
  siteB: Site;
  linkOperationalParameters: LinkOperationalParameters;
};

export type SaveChannel = {
  channelKeyId : string;
  channelPolarizationEnum: 'HORIZONTAL' | 'VERTICAL' | 'XPOL' | '';
};