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


import { UpdateAttenuationMethodErrorAction, UpdateFrequencyErrorAction, UpdateLatitudeErrorAction, UpdateLongitudeErrorAction, UpdateRainMethodErrorAction } from '../actions/errorAction';
import { IActionHandler } from '../../../../../framework/src/flux/action';

export type errorState = {
  latitude1Error: string | null;
  latitude2Error: string | null;
  longitude1Error: string | null;
  longitude2Error: string | null;
  frequencyError : string | null;
  rainMethodError: string | null;
  attenuationMethodError : string | null;
};

const initialState: errorState = {
  latitude1Error:  '',
  latitude2Error:  '',
  longitude1Error:  '',
  longitude2Error:  '',
  frequencyError :  '',
  rainMethodError:  '',
  attenuationMethodError :  '',
};

export const ErrorHandler: IActionHandler<errorState> = (state = initialState, action) => {
  if (action instanceof UpdateLatitudeErrorAction) {
    state = Object.assign({}, state, { latitude1Error: action.error1, latitude2Error: action.error2 });
  } else if (action instanceof UpdateLongitudeErrorAction) {
    state = Object.assign({}, state, { longitude1Error: action.error1, longitude2Error: action.error2 });
  } else if (action instanceof UpdateFrequencyErrorAction) {
    state = Object.assign({}, state, { frequencyError: action.error });
  } else if (action instanceof UpdateRainMethodErrorAction) {
    state = Object.assign({}, state, { rainMethodError: action.error });
  } else if (action instanceof UpdateAttenuationMethodErrorAction) {
    state = Object.assign({}, state, { attenuationMethodError: action.error });
  }

  return state;
};
