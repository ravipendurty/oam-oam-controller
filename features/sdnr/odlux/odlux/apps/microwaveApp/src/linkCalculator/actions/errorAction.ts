
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

import { Action } from '../../../../../framework/src/flux/action';
import { Dispatch } from '../../../../../framework/src/flux/store';
import { IApplicationStoreState } from '../../../../../framework/src/store/applicationStore';

export class UpdateLatitudeErrorAction extends Action {
  constructor(public error1: string | null, public error2: string | null) {
    super();
  }
}
export class UpdateLongitudeErrorAction extends Action {
  constructor(public error1: string | null, public error2: string | null) {
    super();
  }
}
export class UpdateFrequencyErrorAction extends Action {
  constructor(public error: string) {
    super();
  }
}
export class UpdateRainMethodErrorAction extends Action {
  constructor(public error: string) {
    super();
  }
}
export class UpdateAttenuationMethodErrorAction extends Action {
  constructor(public error: string) {
    super();
  }
}
export class FirstMandatoryCheckAction extends Action {
}



export const formValid = () => async (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {

  const siteState = getState().microwave.site;

  const latitude1Error = siteState.lat1 === 0 ? 'Enter a number between -90 to 90' : null;
  const latitude2Error = siteState.lat2 === 0 ? 'Enter a number between -90 to 90' : null;
  const longitude1Error = siteState.lon1 === 0 ? 'Enter a number between -180 to 180' : null;
  const longitude2Error = siteState.lon2 === 0 ? 'Enter a number between -180 to 180' : null;
  const frequencyError = getState().microwave.radio.band.frequency === 0 ? 'Select a frequency' : '';
  const rainMethodError = getState().microwave.atmosphere.rainMethod === '0' ? 'Select the rain method' : '';
  const attenuationMethodError = getState().microwave.atmosphere.attenuationMethod === '0' ? 'Select the attenuation method' : '';

  dispatcher(new UpdateLatitudeErrorAction(latitude1Error, latitude2Error));
  dispatcher(new UpdateLongitudeErrorAction(longitude1Error, longitude2Error));
  dispatcher(new UpdateFrequencyErrorAction(frequencyError));
  dispatcher(new UpdateRainMethodErrorAction(rainMethodError));
  dispatcher(new UpdateAttenuationMethodErrorAction(attenuationMethodError));

  return latitude1Error === null && latitude2Error === null && longitude1Error === null && longitude2Error === null && frequencyError === '';
};

