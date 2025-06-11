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
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Refresh from '@mui/icons-material/Refresh';
import Sync from '@mui/icons-material/Sync';
import { AppBar, Tab, Tabs } from '@mui/material';

import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { setPanelAction } from '../actions/panelChangeActions';
import ClearStuckAlarmsDialog, { ClearStuckAlarmsDialogMode } from '../components/clearStuckAlarmsDialog';
import RefreshAlarmLogDialog, { RefreshAlarmLogDialogMode } from '../components/refreshAlarmLogDialog';
import RefreshCurrentAlarmsDialog, { RefreshCurrentAlarmsDialogMode } from '../components/refreshCurrentAlarmsDialog';
import { alarmLogEntriesReloadAction, createAlarmLogEntriesActions, createAlarmLogEntriesProperties } from '../handlers/alarmLogEntriesHandler';
import { createCurrentAlarmsActions, createCurrentAlarmsProperties, currentAlarmsReloadAction } from '../handlers/currentAlarmsHandler';
import { Fault, FaultAlarmNotification } from '../models/fault';
import { PanelId } from '../models/panelId';

type FaultApplicationComponentProps = RouteComponentProps;

const FaultTable = MaterialTable as MaterialTableCtorType<Fault>;
const FaultAlarmNotificationTable = MaterialTable as MaterialTableCtorType<FaultAlarmNotification>;

let currentAlarmsInitialSorted = false;
let alarmLogInitialSorted = false;

