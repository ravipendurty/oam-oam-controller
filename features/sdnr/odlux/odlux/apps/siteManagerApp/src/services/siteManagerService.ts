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

import { requestRestExt } from '../../../../framework/src/services/restService';

import {
  SearchSiteIdResult, SiteConfigurationFreqPlan, SiteManagerAreas, SiteManagerCategories, SiteManagerCategoryItems,
  Sites, SitesListResult, addEditSiteConfig, Bands,
} from '../models/siteManager';

/**
 * Represents a web api accessor service for all  entries related actions.
 */

const URL_SITE_MANAGER = '/topology/site-manager';

const URL_MICROWAVE = '/topology/microwave';

const siteManagerService = {
  getCountries: async (): Promise<SiteManagerAreas[]> => {
    return fetch(`${URL_SITE_MANAGER}/areas`)
      .then(res => res.json())
      .then(result => {
        return result;
      });
  },

  getAreasByAreaId: async (areaId: string): Promise<SiteManagerAreas[]> => {
    return fetch(`${URL_SITE_MANAGER}/areas/${areaId}/areas`)
      .then(res => res.json())
      .then(result => {
        return result;
      });
  },

  getSitesByAreaId: async (areaId: string): Promise<SitesListResult> => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Accept', 'application/json');

    return fetch(`${URL_SITE_MANAGER}/areas/${areaId}/sites`, {
      method: 'GET',
      headers: requestHeaders,
    })
      .then(response => {
        if (!response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw response;
        }
        return response.json();
      })
      .then(response => {
        const returnResponse: SitesListResult = {
          sites: response ? response : [],
          isError: false,
          errorMessage: '',
        };
        return returnResponse;
      }).catch(error => {
        return error.json().then((errorMessage: any) => {
          const returnResponse: SitesListResult = {
            sites: [],
            isError: true,
            errorMessage: errorMessage.message,
          };
          return returnResponse;
        });
      });
  },

  getSiteBySiteId: async (siteId: string): Promise<Sites> => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Accept', 'application/json');

    return fetch(`${URL_SITE_MANAGER}/sites/${siteId}`, {
      method: 'GET',
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(result => {
        return result;
      }).catch(error => {
        console.log('Error: ', error);
      });
  },

  getCategoriesBySiteId: async (siteId: string): Promise<SiteManagerCategories[]> => {
    return fetch(`${URL_SITE_MANAGER}/sites/${siteId}/categories`)
      .then(res => res.json())
      .then(result => {
        return result;
      });
  },

  getCategoryItemsBySiteIdAndCategoryName: async (siteId: string, categoryName: string): Promise<SiteManagerCategoryItems> => {
    return fetch(`${URL_SITE_MANAGER}/sites/${siteId}/categories/${categoryName}/items`)
      .then(res => res.json())
      .then(result => {
        return result;
      }).catch(() => {
        // TODO comment the below code - testing
        const value: SiteManagerCategoryItems = [{
          name: categoryName,
          url: 'No url found',
          'last-update': 'today',
        }];
        return value;
      });
  },

  getSearchSiteIDTrail: async (siteId: string): Promise<SearchSiteIdResult> => {
    const data = { query: siteId, showBesideItems: true };

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Accept', 'application/json');

    return fetch(`${URL_SITE_MANAGER}/search`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw response;
        }
        return response.json();
      })
      .then(response => {
        const returnResponse: SearchSiteIdResult = {
          areas: response.areas ? response.areas : [],
          sites: response.sites ? response.sites : [],
          isError: false,
          errorMessage: '',
        };
        return returnResponse;
      }).catch(error => {
        return error.json().then((errorMessage: any) => {
          const returnResponse: SearchSiteIdResult = {
            areas: [],
            sites: [],
            isError: true,
            errorMessage: errorMessage.message,
          };
          return returnResponse;
        });
      });
  },

  saveModifiedSiteDetails: async (siteDetails: Sites, siteId: string) => {
    type Message = { 'message': string };
    const response = await requestRestExt<Message>(URL_SITE_MANAGER + `/sites/${siteId}`, {
      method: 'PUT',
      body: JSON.stringify(siteDetails),
    });
    if (response.status == 200) {
      return { message: 'Save Successful', error: false, serverError: false };
    } else {
      let message = { message: '', error: true, serverError: true };
      if (response.data?.message) {
        message.serverError = (response.status == 400) ? true : false;
        message.message = 'Save failed: ' + response.data ? response.data.message : 'unknown';
        return message;
      } else {
        message.serverError = true;
        message.message = 'Something went wrong ' + response.message;
        return message;
      }
    }
  },

  getSitesFrequencyPlan: async (siteId: string): Promise<SiteConfigurationFreqPlan[]> => {
    const response = await fetch(`${URL_MICROWAVE}/network/sites/${siteId}/frequencyplan`);
    const result = await response.json();
    return result as SiteConfigurationFreqPlan[];
  },

  getAvailableBands: async (): Promise<Bands[]> => {
    const response = await fetch(`${URL_MICROWAVE}/bands`);
    const result = await response.json();
    return result as Bands[];
  },

  getAvailableSiteTypes: async (): Promise<string[]> => {
    const response = await fetch(`${URL_SITE_MANAGER}/site-types`);
    const data = await response.json();
    const filteredData = data.filter((item: string | null) => item !== null && item !== '');
    return filteredData as string[];
  },

  saveSiteConfiguration: async (modifiedConfig: addEditSiteConfig, bandId: string, siteId: string) => {
    type Message = { 'message': string };
    const response = await requestRestExt<Message>(`${URL_MICROWAVE}/network/sites/${siteId}/frequencyplan/${bandId}`, {
      method: 'PUT',
      body: JSON.stringify(modifiedConfig),
    });
    if (response.status == 200) {
      return { message: 'Save Successful', error: false, serverError: false };
    } else {
      let message = { message: '', error: true, serverError: true };
      if (response.data?.message) {
        message.serverError = (response.status == 400) ? true : false;
        message.message = 'Save failed: ' + response.data ? response.data.message : 'unknown';
        return message;
      } else {
        message.serverError = true;
        message.message = 'Something went wrong ' + response.message;
        return message;
      }
    }
  },

  createSiteConfiguration: async (newConfig: addEditSiteConfig, bandId: string, siteId: string) => {
    type Message = { 'message': string };
    const response = await requestRestExt<Message>(`${URL_MICROWAVE}/network/sites/${siteId}/frequencyplan/${bandId}`, {
      method: 'POST',
      body: JSON.stringify(newConfig),
    });
    if (response.status == 200) {
      return { message: 'Save Successful', error: false, serverError: false };
    } else {
      let message = { message: '', error: true, serverError: true };
      if (response.data?.message) {
        message.serverError = (response.status == 400) ? true : false;
        message.message = 'Save failed: ' + response.data ? response.data.message : 'unknown';
        return message;
      } else {
        message.serverError = true;
        message.message = 'Something went wrong ' + response.message;
        return message;
      }
    }
  },

  deleteSiteConfiguration: async (bandId: string, siteId: string) => {
    type Message = { 'message': string };
    const response = await requestRestExt<Message>(`${URL_MICROWAVE}/network/sites/${siteId}/frequencyplan/${bandId}`, {
      method: 'DELETE',
    });
    if (response.status == 200) {
      return { message: 'Delete Successful', error: false, serverError: false };
    } else {
      let message = { message: '', error: true, serverError: true };
      if (response.data?.message) {
        message.serverError = (response.status == 400) ? true : false;
        message.message = 'Delete failed: ' + response.data ? response.data.message : 'unknown';
        return message;
      } else {
        message.serverError = true;
        message.message = 'Something went wrong ' + response.message;
        return message;
      }
    }
  },
};

export default siteManagerService;