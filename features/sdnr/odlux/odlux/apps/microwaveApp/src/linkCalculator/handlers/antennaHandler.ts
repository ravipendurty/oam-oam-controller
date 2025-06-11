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
import { antennaMandatoryAction, UpdateAntennaAction, UpdateAntennaDBAction } from '../actions/antennaActions';
import { UpdateCalculationResultAction } from '../actions/commonActions';
import { FirstMandatoryCheckAction } from '../actions/errorAction';
import { ResetAction, UpdateDeviceListsOnBandChangeAction, UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { ResetFormAction } from '../actions/viewAction';
import { Antenna } from '../model/antenna';

export type antennaState = {
  antenna: Antenna[];
  antennaIdSiteA: number;
  antennaIdSiteB: number;
  eirpA: number;
  eirpB: number;
  antennaGainA: number;
  antennaGainB: number;
  antennaNameA: string;
  antennaNameB: string;
  antennaNameList: string[];
  antennaMandatoryParameters: boolean;
  antennaHeightA: number;
  antennaHeightB: number;

};

const initialState: antennaState = {
  antennaIdSiteA: 0,
  antennaIdSiteB: 0,
  antenna: [],
  eirpA: 0,
  eirpB: 0,
  antennaGainA: 0,
  antennaGainB: 0,
  antennaNameA: '',
  antennaNameB: '',
  antennaNameList: [],
  antennaMandatoryParameters: true,
  antennaHeightA: 0,
  antennaHeightB: 0,

};

export const AntennaHandler: IActionHandler<antennaState> = (state = initialState, action) => {
  if (action instanceof UpdateAntennaAction) {
    if (action.antennaA && action.antennaA.operationalParameters) {
      state = { ...state, antennaNameA: action.antennaA.modelName, antennaGainA: action.antennaA.operationalParameters.gain, antennaIdSiteA: action.antennaA.id };
    }
    if (action.antennaB && action.antennaB.operationalParameters) {
      state = { ...state, antennaNameB: action.antennaB.modelName, antennaGainB: action.antennaB.operationalParameters.gain, antennaIdSiteB: action.antennaB.id };
    }
  } else if (action instanceof ResetFormAction) {
    state = Object.assign({}, initialState, { antennaMandatoryParameters: false });
  } else if (action instanceof UpdateAntennaDBAction) {
    state = Object.assign({}, state, { antenna: action.antenna, antennaNameList: action.antenna.map(x => { return x.modelName; }) });
  } else if (action instanceof FirstMandatoryCheckAction) {
    if (state.antennaNameA !== '' && state.antennaNameB !== '' && state.antennaGainA !== 0 && state.antennaGainB !== 0) {
      state = Object.assign({}, state, { ...state, antennaMandatoryParameters: true });
    } else state = Object.assign({}, state, { antennaMandatoryParameters: false });
  } else if (action instanceof antennaMandatoryAction) {
    state = Object.assign({}, state, { antennaMandatoryParameters: action.antennaMandatoryParameters });
  } else if (action instanceof ResetAction) {
    state = { ...state, antennaNameA: '', antennaNameB: '', antennaIdSiteA: 0, antennaIdSiteB: 0, antennaGainA: 0, antennaGainB: 0 };
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
      
    state = { ...state, antennaNameList: action.antennas.map(e => e.modelName), antenna: action.antennas, 
      antennaHeightA: action.linkAttributes.siteA.radioAntenna?.operationalParameters?.agl!, 
      antennaHeightB: action.linkAttributes.siteB.radioAntenna?.operationalParameters?.agl! };
    action.antennas.map(antenna => {

      if (antenna.modelName === action.linkAttributes.siteA.radioAntenna?.modelName) {
        state = { ...state, antennaNameA: antenna.modelName, antennaGainA: antenna.operationalParameters?.gain!, antennaIdSiteA: antenna.id };
      }
      if (antenna.modelName === action.linkAttributes.siteB.radioAntenna?.modelName) {
        state = { ...state, antennaNameB: antenna.modelName, antennaGainB: antenna.operationalParameters?.gain!, antennaIdSiteB: antenna.id };
      }
    });
  } else if (action instanceof UpdateDeviceListsOnBandChangeAction) {
    state = { ...state, antennaNameList: action.antennas.map(e => e.modelName), antenna: action.antennas };
  } else if (action instanceof UpdateCalculationResultAction) {
    if (action.result.linkBudget) {
      state = Object.assign({}, state, { ...state, eirpA: action.result.linkBudget.eirpA, eirpB: action.result.linkBudget.eirpB });
    }
  }

  return state;
};