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

import { SearchSiteIdResult } from '../models/siteManager';
import siteManagerService from '../services/siteManagerService';

export class SearchValueAction extends Action {
  constructor(public siteId: string, public categoryName?: string) {
    super();
  }
}

export class SetBusyAction extends Action {
  constructor(public busy: boolean) {
    super();
  }
}


/** 
 * Get searchTreeBySiteIdOrName
 */
export class BaseAction extends Action { }

export class LoadTreeSiteSearchBySiteIdOrNameAction extends BaseAction { }

export class AllTreeSiteSearchBySiteIdOrNameLoadedAction extends BaseAction {
  constructor(public searchResult: SearchSiteIdResult) {
    super();
  }
}

export const loadTreeSiteSearchBySiteIdOrNameAsync = (searchValue: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadTreeSiteSearchBySiteIdOrNameAction());
  const searchResult: SearchSiteIdResult = (await siteManagerService.getSearchSiteIDTrail(searchValue));
  dispatch(new AllTreeSiteSearchBySiteIdOrNameLoadedAction(searchResult));
  return searchResult;
};