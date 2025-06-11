/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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
import React from 'react';

import { AppBar, Tab, Tabs } from '@mui/material';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';

import { setPanelAction } from '../actions/panelChangeActions';
import { loadAllUnmFaultStatusCountAsyncAction } from '../actions/unmFaultManagementAlarmStatusActions';
import UnmFaultManagementDashboard from '../components/unmFaultManagementDashboard';
import UnmFaultManagementFaultLog from '../components/unmFaultManagementFaultLog';
import { unmFaultLogEntriesReloadAction } from '../handlers/unmFaultLogEntriesHandler';
import { PanelId } from '../models/panelId';


const UnmFaultManagementApplication: React.FC<{}> = () => {

  const panel = useSelectApplicationState(state => state.unmFaultManagement.currentOpenPanel);

  const dispatch = useApplicationDispatch();
  const onLoadFaultLogEntries = () => dispatch(unmFaultLogEntriesReloadAction);
  const onLoadDashboard = () => dispatch(loadAllUnmFaultStatusCountAsyncAction);
  const switchActivePanel = (panelId: PanelId) => dispatch(setPanelAction(panelId));

  const onTogglePanel = (panelId: PanelId) => {
    const nextActivePanel = panelId;
    switchActivePanel(nextActivePanel);


    switch (nextActivePanel) {
      case 'Dashboard':
        onLoadDashboard();
        break;
      case 'FaultLog':
        onLoadFaultLogEntries();
        break;
      case null:
        // do nothing if all panels are closed
        break;
      default:
        console.warn('Unknown nextActivePanel [' + nextActivePanel + '] in connectView');
        break;
    }
  };

  const onHandleTabChange = (event: React.SyntheticEvent, newValue: PanelId) => {
    switchActivePanel(newValue);
    onTogglePanel(newValue);
  };

  React.useEffect(() => {
    if (panel === null) {
      onTogglePanel('Dashboard');
    }
  }, []);


  return (
    <>
      <AppBar enableColorOnDark position="static">
        <Tabs indicatorColor="secondary" textColor="inherit" value={panel} onChange={onHandleTabChange} aria-label="unm-fault-app-tabs">
          <Tab aria-label="dashboard-tab" label="Dashboard" value="Dashboard" />
          <Tab aria-label="fault-log-tab" label="Alarm Log" value="FaultLog" />
        </Tabs>
      </AppBar>
      {
        panel === 'Dashboard'
          ? <UnmFaultManagementDashboard />
          : panel === 'FaultLog'
            ? <UnmFaultManagementFaultLog />
            : null
      }
    </>
  );
};

export default UnmFaultManagementApplication;