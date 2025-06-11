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

import { combineActionHandler } from '../../../../../framework/src/flux/middleware';

import { AntennaHandler, antennaState } from './antennaHandler';
import { AtmosphericLossHandler, atmosphericLossState } from './atmosphericLossHandler';
import { errorState } from './errorHandler';
import { LinkHandler, linkState } from './linkHandler';
import { QueryHandler, queryState } from './queryHandler';
import { RadioHandler, radioState } from './radioHandler';
import { SiteHandler, siteState } from './siteHandler';
import { ViewHandler, viewState } from './viewHandler';
import { WaveguideHandler, waveguideState } from './waveguideHandler';
import { ErrorHandler } from './errorHandler';
import { IActionHandler } from '../../../../../framework/src/flux/action';
import { UpdateTabAction } from '../actions/commonActions';
import { TabId } from '../model/tabId';
import { ILinkTableState, linkTableActionHandler } from './linkTableHandler';
import { IMap, mapHandler } from '../../lineOfSight/handlers/lineOfSightMapHandler';
import { bandPlanHandler, bandPlanState } from './bandPlanHandler';

interface IMicrowaveAppStateStore {
  antenna: antennaState;
  atmosphere: atmosphericLossState;
  link: linkState;
  radio: radioState;
  site: siteState;
  view: viewState;
  waveguide: waveguideState;
  query: queryState;
  error: errorState;
  currentTab: TabId;
  linkTable: ILinkTableState;
  bandPlan: bandPlanState;
  map: IMap;
}


declare module '../../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    microwave: IMicrowaveAppStateStore;
  }
}

export const TabHandler: IActionHandler<TabId> = (state = 'linkTable', action) => {
  if (action instanceof UpdateTabAction) {
    state = action.openTab;
  }
  return state;
};
const appHandler = {
  antenna: AntennaHandler,
  atmosphere: AtmosphericLossHandler,
  link: LinkHandler,
  radio: RadioHandler,
  site: SiteHandler,
  view: ViewHandler,
  waveguide: WaveguideHandler,
  query: QueryHandler,
  error: ErrorHandler,
  currentTab: TabHandler,
  linkTable: linkTableActionHandler,
  map: mapHandler,
  bandPlan: bandPlanHandler,
};

export const RootHandler = combineActionHandler<IMicrowaveAppStateStore>(appHandler);
export default RootHandler;



