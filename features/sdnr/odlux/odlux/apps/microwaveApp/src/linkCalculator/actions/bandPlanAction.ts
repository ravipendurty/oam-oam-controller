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


import { Action } from '../../../../../framework/src/flux/action';
import { Dispatch } from '../../../../../framework/src/flux/store';
import { Channel, ChannelTable, FrequencyPlan, RegionRegulator } from '../model/bandPlan';
import { RadioBand } from '../model/topologyTypes';
import { SaveChannel } from '../model/updateLink';
import dataService  from '../service/dataService';
import { UpdateFrequencyPlanAction } from './linkAction';
import { UpdateBandList } from './queryActions';


export class UpdateRegionRegulatorAction extends Action {
  constructor(public region: RegionRegulator) {
    super();
  }
}
export class UpdateChannelListQueryAction extends Action {
  constructor(public channelList: Channel[]) {
    super();
  }
}
export class UpdateChannelListLoadingAction extends Action {
  constructor(public channelListLoading: boolean) {
    super();
  }
}
export class UpdateChannelListAction extends Action {
  constructor(public channels: ChannelTable[]) {
    super();
  }
}
export class ResetChannelTableAction extends Action {}

export class UpdateFrequencyPlans extends Action {
  constructor(public siteAFrequencyPlan: FrequencyPlan[], public siteBFrequencyPlan: FrequencyPlan[]) {
    super();
  }
}

export const updateSavedChannels = (channels: SaveChannel[], allChannel: Channel[]) => async (dispatcher: Dispatch) => {
  let channelTable: ChannelTable[] = [];
  

  channels.forEach(x => {
    allChannel.forEach(y => {
      if (y.keyId === x.channelKeyId) {
        channelTable.push({
          name: y.name,
          bandwidthMHz: y.bandwidthMHz.bandwidthMHz,
          centerFrequencyHigh: y.centerFrequencyHigh,
          centerFrequencyLow: y.centerFrequencyLow,
          availability: y.availability.name,
          xPolCondition: y.xPolCondition.name,
          keyId: y.keyId,
          polarization: x.channelPolarizationEnum,
        });
      }
    },
    );
  });
  dispatcher(new UpdateChannelListAction(channelTable));
};

export const UpdateChannelQuery = (bandplanKeyId: string, bandKeyId: string) => async (dispatcher: Dispatch) => {
  
  dataService.channelQuery(bandplanKeyId, bandKeyId).then(result => {
    dispatcher(new UpdateChannelListQueryAction(result?.data!));
    dispatcher(new UpdateChannelListLoadingAction(false));
  });
};



export const getAllBands = (bandplanKeyId: string) => async (dispatcher: Dispatch) => {
  await dataService.bandListQuery(bandplanKeyId).then(result => {
    if (result.data) {
      let bandList: RadioBand[] = [];
      result.data.forEach(x => bandList.push(x));
      dispatcher(new UpdateBandList(bandList));
    }
  });
};

export const getFrequencyplans = (siteIdA: number, siteIdB: number, bandKeyId: string) => async (dispatcher: Dispatch) => {
  let siteAFrequencyPlan: FrequencyPlan[] = [];
  let siteBFrequencyPlan: FrequencyPlan[] = [];

  await dataService.frequencyPlanQuery(siteIdA).then(result => {
    siteAFrequencyPlan = result.data;
  });
  await dataService.frequencyPlanQuery(siteIdB).then(result => {
    siteBFrequencyPlan = result.data;

  });
  dispatcher(new UpdateFrequencyPlans(siteAFrequencyPlan, siteBFrequencyPlan));
  let frequencyPlanA: string = '';
  let frequencyPlanB: string = '';
  siteAFrequencyPlan.forEach(x => {
    if (x.band.keyId === bandKeyId) {
      frequencyPlanA = x.configuration;
    }
  });
  siteBFrequencyPlan.forEach(x => {
    if (x.band.keyId === bandKeyId) {
      frequencyPlanB = x.configuration;
    }
  });
  dispatcher(new UpdateFrequencyPlanAction(frequencyPlanA as 'HIGH' | 'LOW', frequencyPlanB as 'HIGH' | 'LOW'));
};

