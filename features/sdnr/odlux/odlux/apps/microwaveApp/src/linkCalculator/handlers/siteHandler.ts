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
import { FirstMandatoryCheckAction } from '../actions/errorAction';
import { UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { locationMandatoryAction, UpdateLatLonAction } from '../actions/siteAction';
import { ResetFormAction } from '../actions/viewAction';


export type siteState = {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
  siteIdA:number; 
  siteIdB:number; 
  locationMandatoryParameters: boolean;
  siteNameA: string; 
  siteNameB: string; 
  amslA: number; 
  amslB: number;
  azimuthA: number; 
  azimuthB: number;
  tiltDegA: number;
  tiltDegB: number;
};

const initialState: siteState = {
  lat1: 0,
  lon1: 0,
  lat2: 0,
  lon2: 0,
  siteIdA:0, 
  siteIdB:0,
  locationMandatoryParameters: true,
  siteNameA: '', 
  siteNameB: '', 
  amslA: 0, 
  amslB: 0,
  azimuthA: 0, 
  azimuthB: 0,
  tiltDegA: 0,
  tiltDegB: 0,
};

export const SiteHandler: IActionHandler<siteState> = (state = initialState, action) => {
  if (action instanceof UpdateLatLonAction) {
    state = Object.assign({}, state, { lat1: action.lat1, lon1: action.lon1, lat2: action.lat2, lon2: action.lon2 });
  }
  if (action instanceof ResetFormAction) {
    state = Object.assign({}, initialState, { locationMandatoryParameters:false });
  } else if (action instanceof locationMandatoryAction) {
    state = Object.assign({}, state, { locationMandatoryParameters: action.locationMandatoryParameters });
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
    state = Object.assign({}, state, {
      lat1: action.linkAttributes.siteA.lat, lon1: action.linkAttributes.siteA.lon,
      lat2: action.linkAttributes.siteB.lat, lon2: action.linkAttributes.siteB.lon,
      siteIdA: action.linkAttributes.siteA.id, siteIdB:action.linkAttributes.siteB.id,
      siteNameA:action.linkAttributes.siteA.name, siteNameB:action.linkAttributes.siteB.name, 
      amslA : action.linkAttributes.siteA.amslM, amslB: action.linkAttributes.siteB.amslM,
      azimuthA : action.linkAttributes.siteA.azimuthDeg, azimuthB: action.linkAttributes.siteB.azimuthDeg,
      tiltDegA: action.linkAttributes.siteA.tiltDeg, tiltDegB: action.linkAttributes.siteB.tiltDeg,
    });
  } else if (action instanceof FirstMandatoryCheckAction) {
    if (state.lat1 !== 0 && state.lon1 !== 0 && state.lat2 !== 0 && state.lon2 !== 0) {
      state = Object.assign({}, state, {  locationMandatoryParameters : true });
    } else state = Object.assign({}, state, { locationMandatoryParameters : false });
  }

  return state;
};