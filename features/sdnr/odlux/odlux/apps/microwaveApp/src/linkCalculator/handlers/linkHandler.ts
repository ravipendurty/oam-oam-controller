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
import { UpdateDistanceAction, UpdatePolAction } from '../actions/linkAction';
import { UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { ResetFormAction } from '../actions/viewAction';


export type linkState = {
  
  polarization: 'HORIZONTAL' | 'VERTICAL' | null;
  distance: number;
  linkId: number; 
};

const initialState: linkState = {
    
  distance: 0,
  polarization: null,
  linkId:0,
};

export const LinkHandler: IActionHandler<linkState> = (state = initialState, action) => {

   
  if (action instanceof UpdateDistanceAction) {
    state = Object.assign({}, state, { distance: action.distance });
  } else if (action instanceof UpdatePolAction) {
    state = Object.assign({}, state, { polarization: action.polarization });
  }  else if (action instanceof ResetFormAction) {
    state = Object.assign({}, initialState, {});
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
    state = Object.assign({}, state, { 
      distance: action.linkAttributes.lengthKm, 
      polarization : action.linkAttributes.operationalParameters.rainPolarity, 
      linkId: action.linkAttributes.id,
    });
  }

  return state;
};