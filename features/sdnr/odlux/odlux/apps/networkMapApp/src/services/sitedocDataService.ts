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

import { Site } from '../model/topologyTypes';
import { RegisterUser, SitedocOrder, UserListItem } from '../model/siteDocTypes';

const BASE_URL = '/sitedoc';

type Message = {
  message: string;
};

class SitedocService {

  createOrder = async (order: SitedocOrder) => {

    const result = await requestRestExt<Message>(BASE_URL + '/order/create', { method: 'POST', body: JSON.stringify(order) });

    if (result.status === 200) { 
      return { message: result.data!.message, error: false };
    } else {

      const message = { message: '', error: true };

      if (result.data) {
        message.message = 'Creation failed. Reason: ' + result.data.message;
        return message;
      } else {
        message.message = 'Something went wrong...';
        return message;
      }
    }
  };

  createUser = (user: RegisterUser) => requestRest<Message>(BASE_URL + '/user/register', { method: 'POST', body: JSON.stringify(user) });

  getSiteIfExists = (siteId: string) => requestRest<Site>('/topology/network/sites/' + siteId);

  getAllUsers = async () => {

    const result = await requestRest<UserListItem[]>(BASE_URL + '/users/android');

    if (result) {
      return result;
    } else {
      return [];
    }

  };
}

const sitedocDataService = new SitedocService();
export { sitedocDataService };