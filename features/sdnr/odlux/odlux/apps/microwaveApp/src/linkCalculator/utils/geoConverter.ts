
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

export const LatLonToDMS = (value: number, isLon: boolean) => {
  const absoluteValue = Math.abs(value);
  const d = Math.floor(absoluteValue);
  const m = Math.floor((absoluteValue - d) * 60);
  const s = (absoluteValue - d - m / 60) * 3600;
  const dms = `${d}° ${m}' ${s.toFixed(2)}"`;

  const sign = Math.sign(value);

  if (isLon) {
    return (sign === -1 || sign === -0) ? dms + ' W' : dms + ' E';
  } else {
    return (sign === -1 || sign === -0) ? dms + ' S' : dms + ' N';
  }
};