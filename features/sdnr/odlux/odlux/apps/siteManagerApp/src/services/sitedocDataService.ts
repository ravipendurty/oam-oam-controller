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

import { requestRest, requestRestExt } from '../../../../framework/src/services/restService';

import { Site } from '../models/site';
import { SitedocOrder, UserListItem } from '../models/siteDocTypes';
import { SiteManagerSiteOrderItemsDetails } from '../models/siteManager';

const BASE_URL = '/sitedoc';

type Message = { 'message': string };

const sitedocDataService = {
  createOrder: async (order: SitedocOrder, siteId: string) => {
    const result = await requestRestExt<Message>(BASE_URL + `/site/${siteId}/order`, { method: 'POST', body: JSON.stringify(order) });
    if (result.status === 200) {
      return { message: 'Order Created', error: false, serverError: false };
    } else {
      let message = { message: '', error: true, serverError: false };
      if (result.data) {
        message.message = 'Creation failed: ' + result.data ? result.data.message : 'unknown';
        return message;
      } else {
        message.serverError = (result.status === 403) ? true : false;
        message.message = 'Something went wrong... ' + result.message;
        return message;
      }
    }
  },

  getSiteIfExists: async (siteId: string) => {
    return requestRest<Site>('/topology/network/sites/' + siteId);
  },

  getAllUsers: async () => {
    const result = await requestRest<UserListItem[]>(BASE_URL + '/users/android');
    if (result) {
      return result;
    } else {
      return [];
    }
  },

  getSiteDetails: async (siteId: string): Promise<SiteManagerSiteOrderItemsDetails> => {
    const selectedSiteId = siteId.split('#')[0] + '';
    return fetch(`${BASE_URL}/site/${selectedSiteId}/orders`)
      .then(res => res.json())
      .then(result => {
        return result;
      }).catch(() => {
        const value: SiteManagerSiteOrderItemsDetails = [{
          assignedUser: '',
          state: '',
          note: '',
          tasks: [{
            type: '',
            description: '',
            completed: false,
          }],
        }];
        return value;
      });
  },
};

export default sitedocDataService;
