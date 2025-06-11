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


import { Action } from '../../../../../framework/src/flux/action';
import { Dispatch } from '../../../../../framework/src/flux/store';

import { Height } from '../model/lineOfSightHeight';
import { LatLon } from '../model/lineOfSightLatLon';

import { calculateMidPoint } from '../utils/lineOfSightMap';
import { isNumber } from '../utils/lineOfSightMath';

export class SetPassedInValuesAction extends Action {
  constructor(public start: LatLon, public end: LatLon, public center: LatLon, public heightA: Height | null, public heightB: Height | null) {
    super();
  }
}

export class SetReachableAction extends Action {
  constructor(public reachable: boolean | null) {
    super();
  }
}

export const SetPassedInValues = (values: (string | null)[]) => (dispatcher: Dispatch) => {
  const start: LatLon = { latitude: Number(values[0]), longitude: Number(values[1]) };
  const end: LatLon = { latitude: Number(values[2]), longitude: Number(values[3]) };
  const midpoint = calculateMidPoint(start.latitude, start.longitude, end.latitude, end.longitude);
  const center: LatLon = { latitude: midpoint.latitude, longitude: midpoint.longitude };
  const heightA: Height | null = isNumber(values[4]) && isNumber(values[5]) ? { amsl: +values[4]!, antennaHeight: +values[5]! } : null;
  const heightB: Height | null = isNumber(values[6]) && isNumber(values[7]) ? { amsl: +values[6]!, antennaHeight: +values[7]! } : null;
  dispatcher(new SetPassedInValuesAction(start, end, center, heightA, heightB));
};