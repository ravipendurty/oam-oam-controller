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

export type AdaptiveModulationResponse = {
  aToB: AdaptiveModulationTable[];
  bToA: AdaptiveModulationTable[];
};
export type AdaptiveModulationTable = {
  modulation: string;
  dataRate: number;
  'receiverThresholdBER-3': number;
  'receiverThresholdBER-6': number;
  receivedSignalLevel: number;
  'linkMarginBER-3': number;
  'linkMarginBER-6': number;
  'txPowerMin':number;
  'txPowerMax':number;
  'rainAvailabilityBER-3': number;
  'rainAvailabilityBER-6' : number;
  'multipathAvailabilityBER-3': number;
  'multipathAvailabilityBER-6' : number;
};
