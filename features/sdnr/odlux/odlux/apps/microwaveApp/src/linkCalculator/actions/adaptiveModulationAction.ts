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

import { AdaptiveModulationInput } from '../model/adaptiveModulationInput';
import { Dispatch } from '../../../../../framework/src/flux/store';
import { IApplicationStoreState } from '../../../../../framework/src/store/applicationStore';
import dataService  from '../service/dataService';
import { Action } from '../../../../../framework/src/flux/action';
import { AdaptiveModulationTable } from '../model/adaptiveModulationTable';


export class UpdateAdaptiveModulationTableAction extends Action {
  constructor(public adaptiveModulationTableAtoB: AdaptiveModulationTable[] | null, public adaptiveModulationTableBtoA: AdaptiveModulationTable[] | null, public message: string, public status: number) {
    super();
  }
}
export class UpdateAdaptiveModulationProcessing extends Action {
  constructor(public processing: boolean) {
    super();
  }
}

export const adaptiveModulationInputCreator =  () =>  async (dispatch: Dispatch, getState: () => IApplicationStoreState) => {

  const {
    microwave: {
      link: { polarization, linkId },
      radio: { band, txPowerA, txPowerB, radioIdSiteA, radioIdSiteB, modulationA, modulationB },
      atmosphere: { attenuationMethod, worstMonth, rainVal, rainMethod },
      antenna: { antennaIdSiteA, antennaIdSiteB, antennaHeightA, antennaHeightB },
      waveguide: { waveguideIdSiteA, waveguideIdSiteB, waveguideLengthACalculate, waveguideLengthBCalculate },
      bandPlan: { region },
    },
  } = getState();

  let adaptiveModulationInput: AdaptiveModulationInput = {
    linkId: 0,
    linkOperationalParameters: {
      bandKeyId: '0',
      bandplanKeyId:'',
      polarization: '',
      absorptionMethod: '',
      calculationPeriod: '',
      rainRate: 0,
      rainModel: '',
    },
    siteA: {
      radioModelId: 0,
      waveguideModelId: 0,
      radioAntennaModelId: 0, 
      modulationType: '',
      transmissionPower: 0,
      waveguideLength: 0,
      agl: 0,
    },
    siteB: {
      radioModelId: 0,
      waveguideModelId: 0,
      radioAntennaModelId: 0,
      modulationType: '',
      transmissionPower: 0,
      waveguideLength: 0,
      agl: 0,
    },
  };

  // setting link attributes
  adaptiveModulationInput = {
    ...adaptiveModulationInput,
    linkId: linkId,
    linkOperationalParameters: {
      bandKeyId: band.keyId,
      bandplanKeyId: region.keyId,
      polarization: polarization!,
      absorptionMethod: attenuationMethod,
      calculationPeriod: worstMonth === true ? 'WORSTMONTH' : 'ANNUAL',
      rainRate: rainVal,
      rainModel: rainMethod,
    },
  };
  // setting site A attributes
  adaptiveModulationInput = { 
    ...adaptiveModulationInput,
    siteA: { 
      radioModelId: radioIdSiteA,
      waveguideModelId: waveguideIdSiteA, 
      radioAntennaModelId: antennaIdSiteA, 
      modulationType: modulationA, 
      transmissionPower: txPowerA, 
      waveguideLength: waveguideLengthACalculate, 
      agl: antennaHeightA,
    },
  };
  // setting SiteB attributes
  adaptiveModulationInput = {
    ...adaptiveModulationInput,
    siteB: { 
      radioModelId: radioIdSiteB,
      waveguideModelId: waveguideIdSiteB,
      radioAntennaModelId: antennaIdSiteB,
      modulationType: modulationB, 
      transmissionPower: txPowerB, 
      waveguideLength: waveguideLengthBCalculate, 
      agl: antennaHeightB, 
    },
  };

  const adaptivemodulationPromise =  dataService.adaptiveModulationTable(adaptiveModulationInput);

  adaptivemodulationPromise.then((response ) =>  {
    dispatch(new UpdateAdaptiveModulationTableAction(response.data?.aToB!, response.data?.bToA!, response.message!, response.status));
  });
};