const FaultApplicationComponent: FC<FaultApplicationComponentProps> = () => {
  const panelId = useSelectApplicationState((state: IApplicationStoreState) => state.fault.currentOpenPanel);
  const currentAlarmsProperties = useSelectApplicationState((state: IApplicationStoreState) => createCurrentAlarmsProperties(state));
  const faultNotifications = useSelectApplicationState((state: IApplicationStoreState) => state.fault.faultNotifications);
  const alarmLogEntriesProperties = useSelectApplicationState((state: IApplicationStoreState) => createAlarmLogEntriesProperties(state));

  const dispatch = useApplicationDispatch();
  const currentAlarmsActions = createCurrentAlarmsActions(dispatch);
  const alarmLogEntriesActions = createAlarmLogEntriesActions(dispatch);
  const reloadCurrentAlarms = () => dispatch(currentAlarmsReloadAction);
  const reloadAlarmLogEntries = () => dispatch(alarmLogEntriesReloadAction);
  const switchActivePanel = (panel: PanelId) => dispatch(setPanelAction(panel));

  const [clearAlarmDialogMode, setClearAlarmDialogMode] = useState(ClearStuckAlarmsDialogMode.None);
  const [stuckAlarms, setStuckAlarms] = useState<string[]>([]);
  const [refreshAlarmLogEditorMode, setRefreshAlarmLogEditorMode] = useState(RefreshAlarmLogDialogMode.None);
  const [refreshCurrentAlarmsEditorMode, setRefreshCurrentAlarmsEditorMode] = useState(RefreshCurrentAlarmsDialogMode.None);
  const areFaultsAvailable = currentAlarmsProperties.rows && currentAlarmsProperties.rows.length > 0;

  const onToggleTabs = (activePanelId: PanelId) => {
    switchActivePanel(activePanelId);
    switch (activePanelId) {
      case 'CurrentAlarms':
        if (!currentAlarmsInitialSorted) {
          currentAlarmsInitialSorted = true;
          currentAlarmsActions.onHandleExplicitRequestSort('timestamp', 'desc');
        } else {
          reloadCurrentAlarms();
        }
        break;
      case 'AlarmLog':
        if (!alarmLogInitialSorted) {
          alarmLogInitialSorted = true;
          alarmLogEntriesActions.onHandleExplicitRequestSort('timestamp', 'desc');
        } else {
          reloadAlarmLogEntries();
        }
        break;
      case 'AlarmNotifications':
      case null:
      default:
        // nothing to do
        break;
    }
  };

  const onDialogClose = () => {
    setClearAlarmDialogMode(ClearStuckAlarmsDialogMode.None);
    setStuckAlarms([]);
  };

  const onDialogOpen = () => {
    const stuckAlarmsList = [...new Set(currentAlarmsProperties.rows.map(item => item.nodeId))];
    setStuckAlarms(stuckAlarmsList);
    setClearAlarmDialogMode(ClearStuckAlarmsDialogMode.Show);
  };

  const onHandleTabChange = (event: React.SyntheticEvent, newValue: PanelId) => {
    onToggleTabs(newValue);
  };

  const onCloseRefreshAlarmLogDialog = () => {
    setRefreshAlarmLogEditorMode(RefreshAlarmLogDialogMode.None);
  };

  const onCloseRefreshCurrentAlarmsDialog = () => {
    setRefreshCurrentAlarmsEditorMode(RefreshCurrentAlarmsDialogMode.None);
  };

  const clearAlarmsAction = {
    icon: Sync, tooltip: 'Clear stuck alarms', ariaLabel: 'clear-stuck-alarms', onClick: onDialogOpen,
  };

  const refreshCurrentAlarmsAction = {
    icon: Refresh, tooltip: 'Refresh Current Alarms List', ariaLabel: 'refresh', onClick: () => {
      setRefreshCurrentAlarmsEditorMode(RefreshCurrentAlarmsDialogMode.RefreshCurrentAlarmsTable);
    },
  };

  const refreshAlarmLogAction = {
    icon: Refresh, tooltip: 'Refresh Alarm log table', ariaLabel: 'refresh', onClick: () => {
      setRefreshAlarmLogEditorMode(RefreshAlarmLogDialogMode.RefreshAlarmLogTable);
    },
  };

  const customActions = areFaultsAvailable ? [clearAlarmsAction, refreshCurrentAlarmsAction] : [refreshCurrentAlarmsAction];

  useEffect(() => {
    if (panelId === null) { //set default tab if none is set
      onToggleTabs('CurrentAlarms');
    } else {
      onToggleTabs(panelId);
    }
  }, []);

  return (
    <>
      <AppBar enableColorOnDark position="static" >
        <Tabs indicatorColor="secondary" textColor="inherit" value={panelId} onChange={onHandleTabChange} aria-label="fault-tabs">
          <Tab aria-label="current-alarms-list-tab" label="Current Alarms" value="CurrentAlarms" />
          <Tab aria-label="alarm-notifications-list-tab" label={`Alarm Notifications (${faultNotifications.faults.length})`} value="AlarmNotifications" />
          <Tab aria-label="alarm-log-tab" label="Alarm Log" value="AlarmLog" />
        </Tabs>
      </AppBar>
      {
        panelId === 'CurrentAlarms' &&
        <>
          <FaultTable stickyHeader tableId="current-alarms-table" idProperty="id" customActionButtons={customActions} columns={[
            // { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
            { property: 'severity', title: 'Severity', type: ColumnType.text, width: '140px' },
            { property: 'timestamp', type: ColumnType.text, title: 'Timestamp' },
            { property: 'nodeId', title: 'Node Name', type: ColumnType.text },
            { property: 'counter', title: 'Count', type: ColumnType.numeric, width: '100px' },
            { property: 'objectId', title: 'Object Id', type: ColumnType.text },
            { property: 'problem', title: 'Alarm Type', type: ColumnType.text },
          ]} {...currentAlarmsProperties} {...currentAlarmsActions} />
          <RefreshCurrentAlarmsDialog
            mode={refreshCurrentAlarmsEditorMode}
            onClose={onCloseRefreshCurrentAlarmsDialog}
          />
        </>
      }
      {panelId === 'AlarmNotifications' &&

        <FaultAlarmNotificationTable stickyHeader tableId="alarm-notifications-table" idProperty="id" defaultSortColumn='timeStamp'
          defaultSortOrder='desc' rows={faultNotifications.faults} asynchronus columns={[
            // { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
            { property: 'severity', title: 'Severity', width: '140px', type: ColumnType.text },
            { property: 'timeStamp', title: 'Timestamp', type: ColumnType.text },
            { property: 'nodeName', title: 'Node Name', type: ColumnType.text },
            { property: 'counter', title: 'Count', width: '100px', type: ColumnType.numeric },
            { property: 'objectId', title: 'Object Id', type: ColumnType.text },
            { property: 'problem', title: 'Alarm Type', type: ColumnType.text },
          ]} />
      }
      {panelId === 'AlarmLog' &&
        <>
          <FaultTable stickyHeader idProperty={'id'} tableId="alarm-log-table" customActionButtons={[refreshAlarmLogAction]}
            columns={[
              // { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
              { property: 'severity', title: 'Severity', width: '140px' },
              { property: 'timestamp', title: 'Timestamp' },
              { property: 'nodeId', title: 'Node Name' },
              { property: 'counter', title: 'Count', type: ColumnType.numeric, width: '100px' },
              { property: 'objectId', title: 'Object Id' },
              { property: 'problem', title: 'Alarm Type' },
              { property: 'sourceType', title: 'Source', width: '140px' },
            ]} {...alarmLogEntriesProperties} {...alarmLogEntriesActions} />
          <RefreshAlarmLogDialog
            mode={refreshAlarmLogEditorMode}
            onClose={onCloseRefreshAlarmLogDialog}
          />
        </>
      }
      {
        clearAlarmDialogMode !== ClearStuckAlarmsDialogMode.None && <ClearStuckAlarmsDialog mode={clearAlarmDialogMode} numberDevices={stuckAlarms.length} stuckAlarms={stuckAlarms} onClose={onDialogClose} />
      }
    </>
  );
};

export const FaultApplication = withRouter(FaultApplicationComponent);
export default FaultApplication;
