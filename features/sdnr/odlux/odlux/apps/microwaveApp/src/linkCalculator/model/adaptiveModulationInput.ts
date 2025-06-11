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

export type AdaptiveModulationInput = {
  linkId: number;
  linkOperationalParameters: {
    bandKeyId: string;
    bandplanKeyId: string;
    polarization: string;
    absorptionMethod: string;
    calculationPeriod: string;
    rainRate: number;
    rainModel: string;
  };
  siteA: {
    radioModelId: number;
    waveguideModelId: number;
    radioAntennaModelId: number;
    modulationType: string;
    transmissionPower: number;
    waveguideLength: number | null;
    agl: number;
  };
  siteB: {
    radioModelId: number;
    waveguideModelId: number;
    radioAntennaModelId: number;
    modulationType: string;
    transmissionPower: number;
    waveguideLength: number | null;
    agl: number;
  };
};

