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
import React, { useEffect, useState } from 'react';

import Refresh from '@mui/icons-material/Refresh';
import { MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';

import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import RefreshEventLogDialog, { RefreshEventLogDialogMode } from '../components/refreshEventLogDialog';
import { createEventLogActions, createEventLogProperties } from '../handlers/eventLogHandler';
import { EventLogType } from '../models/eventLogType';

const EventLogTable = MaterialTable as MaterialTableCtorType<EventLogType & { _id: string }>;

const EventLog = () => {
  useSelectApplicationState((state: IApplicationStoreState) => state.eventLog.logEntries);
  const eventLogProperties = useSelectApplicationState((state: IApplicationStoreState) => createEventLogProperties(state));

  const dispatch = useApplicationDispatch();
  const eventLogActions = createEventLogActions(dispatch);

  const [refreshEventLogEditorMode, setRefreshEventLogEditorMode] = useState(RefreshEventLogDialogMode.None);
  let initalSorted = false;

  useEffect(() => {
    if (!initalSorted) {
      initalSorted = true;
      eventLogActions.onHandleExplicitRequestSort('timestamp', 'desc');
    } else {
      eventLogActions.onRefresh();
    }
  }, []);

  const refreshEventLogAction = {
    icon: Refresh, tooltip: 'Refresh Event log', ariaLabel: 'refresh', onClick: () => {
      setRefreshEventLogEditorMode(RefreshEventLogDialogMode.RefreshEventLogTable);
    },
  };

  const onCloseRefreshEventLogDialog = () => {
    setRefreshEventLogEditorMode(RefreshEventLogDialogMode.None);
  };

  return (
    <>
      <EventLogTable
        stickyHeader
        title="Event Log"
        tableId="event-log-table"
        idProperty="_id"
        customActionButtons={[refreshEventLogAction]}
        columns={[
          { property: 'nodeId', title: 'Node Name' },
          { property: 'counter', title: 'Counter' },
          { property: 'timestamp', title: 'Timestamp' },
          { property: 'objectId', title: 'Object ID' },
          { property: 'attributeName', title: 'Attribute Name' },
          { property: 'newValue', title: 'Message' },
          { property: 'sourceType', title: 'Source' },
        ]}
        {...eventLogActions}
        {...eventLogProperties}
      />
      <RefreshEventLogDialog
        mode={refreshEventLogEditorMode}
        onClose={onCloseRefreshEventLogDialog}
      />
    </>
  );
};
export default EventLog;