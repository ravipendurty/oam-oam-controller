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
import { UpdateChannelListAction, UpdateChannelListLoadingAction, UpdateChannelListQueryAction, UpdateFrequencyPlans, UpdateRegionRegulatorAction, ResetChannelTableAction } from '../actions/bandPlanAction';
import { UpdateFrequencyPlanAction } from '../actions/linkAction';
import { UpdateBandList, UpdateRegionRegulatorListAction } from '../actions/queryActions';
import { ResetAction, UpdateDevicesOnFirstLoad } from '../actions/radioActions';
import { Channel, ChannelTable, FrequencyPlan, RegionRegulator } from '../model/bandPlan';
import { RadioBand } from '../model/topologyTypes';



export type bandPlanState = {
  region: RegionRegulator;
  channelListQuery: Channel[];
  bandList: RadioBand[];
  channelListLoading: boolean;
  regionRegulatorList: RegionRegulator[];
  allChannels: ChannelTable[];
  siteAFrequencyPlan: FrequencyPlan[];
  siteBFrequencyPlan: FrequencyPlan[];
  frequencyPlanA: 'HIGH' | 'LOW';
  frequencyPlanB: 'HIGH' | 'LOW';
  frequencyPlanProcessing: boolean;
  savedChannels: ChannelTable[] ;
};

const initialState: bandPlanState = {
  region: {
    name: '', keyId: '-1', country: '', regulatorName: '',
  },
  channelListQuery: [],
  bandList: [],
  channelListLoading: true,
  allChannels: [],
  regionRegulatorList: [],
  siteAFrequencyPlan: [],
  siteBFrequencyPlan: [],
  frequencyPlanA: 'HIGH',
  frequencyPlanB: 'LOW',
  frequencyPlanProcessing: true,
  savedChannels: [],
};

export const bandPlanHandler: IActionHandler<bandPlanState> = (state = initialState, action) => {
  if (action instanceof UpdateBandList) {
    state = Object.assign({}, state, { bandList: action.bandList });
  } else if (action instanceof UpdateRegionRegulatorListAction) {
    state = Object.assign({}, state, { regionRegulatorList: action.regionRegulatorList });
  } else if (action instanceof UpdateRegionRegulatorAction) {
    state = { ...state, region: action.region };
  }
  if (action instanceof UpdateChannelListQueryAction) {
    let table: ChannelTable[] = [];
   
    action.channelList.forEach(x => {
      table.push({
        name: x.name,
        bandwidthMHz: x.bandwidthMHz.bandwidthMHz,
        centerFrequencyHigh: x.centerFrequencyHigh,
        centerFrequencyLow: x.centerFrequencyLow,
        availability: x.availability.name,
        xPolCondition: x.xPolCondition.name,
        keyId: x.keyId,
        polarization: '',
      });
    });

    state = {
      ...state,
      channelListQuery: action.channelList!,
      allChannels: table,
    };

  } else if (action instanceof UpdateChannelListLoadingAction) {
    state = { ...state, channelListLoading: action.channelListLoading };
  } else if (action instanceof UpdateFrequencyPlanAction) {
    state = Object.assign({}, state, { frequencyPlanA: action.frequencyPlanA, frequencyPlanB: action.frequencyPlanB, frequencyPlanProcessing: false });
  } else if (action instanceof UpdateChannelListAction) {
    
    state = { ...state, savedChannels: action.channels };
  } else if (action instanceof ResetAction) {
    state = { ...state, savedChannels: [] };
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
    state.regionRegulatorList.map(x => {
      if (x.keyId === action.linkAttributes.operationalParameters.bandplanKeyId) {
        state = { ...state, region: x };
      }
    });
  } else if (action instanceof UpdateFrequencyPlans) {
    state = { ...state, siteAFrequencyPlan: action.siteAFrequencyPlan, siteBFrequencyPlan: action.siteBFrequencyPlan };
  } else if (action instanceof ResetChannelTableAction) {
    state = { ...state, channelListQuery : [], allChannels : []  };
  }

  return state;
};