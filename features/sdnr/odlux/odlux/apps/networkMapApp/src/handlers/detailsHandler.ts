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

import { IActionHandler } from '../../../../framework/src/flux/action';

import { HistoryEntry } from '../model/historyEntry';
import { Link, Site, Device, Service } from '../model/topologyTypes';

import {
  AddToHistoryAction,
  ClearHistoryAction,
  IsBusyCheckingDeviceListAction,
  FinishedLoadingDeviceListAction,
  ClearLoadedDevicesAction,
  ClearDetailsAction,
  InitializeLoadedDevicesAction,
  IsSitedocReachableAction,
  SelectElementAction,
} from '../actions/detailsAction';

export type DetailsStoreState = {
  data: Site | Link | Service | null;
  history: HistoryEntry[];
  isBusyCheckingDeviceList: boolean;
  checkedDevices: Device[];
  isSitedocReachable: boolean;
};

const initialState: DetailsStoreState = {
  data: null,
  history: [],
  isBusyCheckingDeviceList: false,
  checkedDevices: [],
  isSitedocReachable: false,
};

export const DetailsHandler: IActionHandler<DetailsStoreState> = (state = initialState, action) => {
  if (action instanceof SelectElementAction) {
    state = { ...state, data: action.data };
  } else if (action instanceof ClearDetailsAction) {
    state = { ...state, data: null };
  } else if (action instanceof AddToHistoryAction) {
    state = { ...state, history: [...state.history, action.entry] };
  } else if (action instanceof ClearHistoryAction) {
    state = { ...state, history: [] };
  } else if (action instanceof IsBusyCheckingDeviceListAction) {
    state = { ...state, isBusyCheckingDeviceList: action.isBusy };
  } else if (action instanceof FinishedLoadingDeviceListAction) {
    state = { ...state, checkedDevices: action.devices };
  } else if (action instanceof ClearLoadedDevicesAction) {
    state = { ...state, checkedDevices: [] };
  } else if (action instanceof InitializeLoadedDevicesAction) {
    state = { ...state, checkedDevices: action.devices };
  } else if (action instanceof IsSitedocReachableAction) {
    state = { ...state, isSitedocReachable: action.isReachable };
  }
  return state;
};

