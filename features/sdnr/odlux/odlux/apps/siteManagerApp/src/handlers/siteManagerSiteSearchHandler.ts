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

import { AllTreeSiteSearchBySiteIdOrNameLoadedAction, LoadTreeSiteSearchBySiteIdOrNameAction, SearchValueAction, SetBusyAction }
  from '../actions/siteManagerSiteSearchAction';
import { SearchSiteIdResult } from '../models/siteManager';

export type searchState = {
  siteId: string;
  categoryName: string;
  searchValue: SearchSiteIdResult;
  busy: boolean;
  isLoadingData: boolean;
};

const initialState: searchState = {
  siteId: '',
  categoryName: '',
  searchValue: {
    areas: [],
    sites: [],
    isError: false,
    errorMessage: '',
  },
  busy: false,
  isLoadingData: true,
};

export const siteManagerSiteSearchHandler: IActionHandler<searchState> = (state = initialState, action) => {
  if (action instanceof SearchValueAction) {
    state = Object.assign({}, state, { siteId: action.siteId, categoryName: action.categoryName });
  } else if (action instanceof LoadTreeSiteSearchBySiteIdOrNameAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllTreeSiteSearchBySiteIdOrNameLoadedAction) {
    if (action.searchResult) {
      state = {
        ...state,
        searchValue: {
          areas: action.searchResult.areas,
          sites: action.searchResult.sites,
          isError: action.searchResult.isError,
          errorMessage: action.searchResult.errorMessage,
        },
        busy: false,
      };
    }
  } else if (action instanceof SetBusyAction) {
    state = {
      ...state,
      isLoadingData: action.busy,
    };
  }
  return state;
}; 