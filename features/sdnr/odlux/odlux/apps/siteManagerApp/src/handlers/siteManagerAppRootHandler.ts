/**
* ============LICENSE_START========================================================================
* ONAP : ccsdk feature sdnr wt odlux
* =================================================================================================
* Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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
import { combineActionHandler } from '../../../../framework/src/flux/middleware';

import { SetPanelAction } from '../actions/panelActions';
import { SearchValueAction } from '../actions/siteManagerSiteSearchAction';
import { PanelId } from '../models/panelId';
import { DetailsReducer, DetailsStoreState } from './detailsReducer';
import { deviceTableActionHandler, IDeviceTableState } from './deviceTableHandler';
import { ILinkTableState, linkTableActionHandler } from './linkTableHandler';
import { ManagementHandler, ManagementState } from './sitedocManagementHandler';
import { siteManagerSiteSearchHandler } from './siteManagerSiteSearchHandler';
import { areasActionHandler, IAreasState } from './siteManagerTreeHandler';
import { ISiteTableState, siteTableActionHandler } from './siteTableHandler';

export interface ISiteManagerAppStoreState {
  siteManagerTree: IAreasState;
  searchSite: SearchValueAction;
  sitedocManagement: ManagementState;
  details: DetailsStoreState;
  currentOpenPanel: PanelId;
  siteTable: ISiteTableState;
  linkTable: ILinkTableState;
  deviceTable: IDeviceTableState;
}

const currentOpenPanelHandler: IActionHandler<PanelId> = (state = null, action) => {
  if (action instanceof SetPanelAction) {
    state = action.panelId;
  }
  return state;
};



declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    siteManager: ISiteManagerAppStoreState;
  }
}

const actionHandlers = {
  siteManagerTree: areasActionHandler,
  searchSite: siteManagerSiteSearchHandler,
  sitedocManagement: ManagementHandler,
  details: DetailsReducer,
  currentOpenPanel: currentOpenPanelHandler,
  siteTable: siteTableActionHandler,
  linkTable: linkTableActionHandler,
  deviceTable: deviceTableActionHandler,
};

export const siteManagerAppRootHandler = combineActionHandler<ISiteManagerAppStoreState>(actionHandlers);
export default siteManagerAppRootHandler;

