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
import { UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { isCalculationServerReachableAction, PluginDoneLoadingAction, ResetFormAction, UpdateRainMethodDisplayAction } from '../actions/viewAction';


export type viewState = {
  formView: boolean;
  reachable: boolean;
  rainDisplay: boolean;
  loadingComplete : boolean;
  processing: boolean; 
};

const initialState: viewState = {
  formView: true,
  reachable: true,
  rainDisplay: false,
  loadingComplete : false, 
  processing : true,
};

export const ViewHandler: IActionHandler<viewState> = (state = initialState, action) => {

  if (action instanceof UpdateDevicesOnFirstLoad) {
    if (action.linkAttributes) {
      state = Object.assign({}, state, { formView: true });
    }
  } else if (action instanceof isCalculationServerReachableAction) {
    state = Object.assign({}, state, { reachable: action.reachable });
  } else if (action instanceof ResetFormAction) {
    state = Object.assign({}, state, { formView: false, processing : false  });
  } else if (action instanceof UpdateRainMethodDisplayAction) {
    state = Object.assign({}, state, { rainDisplay: action.rainDisplay });
  } else if (action instanceof PluginDoneLoadingAction) {
    state = Object.assign({}, state, { loadingComplete: action.loadingComplete, processing: false });
  }
  return state;
};