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

import { Result } from '../../../../framework/src/models';
import { requestRest } from '../../../../framework/src/services/restService';

import { NetworkElementConnection } from '../models/networkElementConnection';

const dataService = {
  getAdditionalInfoOnDevices: async (ids: string[]) => {
    const path = 'rests/operations/data-provider:read-network-element-connection-list';
    const query = {
      'data-provider:input': {
        'filter': [{
          'property': 'id',
          'filtervalues': ids,
        }],
        'pagination': {
          'size': ids.length,
          'page': 1,
        },
      },
    };
    if (ids.length > 0) {
      const result = await requestRest<Result<NetworkElementConnection>>(
        path,
        { method: 'POST', body: JSON.stringify(query) },
      );
      const resultData = result && result['data-provider:output'] && result['data-provider:output'].data;
      return resultData;
    } else {
      return null;
    }
  },
};

export default dataService;