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

import Refresh from '@mui/icons-material/Refresh';
import { MenuItem, Typography } from '@mui/material';

import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { connect, Connect, IDispatcher } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import RefreshFaultLogDialog, { RefreshFaultLogDialogMode } from '../components/refreshUnmFaultLogDialog';
import ViewAlarmDetailsDialog, { ViewAlarmDetailsDialogMode } from '../components/unmFaultManagementAlarmDetailsDialog';
import { createUnmFaultLogEntriesActions, createUnmFaultLogEntriesProperties } from '../handlers/unmFaultLogEntriesHandler';
import { FaultLog } from '../models/unmFault';

const mapProps = (state: IApplicationStoreState) => ({
  unmFaultLogEntriesProperties: createUnmFaultLogEntriesProperties(state),
});

const mapDispatch = (dispatcher: IDispatcher) => ({
  unmFaultLogEntriesActions: createUnmFaultLogEntriesActions(dispatcher.dispatch),
});

type UnmFaultManagementApplicationComponentProps = Connect<typeof mapProps, typeof mapDispatch>;

type UnmFaultManagementApplicationState = {
  alarmToEdit: FaultLog;
  refreshFaultLogEditorMode: RefreshFaultLogDialogMode;
  viewAlarmDetailsMode: ViewAlarmDetailsDialogMode;
};

const emptyAlarmElement: FaultLog =
{
  id: '',
  nodeId: '',
  counter: 0,
  timestamp: { value: '' },
  objectId: '',
  severity: null,
  problem: '',
  sourceType: '',
};

const FaultLogTable = MaterialTable as MaterialTableCtorType<any>;

class UnmFaultManagementFaultLogComponent extends React.Component<UnmFaultManagementApplicationComponentProps, UnmFaultManagementApplicationState> {
  constructor(props: UnmFaultManagementApplicationComponentProps) {
    super(props);
    this.state = {
      alarmToEdit: emptyAlarmElement,
      refreshFaultLogEditorMode: RefreshFaultLogDialogMode.None,
      viewAlarmDetailsMode: ViewAlarmDetailsDialogMode.None,
    };
  }

  getContextMenu(rowData: FaultLog): JSX.Element[] {
    const buttonArray = [
      <MenuItem aria-label={'alarm-details-button'} onClick={event => this.onOpenViewAlarmDetailsDialog(event, rowData)}><Typography>View Details</Typography></MenuItem>,
    ];
    return buttonArray;
  }


  render(): JSX.Element {
    const refreshFaultLogAction = {
      icon: Refresh, tooltip: 'Refresh Fault log table', ariaLabel: 'refresh', onClick: () => {
        this.setState({
          refreshFaultLogEditorMode: RefreshFaultLogDialogMode.RefreshFaultLogTable,
        });
      },
    };

    return (
      <>
        <FaultLogTable stickyHeader idProperty={'id'} tableId="alarm-log-table" customActionButtons={[refreshFaultLogAction]}
          columns={[
            { property: 'severity', title: 'Severity', width: '140px' },
            {
              property: 'timestamp', title: 'Timestamp', type: ColumnType.custom, customControl: ({ rowData }) => {
                return (
                  rowData.timestamp.value
                );
              },
            },
            { property: 'nodeId', title: 'Node Name' },
            { property: 'objectId', title: 'Object Id' },
            { property: 'problem', title: 'Problem' },
            { property: 'sourceType', title: 'Source', width: '140px' },
          ]} {...this.props.unmFaultLogEntriesProperties} {...this.props.unmFaultLogEntriesActions} createContextMenu={rowData => {
            return this.getContextMenu(rowData);
          }} />
        <RefreshFaultLogDialog
          mode={this.state.refreshFaultLogEditorMode}
          onClose={this.onCloseRefreshFaultLogDialog}
        />
        <ViewAlarmDetailsDialog
          initialAlarmDetails={this.state.alarmToEdit}
          mode={this.state.viewAlarmDetailsMode}
          onClose={this.onCloseViewAlarmDetailsDialog}

        />
      </>
    );
  }

  private onCloseRefreshFaultLogDialog = () => {
    this.setState({
      refreshFaultLogEditorMode: RefreshFaultLogDialogMode.None,
    });
  };

  private onOpenViewAlarmDetailsDialog = (event: React.MouseEvent<HTMLElement>, element: FaultLog) => {
    this.setState({
      alarmToEdit: {
        nodeId: element.nodeId,
        counter: element.counter,
        timestamp: element.timestamp,
        objectId: element.objectId,
        severity: element.severity,
        problem: element.problem,
        sourceType: element.sourceType,
      },
      viewAlarmDetailsMode: ViewAlarmDetailsDialogMode.ViewAlarmDetails,
    });
  };

  private onCloseViewAlarmDetailsDialog = () => {
    this.setState({
      viewAlarmDetailsMode: ViewAlarmDetailsDialogMode.None,
    });
  };
}

export const UnmFaultManagementFaultLog = connect(mapProps, mapDispatch)(UnmFaultManagementFaultLogComponent);
export default UnmFaultManagementFaultLog;
