/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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


import { Link } from '../model/link';

export const check = (linktAttributes: Link):String => {
  if (!linktAttributes) {
    return 'Missing Link Attributes';
  }
  var missingParameter:string = '';

  const checkParameterNotExist = (val: number | null, message: string, description: string):string => {
    //Check for null, undefined and NaN
    return val == null || isNaN(val) ? message.concat(description + ':' + val) : message;
  };
  missingParameter = checkParameterNotExist(linktAttributes.siteA.amslM, missingParameter, ' A-amslM');
  missingParameter = checkParameterNotExist(linktAttributes.siteB.amslM, missingParameter, ' B-amslM');
  missingParameter = checkParameterNotExist(linktAttributes.siteA.lat, missingParameter, ' A-lat');
  missingParameter = checkParameterNotExist(linktAttributes.siteA.lon, missingParameter, ' A-lon');
  missingParameter = checkParameterNotExist(linktAttributes.siteB.lat, missingParameter, ' B-lat');
  missingParameter = checkParameterNotExist(linktAttributes.siteB.lon, missingParameter, ' B-lon');

  // for (var prop in linktAttributes.siteA.antenna) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }
  // for (var prop in linktAttributes.siteB.antenna) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }
  // for (var prop in linktAttributes.siteA.radio) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }
  // for (var prop in linktAttributes.siteB.radio) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }
  // for (var prop in linktAttributes.siteA.waveguide) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }
  // for (var prop in linktAttributes.siteB.waveguide) {
  //     if (prop !== null) {
  //         continue
  //     } else return false
  // }

  if (missingParameter === '') {
    return '';
  } else {
    missingParameter = 'Missing parameters: '.concat(missingParameter);
    console.log(missingParameter);
    return missingParameter;
  }
};