/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2021 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import {
  AllAreasByAreaIdLoadedAction, AllCategoriesBySiteIdALoadedAction, AllCategoryItemsBySiteIdALoadedAction,
  AllCountriesLoadedAction, AllSiteBySiteIdALoadedAction, AllSitesByAreaIdLoadedAction, LoadAllAreasByAreaIdAction,
  LoadAllCategoriesBySiteIdAction, LoadAllCategoryItemsBySiteIdAction, LoadAllCountriesAction, LoadAllSiteBySiteIdAction,
  LoadAllSitesByAreaIdAction, SetBusyAction, LoadAllFrequencyPlanBySiteIdAction, AllFrequencyPlanBySiteIdALoadedAction,
  LoadAllAvailableBandsAction, AllAvailableBandsALoadedAction,
} from '../actions/siteManagerTreeActions';
import { LinkDetails, SiteManagerAreas, SiteManagerCategories, SiteManagerCategoryItems, SitesListResult } from '../models/siteManager';
import { Site } from '../models/siteSearch';

export interface IAreasState {
  countryList: SiteManagerAreas[];
  areaList: SiteManagerAreas[];
  sitesList: SitesListResult;
  categoryList: SiteManagerCategories[];
  frequencyPlan: any[];
  bands: any[];
  siteDetails: Site;
  categoryItems: SiteManagerCategoryItems;
  linksList: LinkDetails[];
  busy: boolean;
  isLoadingData: boolean;
}

const areasStateInit: IAreasState = {
  countryList: [],
  areaList: [],
  sitesList: {
    sites: [],
    isError: false,
    errorMessage: '',
  },
  categoryList: [],
  frequencyPlan: [],
  bands: [],
  siteDetails: {
    id: '',
    uuid: '',
    name: '',
    'area-id': '',
    'item-count': 0,
    address: {
      streetAndNr: '',
      city: '',
      zipCode: '',
      country: '',
    },
    operator: '',
    location: {
      lon: '',
      lat: '',
    },
  },
  categoryItems: [{
    name: '',
    url: '',
    'last-update': '',
  }],
  linksList: [],
  busy: false,
  isLoadingData: true,
};

export const areasActionHandler: IActionHandler<IAreasState> = (state = areasStateInit, action) => {
  if (action instanceof LoadAllCountriesAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllCountriesLoadedAction) {
    if (action.countriesList) {
      state = {
        ...state,
        countryList: action.countriesList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllAreasByAreaIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllAreasByAreaIdLoadedAction) {
    if (action.areaList) {
      state = {
        ...state,
        areaList: action.areaList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllSitesByAreaIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllSitesByAreaIdLoadedAction) {
    if (action.sitesList) {
      state = {
        ...state,
        sitesList: action.sitesList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllCategoriesBySiteIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllCategoriesBySiteIdALoadedAction) {
    if (action.categoryList) {
      state = {
        ...state,
        categoryList: action.categoryList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllFrequencyPlanBySiteIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllFrequencyPlanBySiteIdALoadedAction) {
    if (action.freqPlanList) {
      state = {
        ...state,
        frequencyPlan: action.freqPlanList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllAvailableBandsAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllAvailableBandsALoadedAction) {
    if (action.bandsList) {
      state = {
        ...state,
        bands: action.bandsList,
        busy: true,
      };
    }
  } else if (action instanceof LoadAllSiteBySiteIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllSiteBySiteIdALoadedAction) {
    if (action.siteDetails) {
      state = {
        ...state,
        siteDetails: {
          id: action.siteDetails.id,
          name: action.siteDetails.name,
          uuid: action.siteDetails.uuid,
          'area-id': action.siteDetails['area-id'],
          'item-count': action.siteDetails['item-count'],
          address: {
            streetAndNr: action.siteDetails.address ? action.siteDetails.address.streetAndNr : '',
            city: action.siteDetails.address ? action.siteDetails.address.city : '',
            zipCode: action.siteDetails.address ? action.siteDetails.address.zipCode : '',
            country: action.siteDetails.address ? action.siteDetails.address.country : '',
          },
          operator: action.siteDetails.operator,
          location: {
            lon: action.siteDetails.location ? action.siteDetails.location.lon : '',
            lat: action.siteDetails.location ? action.siteDetails.location.lat : '',
          },
        },
        busy: true,
      };
    }
  } else if (action instanceof LoadAllCategoryItemsBySiteIdAction) {
    state = {
      ...state,
      busy: true,
    };
  } else if (action instanceof AllCategoryItemsBySiteIdALoadedAction) {
    if (action.categoryItemList) {
      state = {
        ...state,
        categoryItems: [{
          name: action.categoryItemList[0].name,
          url: action.categoryItemList[0].url,
          'last-update': action.categoryItemList[0]['last-update'],
        }],
        busy: true,
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