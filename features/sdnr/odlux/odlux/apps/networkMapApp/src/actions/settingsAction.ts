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

import { NetworkMapSettings, NetworkMapThemes } from '../model/settings';
import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { getMapSettings, updateMapSettings } from '../services/settingsService';
import { UpdateLayersVisibilityAction } from './mapActions';

export class SetMapSettingsAction extends Action {

  constructor(public settings: NetworkMapSettings) {
    super();
  }
}

export class SetThemeSettingsAction extends Action {

  constructor(public settings: NetworkMapThemes) {
    super();
  }
}

export class SetBusyLoadingAction extends Action {
   
  constructor(public busy: boolean) {
    super();
        
  }
}

/**
 * An async action that loads the settings from the backend.
 * @returns void
 */
export const getSettings = () => async (dispatch: Dispatch) => {
  dispatch(new SetBusyLoadingAction(true));
   
  getMapSettings().then(result => {
    if (result) {
      if (result.networkMap) {
        dispatch(new SetMapSettingsAction(result.networkMap));
      }
      if (result.networkMapThemes) {
        dispatch(new SetThemeSettingsAction(result.networkMapThemes));
      }
      if (result.networkMapLayers) {
        dispatch(new UpdateLayersVisibilityAction(result.networkMapLayers));
      }
    } else {
      console.warn('settings couldn\'t be loaded.');
    }
    dispatch(new SetBusyLoadingAction(false));
  });
};

/**
 * An async action that updates and saves the settings on the backend.
 * @param mapSettings The new settings.
 * @returns void
 */
export const updateSettings = (mapSettings: NetworkMapSettings) => async (dispatcher: Dispatch) =>{

  const result = await updateMapSettings(mapSettings);
  dispatcher(new SetMapSettingsAction(mapSettings));

  if (!result) {
    console.warn('settings couldn\'t be saved.');
  }

};
