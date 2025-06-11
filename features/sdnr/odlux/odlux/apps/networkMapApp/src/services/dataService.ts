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
import { Result } from '../../../../framework/src/models';

import { NetworkElementConnection } from '../model/networkElementConnection';
import { URL_API, URL_TILE_API } from '../config';
import { ElementCount } from '../model/count';
import { SearchResult } from '../model/searchResult';

class DataService {

  tryReachTileServer = async () => {

    try {

      const tiles = await fetch(URL_TILE_API + '/10/0/0.png');
      if (tiles.status == 200) {
        return true;
      } else {
        console.error(tiles);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;

    }
  };

  tryReachTopologyServer = async () => {
    const response = await requestRestExt<any>(URL_API + '/info/count/all');

    if (response.status == 200) {
      return true;
    } else {
      console.error(response.message);
      return false;
    }

  };

  getGeojsonData = async (url: string) => {

    const result = await requestRestExt<any>(url);
    return result;

  };

  getDetailsData = async (type: string, id: string) => {

    const response = await requestRestExt<any>(`${URL_API}/${type}s/${id}`);
    if (response.status == 200) {
      return response.data;
    } else {
      console.error(response.message);
      return null;
    }
  };

  search = (searchTerm: string) => {
    const data = { searchTerm };
    return requestRest<SearchResult>(`${URL_API}/search`, { method: 'POST', body: JSON.stringify(data) });
  };

  /**
   * Get status and type of devices, if possible
   */
  getAdditionalInfoOnDevices = async (ids: string[]) => {

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
      const result = await requestRest<Result<NetworkElementConnection>>(path, { method: 'POST', body: JSON.stringify(query) });
      const resultData = result && result['data-provider:output'] && result['data-provider:output'].data;
      return resultData;
    } else {
      return null;
    }
  };

  getLabels = () => requestRest<string[]>(`${URL_API}/labels`);

  getStatistics = (bbWest: number, bbSouth: number, bbEast: number, bbNorth: number) =>
    requestRest<ElementCount>(`${URL_API}/info/count/${bbWest},${bbSouth},${bbEast},${bbNorth}`);
  
}

export const dataService = new DataService();