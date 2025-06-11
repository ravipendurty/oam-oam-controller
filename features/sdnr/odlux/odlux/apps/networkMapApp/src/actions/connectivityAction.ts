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
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

export class IsTopologyServerReachableAction extends Action {
  constructor(public reachable: boolean) {
    super();
  }
}

export class IsTileServerReachableAction extends Action {
  constructor(public reachable: boolean) {
    super();
  }
}

export class IsBusyCheckingConnectivityAction extends Action {
  constructor(public isBusy: boolean) {
    super();
  }
}

export const handleConnectionError = () => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const { network: { connectivity: { isTopologyServerAvailable } } } = getState();
  if (isTopologyServerAvailable) {
    dispatcher(new IsTopologyServerReachableAction(false));
  }
};

export const handleConnectionChange = (newState: boolean) => (dispatcher: Dispatch, _getState: () => IApplicationStoreState) => {
  dispatcher(new IsTopologyServerReachableAction(newState));
};

export const setTileServerReachableAction = (isReachable: boolean) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const { network: { connectivity: { isTileServerAvailable } } } = getState();
  if (isReachable !== isTileServerAvailable) {
    dispatcher(new IsTileServerReachableAction(isReachable));
  }
};

export const setTopologyServerReachableAction = (isReachable: boolean) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const { network: { connectivity: { isTopologyServerAvailable } } } = getState();
  if (isReachable !== isTopologyServerAvailable) {
    dispatcher(new IsTopologyServerReachableAction(isReachable));
  }
};