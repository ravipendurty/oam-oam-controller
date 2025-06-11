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

export type RegionRegulator = {
  country: string;
  keyId: string;
  name: string;
  regulatorName: string;
};

// export type ChannelQuery = {
//   data: Channel[];
//   message?: string;
//   status: number;
// };
export type Channel = {
  keyId: string;
  number: number;
  name: string;
  channelSpacing: ChannelSpacing;
  bandwidthMHz: BandwidthMhz;
  centerFrequencyHigh: number;
  centerFrequencyLow: number;
  xPolCondition: XpolCondition;
  availability: Availability;
  description: string;
  polarization: 'HORIZONTAL' | 'VERTICAL' | 'XPOL' | '';
};

export type ChannelTable = {
  keyId: string;
  name: string;
  bandwidthMHz: number;
  centerFrequencyHigh: number;
  centerFrequencyLow: number;
  availability: string;
  xPolCondition: string;
  polarization: 'HORIZONTAL' | 'VERTICAL' | 'XPOL' | '';
};
export type ChannelSpacing = {
  id: number;
  name: string;
};
export type BandwidthMhz = {
  id: number;
  name: string;
  bandwidthMHz: number;
};
export type XpolCondition = {
  id: number;
  name: string;
};
export type Availability = {
  id: number;
  name: string;
};

export type FrequencyPlan = {
  configuration: string;
  id: number;
  siteId: number;
  band: {
    keyId: string;
    name: string;
    duplexspacingMHz: number;
  };
  status: string;
  comment: string;
};