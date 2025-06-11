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

import {  UpdateModelTypesAction } from '../actions/queryActions';
import { UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { linkBeingSavedAction, linkSavedSuccessfulAction } from '../actions/saveLinkAction';

import { Link } from '../model/link';
import { ModelType } from '../model/topologyTypes';

export type queryState = {
  
  modelTypeList: string[];
  linkAttributes: Link;
  linkSave: any;
  modelTypes:ModelType[];
  savingComplete: boolean;
  linkSaving: boolean;
};

const initialState: queryState = {
  
  modelTypeList: [],
  linkAttributes: {
    id: 0, name: '', type: '', operator: '',
    lengthKm: 0,
    siteA: {
      lat: 0, lon: 0, id: 0, name: '', amslM: 0, azimuthDeg: 0, tiltDeg: 0,
      radioAntenna: { modelId: 0, id: 0, modelName: '', operationalParameters: { agl: 0 }, gainDb: 0, tiltDeg: 0 },
      radio: { id: 0, modelId: 0, modelName: '', operationalParameters: { transmissionPower: null, modulationType: '', enabledAdmModulations: [] } },
      waveguide: { modelId: 0, id: 0, modelName: '', type: '', lengthM: 0, lossDbPerM: 0, operationalParameters: { waveguideLength: 0 } },
      
    },
    siteB: {
      lat: 0, lon: 0, id: 0, name: '', amslM: 0, azimuthDeg: 0, tiltDeg: 0,
      radioAntenna: { id: 0, modelId: 0, modelName: '', operationalParameters: { agl: 0 }, gainDb: 0, tiltDeg: 0 },
      radio: { id: 0, modelId: 0, modelName: '', operationalParameters: { transmissionPower: null, modulationType: '', enabledAdmModulations: [] } },
      waveguide: { modelId: 0, id: 0, modelName: '', type: '', lengthM: 0, lossDbPerM: 0, operationalParameters: { waveguideLength: 0 } },
      
    },
    operationalParameters: { bandKeyId: '0', rainPolarity: '', rainModel: '', absorptionMethod: '', calculationPeriod: '', rainRate: 0, inheritedFrequencyPlanA:'', inheritedFrequencyPlanB:'', bandplanKeyId:'0', selectedChannelList:[] },

  },
  linkSave: [],
  
  modelTypes: [{
    name: '', id: -1, description: '',
  }],
  savingComplete: false,
  linkSaving: false,
};

export const QueryHandler: IActionHandler<queryState> = (state = initialState, action) => {

  if (action instanceof UpdateDevicesOnFirstLoad) {
    state = Object.assign({}, state, { linkAttributes: action.linkAttributes });
  } else if (action instanceof linkSavedSuccessfulAction) {
    state = Object.assign({}, state, { linkSave: action.saved, savingComplete: true, linkSaving: false });
  } else if (action instanceof UpdateModelTypesAction) {
    state = Object.assign({}, state, { modelTypes: action.ModelTypes });
  } else if (action instanceof linkBeingSavedAction) {
    state = Object.assign({}, state, { linkSaving: action.saving, savingComplete: false });
  }
  
  return state;
};
