/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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


// Put Button handler stuff, REST Calls
import { requestRest, requestRestExt } from '../../../../../framework/src/services/restService';

import { Link } from '../model/link';
import { AdaptiveModulationInput } from '../model/adaptiveModulationInput';
import { AdaptiveModulationResponse } from '../model/adaptiveModulationTable';
import { Absorption, Distance, FreeSpaceLoss, LinkBudget, ModelType, RadioBand, RainLoss } from '../model/topologyTypes';
import { WaveguideLoss } from '../model/waveguide';
import { Channel } from '../model/bandPlan';

const LINKCALCULATOR_BASE_URL = '/topology/linkcalculator';
const MICROWAVE_URL = '/topology/microwave';
const NETWORK_URL = MICROWAVE_URL + '/network';

const dataService = {
  bandPlanRegulators : () => {
    return requestRest<any>((MICROWAVE_URL + '/bandplans/'));
  },

  getModels : (bandKeyId: string, modelTypeName: string) => {
    const result = requestRest<any>(LINKCALCULATOR_BASE_URL + '/query/modellist/' + modelTypeName + '/' + bandKeyId);
    return result;
  },

  rainAttenuation : (lat1: any, lon1: any, lat2: any, lon2: any, bandKeyId: string, polarization: string, worstmonth: boolean) => {
    if (!worstmonth) {
      const result = requestRest<RainLoss>(LINKCALCULATOR_BASE_URL + '/rain/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2 + '/' + bandKeyId + '/' + polarization.toUpperCase() + '/' + 'ANNUAL');
      return result;
    } else {
      const result = requestRest<RainLoss>(LINKCALCULATOR_BASE_URL + '/rain/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2 + '/' + bandKeyId + '/' + polarization.toUpperCase() + '/' + 'WORSTMONTH');
      return result;
    }
  },

  manualRain : (rainfall: number, bandKeyId: string, distance: number, polarization: string) => {
    const result = requestRest<RainLoss>(LINKCALCULATOR_BASE_URL + '/rain/' + '/manual/' + rainfall + '/' + bandKeyId + '/' + distance + '/' + polarization.toUpperCase());
    return result;
  },


  FSL : (distance: number, bandKeyId: string) => {
    const result = requestRest<FreeSpaceLoss>(LINKCALCULATOR_BASE_URL + '/fsl/' + distance + '/' + bandKeyId);
    return result;
  },

  AbsorptionAtt : (lat1: number, lon1: number, lat2: number, lon2: number, bandKeyId: string, worstmonth: boolean, absorptionMethod: string) => {
    if (!worstmonth) {

      const result = requestRest<Absorption>(LINKCALCULATOR_BASE_URL + '/absorption/annual/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2 + '/' + bandKeyId + '/' + absorptionMethod);
      return result;
    } else {
      const result = requestRest<Absorption>(LINKCALCULATOR_BASE_URL + '/absorption/annual/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2 + '/' + bandKeyId + '/' + absorptionMethod);
      return result;
    }
  },

  linkBudget : (lat1: number, lon1: number, lat2: number, lon2: number, bandKeyId: string, absorptionMethod: string,
    polarization: string, antennaGainA: number, antennaGainB: number, waveguideLossA: number, waveguideLossB: number, transmissionPowerA: number,
    transmissionPowerB: number, rxSensitivityA: number, rxSensitivityB: number) => {

    const url = LINKCALCULATOR_BASE_URL + '/linkbudget/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2 + '/' +
      absorptionMethod + '/' + polarization.toUpperCase() + '/' + antennaGainA + '/' + antennaGainB + '/' +
      waveguideLossA + '/' + waveguideLossB + '/' + transmissionPowerA + '/' + transmissionPowerB + '/' + rxSensitivityA + '/' + rxSensitivityB;


    const result = requestRest<LinkBudget>(url + '?bandKeyId=' + bandKeyId);
    return result;
  },

  updateAutoDistance : (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const result = requestRest<Distance>(LINKCALCULATOR_BASE_URL + '/distance/' + lat1 + ',' + lon1 + ',' + lat2 + ',' + lon2);
    return result;
  },

  waveguideLoss : (waveguideIdSiteA: number, waveguideIdSiteB: number, waveguideLengthA: number, waveguideLengthB: number) => {

    const result = requestRest<WaveguideLoss>(LINKCALCULATOR_BASE_URL + '/waveguide/' + waveguideIdSiteA + '/' + waveguideIdSiteB + '/' + waveguideLengthA + '/' + waveguideLengthB);
    return result;
  },

  adaptiveModulationTable : async (adaptiveModulationInput: AdaptiveModulationInput) => {
    const result = requestRestExt<AdaptiveModulationResponse>(LINKCALCULATOR_BASE_URL + '/link/' + adaptiveModulationInput.linkId + '/calculate/', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adaptiveModulationInput),
    });
    return result;
  },

  bandListQuery : async (bandplanKeyId: string) => {
    const result = requestRestExt<RadioBand[]>(MICROWAVE_URL + '/bandplans/' + bandplanKeyId + '/bands');
    return result;
  },

  modelTypeListQuery : async () => {
    const result = requestRest<ModelType[]>(LINKCALCULATOR_BASE_URL + '/query/modeltypelist/');
    return result;
  },

  channelQuery : async (bandplanKeyId: string, bandKeyId: string) => {
 
    const response = await requestRestExt<Channel[]>(MICROWAVE_URL + '/bandplans/' + bandplanKeyId + '/bands/' + bandKeyId + '/channels');
    return response;
  },

  saveLink : async (link: Link, id: number) => {
    type Message = { 'message': string; saveFail: boolean };
    const response = await requestRestExt<Message>(LINKCALCULATOR_BASE_URL + '/link/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(link),
    });

    if (response.status === 200) {
      return response;
    } else {
      let message: Message = { message: '', saveFail: true };
      if (response.data?.message) {
        message.message = 'Save failed ' + response.data.message;
        return message;
      } else {
        message.message = 'Something went wrong ' + response.message;
        return message;
      }

    }
  },

  frequencyPlanQuery : (siteId: number) => {
    const result = requestRestExt<any>(NETWORK_URL + '/sites/' + siteId + '/frequencyplan');
    return result;
  },

};
export default dataService;
