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


import { Dispatch } from '../../../../../framework/src/flux/store';
import { Action } from '../../../../../framework/src/flux/action';

import { IApplicationStoreState } from '../../../../../framework/src/store/applicationStore';

import  dataService  from '../service/dataService';
import { SaveChannel, UpdateLink } from '../model/updateLink';



export class linkSavedSuccessfulAction extends Action {
  constructor(public saved: any) {
    super();
  }
}
export class linkBeingSavedAction extends Action {
  constructor(public saving: boolean) {
    super();
  }
}
export const saveLinkCallAsync = () => async (dispatch: Dispatch, getState: () => IApplicationStoreState) => {
  dispatch(new linkBeingSavedAction(true));
  const {
    microwave: {
      link: { polarization },
      radio: { band, txPowerA, txPowerB, radioIdSiteA, radioIdSiteB, modulationA, modulationB, enabledAdaptiveModulations },
      atmosphere: { attenuationMethod, worstMonth, rainMethod, rainVal },
      antenna: { antennaIdSiteA, antennaIdSiteB, antennaHeightA, antennaHeightB },
      waveguide: { waveguideIdSiteA, waveguideIdSiteB, waveguideLengthACalculate, waveguideLengthBCalculate },
      query: { linkAttributes },
      bandPlan:{ region, savedChannels },
    },
  } = getState();

  let saveChannels: SaveChannel[] = [];
  savedChannels.map(x => {
    saveChannels.push({ channelKeyId: x.keyId, channelPolarizationEnum: x.polarization });
  });

  let link: UpdateLink = {
   
    siteA: { modulationType	:modulationA,
      transmissionPower:txPowerA,
      waveguideLength:waveguideLengthACalculate,
      agl:antennaHeightA,
      radioModelId: radioIdSiteA,
      waveguideModelId:waveguideIdSiteA,
      radioAntennaModelId:antennaIdSiteA,
      enabledAdmModulations: enabledAdaptiveModulations,
    },
    siteB: { modulationType	:modulationB,
      transmissionPower:txPowerB,
      waveguideLength:waveguideLengthBCalculate,
      agl:antennaHeightB,
      radioModelId: radioIdSiteB,
      waveguideModelId:waveguideIdSiteB,
      radioAntennaModelId:antennaIdSiteB,
      enabledAdmModulations: enabledAdaptiveModulations,
    },
    linkOperationalParameters: { 
      bandKeyId: band.keyId,
      rainPolarity: polarization!, 
      rainModel: rainMethod, 
      rainRate: rainVal, 
      absorptionMethod: attenuationMethod, 
      calculationPeriod: worstMonth ? 'WORSTMONTH' : 'ANNUAL', 
      bandplanKeyId: region.keyId,
      selectedChannelList: saveChannels,
    },
  

  };

  const callLinkPromise = (await dataService.saveLink(link as any, linkAttributes.id));
  dispatch(new linkSavedSuccessfulAction(callLinkPromise));
};