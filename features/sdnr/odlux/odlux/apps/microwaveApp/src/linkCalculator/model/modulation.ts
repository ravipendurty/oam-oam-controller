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

export type Modulation = {
  capE1: string;
  dfm56QAM: string;
  fktb: string;
  minDelay: string;
  minSigBw: string;
  minSigHt: string;
  modDsOffset: string;
  netFilterDf: string;
  nonMinDelay: string;
  nonMinSigBw: string;
  nonMinSigHt: string;
  rslDist: string;
  rslMin: string;
  rxMin: string;
  rxThr3BER: number;
  rxThr6BER: number;
  throughput: string;
  txMax: string;
  txMin: string;
  xpif: string;
};