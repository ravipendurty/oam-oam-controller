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

import { IActionHandler } from '../../../../../framework/src/flux/action';
import { attenuationMandatoryParametersAction, UpdateAttenuationMethodAction, UpdateRainMethodAction, UpdateRainValAction, UpdateWorstMonthAction } from '../actions/atmosphericLossAction';
import { UpdateCalculationResultAction } from '../actions/commonActions';
import { FirstMandatoryCheckAction } from '../actions/errorAction';
import { UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { ResetFormAction } from '../actions/viewAction';


export type atmosphericLossState = {
  rainVal: number;
  rainAtt: number;
  absorptionWater: number;
  absorptionOxygen: number;
  month: string;
  fsl: number;
  rainMethod: string;
  attenuationMethod: string;
  worstMonth: boolean;
  attenuationMandatoryParameters: boolean;
};

const initialState: atmosphericLossState = {
  fsl: 0,
  rainVal: 0,
  rainAtt: 0,
  absorptionWater: 0,
  absorptionOxygen: 0,
  month: '',
  rainMethod: '',
  attenuationMethod: '',
  worstMonth: false,
  attenuationMandatoryParameters: true,

};
export const AtmosphericLossHandler: IActionHandler<atmosphericLossState> = (state = initialState, action) => {
  
  if (action instanceof UpdateRainValAction) {
    state = Object.assign({}, state, { rainVal: action.rainVal });
  } else if (action instanceof ResetFormAction) {
    state = Object.assign({}, initialState, { attenuationMandatoryParameters:false });
  } else if (action instanceof UpdateRainMethodAction) {
    state = Object.assign({}, state, { rainMethod: action.rainMethod, rainVal: 0, rainAtt: 0 });
  } else if (action instanceof UpdateAttenuationMethodAction) {
    state = Object.assign({}, state, { attenuationMethod: action.attenuationMethod, absorptionWater: 0, absorptionOxygen: 0 });
  } else if (action instanceof UpdateWorstMonthAction) {
    state = Object.assign({}, state, { worstMonth: action.worstMonth });
  } else if (action instanceof attenuationMandatoryParametersAction) {
    state = Object.assign({}, state, { attenuationMandatoryParameters: action.attenuationMandatoryParameters });
  } else if (action instanceof UpdateCalculationResultAction) {
    if (action.result.rainLoss) {
      state = Object.assign({}, state, { rainVal: action.result.rainLoss.rainFall.rainrate.toFixed(2), rainAtt: action.result.rainLoss.rainAttenuation, month: action.result.rainLoss.rainFall.period });
    }
    if (action.result.absorptionLoss) {
      state = Object.assign({}, state, { absorptionOxygen: action.result.absorptionLoss.oxygenLoss, absorptionWater: action.result.absorptionLoss.oxygenLoss });
    }
    if (action.result.freeSpaceLoss) {
      state = Object.assign({}, state, { fsl: action.result.freeSpaceLoss.fspl });
    }
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
    state = Object.assign({}, state, {
      rainMethod: action.linkAttributes.operationalParameters.rainModel == null ? state.rainMethod : action.linkAttributes.operationalParameters.rainModel,
      attenuationMethod: action.linkAttributes.operationalParameters.absorptionMethod == null ? state.attenuationMethod : action.linkAttributes.operationalParameters.absorptionMethod,
      worstMonth: action.linkAttributes.operationalParameters.calculationPeriod === 'ANNUAL' ? false : true,
    });

  } else if (action instanceof FirstMandatoryCheckAction) {
    if (state.attenuationMethod !== '' && state.rainMethod !== '' ) {
      state = Object.assign({}, state, { attenuationMandatoryParameters  : true });
    } else state = Object.assign({}, state, { attenuationMandatoryParameters : false });
  }
  return state;

};
