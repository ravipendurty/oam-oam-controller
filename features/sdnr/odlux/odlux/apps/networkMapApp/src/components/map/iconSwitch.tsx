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

import React, { useEffect } from 'react';
import { FormControlLabel, Switch } from '@mui/material';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { SetIconSwitchAction } from '../../actions/mapActions';
import { updateSettings } from '../../actions/settingsAction';
import { NetworkMapSettings } from '../../model/settings';

type IconSwitchProps = { visible: boolean };

const IconSwitch: React.FC<IconSwitchProps> = (props) =>{

  const areIconsEnabled = useSelectApplicationState(state => state.network.map.allowIconSwitch);
  const settings = useSelectApplicationState(state => state.network.settings.mapSettings);

  const dispatch = useApplicationDispatch();
  const toggle = (enable:boolean) => dispatch(new SetIconSwitchAction(enable));
  const updateUserSettings = (mapSettings: NetworkMapSettings) => dispatch(updateSettings(mapSettings));

  //??? TODO: look into please
  //use ref to be available within map events
  const iconsEnabledRef = React.useRef(areIconsEnabled);
  
  const setIconsEnabled = (data: boolean) => {
    iconsEnabledRef.current = data;
  };

  const handleToggleChanged = () => {
    setIconsEnabled(!areIconsEnabled);
    toggle(!areIconsEnabled);
  };

  const handleDefaultValue = () => {
    const settingsIconsEnabled = settings?.areIconsEnabled;
    if (settingsIconsEnabled !== undefined) {
      setIconsEnabled(settingsIconsEnabled);
      toggle(settingsIconsEnabled);
    }
  };

  const saveSettings = (data: any) => {
    data.areIconsEnabled = iconsEnabledRef.current;
    updateUserSettings(data);
  };

  const saveChanges = () => {
    if (settings === null) {
      saveSettings({ networkMap:{} });
    } else if (settings && iconsEnabledRef.current !== settings.areIconsEnabled) {
      saveSettings(settings);
    }
  };

  window.onbeforeunload = () => { //called right before browser refreshes or some such
    saveChanges();
  };

  useEffect(()=>{

    handleDefaultValue(); 
    return () => { // executed on unmount
      saveChanges();
    };
  }, []);

  useEffect(()=>{
    handleDefaultValue();
  }, [settings?.areIconsEnabled]);

  return (
    props.visible ?
      <FormControlLabel style={{ padding: 5, position: 'absolute', top: 210, zIndex: 1 }}
        value="end"
        control={<Switch color="secondary" style={{ zIndex: 1 }} checked={areIconsEnabled} onChange={handleToggleChanged} />}
        label="Show icons"
        labelPlacement="end"
      /> : null);
};

IconSwitch.displayName = 'IconSwitch';

export { IconSwitch } ;