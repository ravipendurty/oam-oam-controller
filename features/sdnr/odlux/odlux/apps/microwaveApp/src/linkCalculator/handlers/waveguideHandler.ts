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
import { UpdateCalculationResultAction } from '../actions/commonActions';
import { FirstMandatoryCheckAction } from '../actions/errorAction';
import { ResetAction, UpdateDeviceListsOnBandChangeAction, UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { ResetFormAction } from '../actions/viewAction';
import { UpdateNewWaveguideParametersAction, UpdateWaveguideIdAction, UpdatewaveguideListAction, 
  UpdateWaveguideLossAction, updateWaveguideNameAction, UpdateWaveguideParametersAction, updateWaveguideTypeAction, waveguideMandatoryAction } from '../actions/waveguideActions';
import { Waveguide } from '../model/waveguide';


export type waveguideState = {
  waveguideLossA: number;
  waveguideLossB: number;
  waveguideNameA: string | null;
  waveguideNameB: string | null;
  waveguideMandatoryParameters: boolean;
  waveguideLengthDisplayA: number;
  waveguideLengthDisplayB: number;
  waveguideTypeA: string;
  waveguideTypeB: string;
  waveguideIdSiteA: number;
  waveguideIdSiteB: number;
  waveguideParameters: Waveguide[];
  waveguideLengthACalculate: number ;
  waveguideLengthBCalculate: number ;
  waveguideNameList: string[];
};

const initialState: waveguideState = {
  waveguideLossA: 0,
  waveguideLossB: 0,
  waveguideNameA: '',
  waveguideNameB: '',
  waveguideMandatoryParameters: true,
  waveguideLengthDisplayA: 0,
  waveguideLengthDisplayB: 0,
  waveguideTypeA: '',
  waveguideTypeB: '',
  waveguideIdSiteA: 0,
  waveguideIdSiteB: 0,
  waveguideParameters: [],
  waveguideLengthACalculate: 0,
  waveguideLengthBCalculate: 0,
  waveguideNameList: [],

};

export const WaveguideHandler: IActionHandler<waveguideState> = (state = initialState, action) => {
  if (action instanceof UpdateWaveguideLossAction) {
    state = Object.assign({}, state, { waveguideLossA: action.waveguideLossA, waveguideLossB: action.waveguideLossB });
  } else if (action instanceof UpdatewaveguideListAction) {
    state = Object.assign({}, state, { waveguideList: action.waveguideListName });
  } else if (action instanceof updateWaveguideNameAction) {
    state = Object.assign({}, state, { waveguideNameA: action.waveguideNameA == null ? state.waveguideNameA : action.waveguideNameA, waveguideNameB: action.waveguideNameB == null ? state.waveguideNameB : action.waveguideNameB });
  } else if (action instanceof waveguideMandatoryAction) {
    state = Object.assign({}, state, { waveguideMandatoryParameters: action.waveguideMandatoryParameters });
  } else if (action instanceof UpdateWaveguideIdAction) {
    state = Object.assign({}, state, { waveguideIdSiteA: action.waveguideIdSiteA == null ? state.waveguideIdSiteA : action.waveguideIdSiteA, waveguideIdSiteB: action.waveguideIdSiteB == null ? state.waveguideIdSiteB : action.waveguideIdSiteB });
  } else if (action instanceof updateWaveguideTypeAction) {
    state = Object.assign({}, state, { waveguideTypeA: action.waveguideTypeA == null ? state.waveguideTypeA : action.waveguideTypeA, waveguideTypeB: action.waveguideTypeB == null ? state.waveguideTypeB : action.waveguideTypeB });
  } else if (action instanceof UpdateWaveguideParametersAction) {
    state = Object.assign({}, state, { waveguideParameters: action.waveguide });
  } else if (action instanceof ResetAction) {
    state = Object.assign({}, state, { waveguideIdSiteA: 0, waveguideIdSiteB: 0, waveguideNameA: '', waveguideNameB: '', waveguideLengthDisplayA: 0, waveguideLengthDisplayB: 0, waveguideLossA: 0, waveguideLossB: 0, waveguideTypeA: '', waveguideTypeB: '' });
  } else if (action instanceof UpdateDevicesOnFirstLoad) {

    state = { ...state, waveguideNameList: action.waveguideList.map(x => x.modelName), waveguideParameters: action.waveguideList };
    if (action.linkAttributes.siteA.waveguide?.operationalParameters) {
      state = { ...state, waveguideLengthACalculate : action.linkAttributes.siteA.waveguide?.operationalParameters.waveguideLength };
    
    }
    if (action.linkAttributes.siteB.waveguide?.operationalParameters) {
      state = { ...state, waveguideLengthBCalculate : action.linkAttributes.siteB.waveguide?.operationalParameters.waveguideLength };
    }
    action.waveguideList.forEach(element => {

      if (element.modelName === action.linkAttributes.siteA.waveguide?.modelName) {
        state = {
          ...state, waveguideTypeA: element.operationalParameters?.type!,
          waveguideNameA: element.modelName,
          waveguideIdSiteA: element.id,
          waveguideLengthDisplayA: element.operationalParameters?.length!,

        };
        if (element.operationalParameters?.type! === 'rigid') {
          state = { ...state, waveguideLengthDisplayA : action.linkAttributes.siteA.waveguide.operationalParameters?.waveguideLength === null ? element.operationalParameters?.length! : action.linkAttributes.siteA.waveguide.operationalParameters?.waveguideLength!,
          };
        } else {
          state = { ...state,  waveguideLengthACalculate: -1,
          }; 
        }
      }
      if (element.modelName === action.linkAttributes.siteB.waveguide?.modelName) {
        state = {
          ...state,
          waveguideTypeB: element.operationalParameters?.type!,
          waveguideLengthDisplayB: element.operationalParameters?.length!,
          waveguideNameB: element.modelName,
          waveguideIdSiteB: element.id,
        };
        if (element.operationalParameters?.type! === 'rigid') {
          state = { ...state, waveguideLengthDisplayB : action.linkAttributes.siteB.waveguide.operationalParameters?.waveguideLength === null ? element.operationalParameters?.length! : action.linkAttributes.siteB.waveguide.operationalParameters?.waveguideLength!,
          };
        } else {
          state = { ...state,  waveguideLengthBCalculate:-1,
          }; 
        }
      }
    });
  } else if (action instanceof UpdateDeviceListsOnBandChangeAction) {
    state = { ...state, waveguideNameList: action.waveguideList.map(e => e.modelName), waveguideParameters: action.waveguideList };
  } else if (action instanceof UpdateNewWaveguideParametersAction) {
    if (action.waveguideParametersA && action.waveguideParametersA.operationalParameters) {

      state = { ...state, waveguideNameA: action.waveguideParametersA?.modelName, waveguideIdSiteA: action.waveguideParametersA?.id,
        waveguideLengthDisplayA: action.waveguideParametersA?.operationalParameters.length, waveguideTypeA: action.waveguideParametersA.operationalParameters.type,
        waveguideLengthACalculate: action.waveguideParametersA.operationalParameters.type === 'rigid' ? action.waveguideParametersA.calculationParameters?.waveguideLength! : -1 };
    }
    if (action.waveguideParametersB && action.waveguideParametersB.operationalParameters) {
      state = { ...state, waveguideNameB: action.waveguideParametersB?.modelName, waveguideIdSiteB: action.waveguideParametersB?.id,
        waveguideLengthDisplayB: action.waveguideParametersB?.operationalParameters.length, waveguideTypeB: action.waveguideParametersB.operationalParameters.type,
        waveguideLengthBCalculate: action.waveguideParametersB.operationalParameters.type === 'rigid' ? action.waveguideParametersB.calculationParameters?.waveguideLength!  : -1 };
    }
  } else if (action instanceof UpdateCalculationResultAction) {
    if (action.result.waveguideLoss) {
      state = Object.assign({}, state, { waveguideLossA: action.result.waveguideLoss.waveguideLossA, waveguideLossB: action.result.waveguideLoss.waveguideLossB });
    }
  } else if (action instanceof FirstMandatoryCheckAction) {
    if (state.waveguideNameA !== '' && state.waveguideNameB !== '' && state.waveguideLengthDisplayA !== 0 && state.waveguideLengthDisplayB !== 0) {
      state = Object.assign({}, state, { waveguideMandatoryParameters: true });
    } else state = Object.assign({}, state, { waveguideMandatoryParameters: false });
  } else if (action instanceof ResetFormAction) {
    state = { ...initialState, waveguideMandatoryParameters:false };
  }
  return state;
};