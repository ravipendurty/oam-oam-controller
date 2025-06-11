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

import { Bands, SiteConfigurationFreqPlan, SiteManagerAreas, SiteManagerCategories, SiteManagerCategoryItems, Sites, SitesListResult } from '../models/siteManager';
import siteManagerService from '../services/siteManagerService';

export class BaseAction extends Action { }

export class SetBusyAction extends Action {
  constructor(public busy: boolean) {
    super();
  }
}

/** 
 * Get countries
 */
export class LoadAllCountriesAction extends BaseAction { }

export class AllCountriesLoadedAction extends BaseAction {
  constructor(public countriesList: SiteManagerAreas[] | null) {
    super();

  }
}

export const loadAllCountriesAsync = () => async (dispatch: Dispatch) => {
  dispatch(new LoadAllCountriesAction());
  const countries: SiteManagerAreas[] = (await siteManagerService.getCountries()) || [];
  dispatch(new AllCountriesLoadedAction(countries));
  return countries;
};

/** 
 * Get areaByAreaId
 */
export class LoadAllAreasByAreaIdAction extends BaseAction { }

export class AllAreasByAreaIdLoadedAction extends BaseAction {
  constructor(public areaList: SiteManagerAreas[] | null) {
    super();

  }
}

export const loadAllAreasByAreaIdAsync = (areaId: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllAreasByAreaIdAction());
  const areas: SiteManagerAreas[] = (await siteManagerService.getAreasByAreaId(areaId)) || [];
  dispatch(new AllAreasByAreaIdLoadedAction(areas));
  return areas;
};

/** 
 * Get sitesByAreaId
 */
export class LoadAllSitesByAreaIdAction extends BaseAction { }

export class AllSitesByAreaIdLoadedAction extends BaseAction {
  constructor(public sitesList: SitesListResult) {
    super();

  }
}

export const loadAllSitesByAreaIdAsync = (areaId: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllSitesByAreaIdAction());
  const sites: SitesListResult = (await siteManagerService.getSitesByAreaId(areaId));
  dispatch(new AllSitesByAreaIdLoadedAction(sites));
  return sites;
};


/** 
 * Get CategoriesBySiteId
 */
export class LoadAllCategoriesBySiteIdAction extends BaseAction { }

export class AllCategoriesBySiteIdALoadedAction extends BaseAction {
  constructor(public categoryList: SiteManagerCategories[] | null) {
    super();

  }
}

export const loadAllCategoriesBySiteIdAsync = (areaId: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllCategoriesBySiteIdAction());
  const categories: SiteManagerCategories[] = (await siteManagerService.getCategoriesBySiteId(areaId)) || [];
  dispatch(new AllCategoriesBySiteIdALoadedAction(categories));
  return categories;
};

/** 
 * Get SiteDetailsBySiteId
 */
export class LoadAllSiteBySiteIdAction extends BaseAction { }

export class AllSiteBySiteIdALoadedAction extends BaseAction {
  constructor(public siteDetails: Sites | null) {
    super();
  }
}

export const loadAllSiteBySiteIdAsync = (siteId: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllSiteBySiteIdAction());
  const siteDetails: Sites = (await siteManagerService.getSiteBySiteId(siteId)) || [];
  dispatch(new AllSiteBySiteIdALoadedAction(siteDetails));
  return siteDetails;
};

/** 
 * Get CategoryItemsBySiteIdAndCategoryName
 */
export class LoadAllCategoryItemsBySiteIdAction extends BaseAction { }

export class AllCategoryItemsBySiteIdALoadedAction extends BaseAction {
  constructor(public categoryItemList: SiteManagerCategoryItems | null) {
    super();
  }
}

export const loadAllCategoryItemsBySiteIdAsync = (siteId: string, categoryName: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllCategoryItemsBySiteIdAction());
  const categoryItemList: SiteManagerCategoryItems = (await siteManagerService.getCategoryItemsBySiteIdAndCategoryName(siteId, categoryName)) || [];
  dispatch(new AllCategoryItemsBySiteIdALoadedAction(categoryItemList));
  return categoryItemList;
};

/** 
 * Get Site frequency plan
 */
export class LoadAllFrequencyPlanBySiteIdAction extends BaseAction { }

export class AllFrequencyPlanBySiteIdALoadedAction extends BaseAction {
  constructor(public freqPlanList: SiteConfigurationFreqPlan[]) {
    super();
  }
}

export const loadAllFrequencyPlanBySiteIdAsync = (siteId: string) => async (dispatch: Dispatch) => {
  dispatch(new LoadAllFrequencyPlanBySiteIdAction());
  try {
    const freqPlan: SiteConfigurationFreqPlan[] = await siteManagerService.getSitesFrequencyPlan(siteId);
    dispatch(new AllFrequencyPlanBySiteIdALoadedAction(freqPlan));
    return freqPlan;
  } catch (error) {
    console.error('Error fetching site frequency plan:', error);
    return [];
  }
};

/** 
 * Get Available Frequency bands
 */
export class LoadAllAvailableBandsAction extends BaseAction { }

export class AllAvailableBandsALoadedAction extends BaseAction {
  constructor(public bandsList: Bands[]) {
    super();
  }
}

export const loadAllAvailableBandsAsync = () => async (dispatch: Dispatch) => {
  dispatch(new LoadAllAvailableBandsAction());
  try {
    const bands: Bands[] = await siteManagerService.getAvailableBands();
    dispatch(new AllAvailableBandsALoadedAction(bands));
    return bands;
  } catch (error) {
    console.error('Error fetching bands:', error);
    return [];
  }
};

/** 
 * Get All Available Site Types
 */
export class LoadAllAvailableSiteTypesAction extends BaseAction { }

export class AllAvailableSiteTypesLoadedAction extends BaseAction {
  constructor(public siteTypesList: String[]) {
    super();
  }
}

export const loadAllAvailableSiteTypesAsync = () => async (dispatch: Dispatch) => {
  dispatch(new LoadAllAvailableSiteTypesAction());
  try {
    const siteTypes: String[] = await siteManagerService.getAvailableSiteTypes();
    dispatch(new AllAvailableSiteTypesLoadedAction(siteTypes));
    return siteTypes;
  } catch (error) {
    console.error('Error fetching site types:', error);
    return [];
  }
};

