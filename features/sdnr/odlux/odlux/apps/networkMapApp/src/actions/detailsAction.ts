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

import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { requestRest } from '../../../../framework/src/services/restService';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { Link, Site, Device, Service } from '../model/topologyTypes';
import { HistoryEntry } from '../model/historyEntry';
import { NetworkElementConnection } from '../model/networkElementConnection';
import { dataService } from '../services/dataService';
import { highlightElementAction } from './mapActions';
import { handleConnectionError } from './connectivityAction';

import { SITEDOC_URL } from '../config';

export class SelectElementAction extends Action {
  constructor(public data: Link | Site | Service) {
    super();
  }
}

export class ClearDetailsAction extends Action {
}

export class AddToHistoryAction extends Action {
  constructor(public entry: HistoryEntry) {
    super();
  }
}

export class ClearHistoryAction extends Action {
}

export class IsBusyCheckingDeviceListAction extends Action {
  constructor(public isBusy: boolean) {
    super();
  }
}

export class FinishedLoadingDeviceListAction extends Action {
  constructor(public devices: Device[]) {
    super();
  }
}

export class ClearLoadedDevicesAction extends Action {
}

export class InitializeLoadedDevicesAction extends Action {
  constructor(public devices: Device[]) {
    super();
  }
}

export class IsSitedocReachableAction extends Action {
  constructor(public isReachable: boolean) {
    super();
  }
}

export const UpdateDetailsView = (nodeId: string) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const { network: { details: { checkedDevices } } } = getState();
  if (checkedDevices !== null) {
    const index = checkedDevices.findIndex(item => item.name === nodeId);
    if (index !== -1)
      requestRest<any>('/rests/operational/network-topology:network-topology/topology/topology-netconf/node/' + nodeId, { method: 'GET' })
        .then(result => {
          if (result !== null) {
            checkedDevices[index].status = result.node[0]['netconf-node-topology:connection-status'];
          } else {
            checkedDevices[index].status = 'Not connected';
          }
          dispatcher(new FinishedLoadingDeviceListAction(checkedDevices));
        });
  }
};

export const CheckDeviceList = (list: Device[]) => async (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {

  const { network: { details: { isBusyCheckingDeviceList } } } = getState();

  if (isBusyCheckingDeviceList) return;
  dispatcher(new IsBusyCheckingDeviceListAction(true));

  const ids: string[] = list
    .filter(el => el.name && el.name.length > 0)
    .map((device) => {
      return device.name;
    });

  const resultData = await dataService.getAdditionalInfoOnDevices(ids);

  if (resultData) {
    resultData.forEach((data: NetworkElementConnection) => {

      const index = list.findIndex(el => { return el.name === data.id; });
      if (index !== -1) {
        list[index].status = data.status;
        list[index].type = data['device-type'];
      }
    });
  }

  dispatcher(new FinishedLoadingDeviceListAction(list));
  dispatcher(new IsBusyCheckingDeviceListAction(false));
};

export const CheckSitedocReachability = () => async (dispatcher: Dispatch) => {
  requestRest<any>(SITEDOC_URL + '/app/versioninfo').then(response => {
    console.log(response);
    if (response) {
      dispatcher(new IsSitedocReachableAction(true));
    } else {
      dispatcher(new IsSitedocReachableAction(false));
    }
  });
};

export const LoadNetworkElementDetails = (type: string, id: string, zoomToElement = false) => async (dispatcher: Dispatch) => {
  const response = await dataService.getDetailsData(type, id);
  if (response !== null) {
    dispatcher(new SelectElementAction(response));
    dispatcher(highlightElementAction(response, zoomToElement));
    dispatcher(new ClearHistoryAction());
  } else {
    dispatcher(handleConnectionError());
  }
};

