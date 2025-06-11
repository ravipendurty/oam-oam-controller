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

import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Refresh from '@mui/icons-material/Refresh';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { Divider, MenuItem, Typography } from '@mui/material';

import MaterialTable, { ColumnType, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import EditMaintenanceEntryDialog, { EditMaintenanceEntryDialogMode } from '../components/editMaintenenceEntryDialog';
import RefreshMaintenanceEntriesDialog, { RefreshMaintenanceEntriesDialogMode } from '../components/refreshMaintenanceEntries';
import { createmaintenanceEntriesActions, createmaintenanceEntriesProperties, maintenanceEntriesReloadAction } from '../handlers/maintenanceEntriesHandler';
import { MaintenanceEntry } from '../models/maintenanceEntryType';
import { convertToLocaleString } from '../utils/timeUtils';

const MaintenanceEntriesTable = MaterialTable as MaterialTableCtorType<MaintenanceEntry>;

const emptyMaintenanceEntry: MaintenanceEntry = {
  mId: '',
  nodeId: '',
  description: '',
  start: convertToLocaleString(new Date().valueOf()),
  end: convertToLocaleString(new Date().valueOf()),
  active: false,
};

const MaintenanceView = () => {

  const maintenanceEntriesProperties = useSelectApplicationState((state: IApplicationStoreState) => createmaintenanceEntriesProperties(state));
  const dispatch = useApplicationDispatch();
  const maintenanceEntriesActions = createmaintenanceEntriesActions(dispatch);
  const onLoadMaintenanceEntries = async () => { await dispatch(maintenanceEntriesReloadAction); };

  let initialSorted = false;
  const [maintenanceEntryToEdit, setMaintenanceEntryToEdit] = useState(emptyMaintenanceEntry);
  const [maintenanceEntryEditorMode, setMaintenanceEntryEditorMode] = useState(EditMaintenanceEntryDialogMode.None);
  const [refreshMaintenanceEntriesEditorMode, setRefreshMaintenanceEntriesEditorMode] = useState(RefreshMaintenanceEntriesDialogMode.None);

  useEffect(() => {
    if (!initialSorted) {
      initialSorted = true;
      maintenanceEntriesActions.onHandleRequestSort('node-id');
    } else {
      onLoadMaintenanceEntries();
    }
  }, []);

  const getContextMenu = (rowData: MaintenanceEntry): JSX.Element[] => {
    return [
      <MenuItem aria-label={'1hr-from-now'} onClick={(event) => onOpenPlus1hEditMaintenanceEntryDialog(event, rowData)}><Typography>+1h</Typography></MenuItem>,
      <MenuItem aria-label={'8hr-from-now'} onClick={(event) => onOpenPlus8hEditMaintenanceEntryDialog(event, rowData)}><Typography>+8h</Typography></MenuItem>,
      <Divider />,
      <MenuItem aria-label={'edit'} onClick={(event) => onOpenEditMaintenanceEntryDialog(event, rowData)}><EditIcon /><Typography>Edit</Typography></MenuItem>,
      <MenuItem aria-label={'remove'} onClick={(event) => onOpenRemoveMaintenanceEntryDialog(event, rowData)}><RemoveIcon /><Typography>Remove</Typography></MenuItem>,
    ];
  };

  const addMaintenanceEntryAction = {
    icon: AddIcon, tooltip: 'Add', ariaLabel: 'add-element', onClick: () => {
      const startTime = (new Date().valueOf());
      const endTime = startTime;
      setMaintenanceEntryToEdit({
        ...emptyMaintenanceEntry,
        start: convertToLocaleString(startTime),
        end: convertToLocaleString(endTime),
      });
      setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.AddMaintenanceEntry);
    },
  };

  const refreshMaintenanceEntriesAction = {
    icon: Refresh, tooltip: 'Refresh Maintenance Entries', ariaLabel: 'refresh', onClick: () => {
      setRefreshMaintenanceEntriesEditorMode(RefreshMaintenanceEntriesDialogMode.RefreshMaintenanceEntriesTable);
    },
  };

  const onOpenPlus1hEditMaintenanceEntryDialog = (event: React.MouseEvent<HTMLElement>, entry: MaintenanceEntry) => {
    const startTime = (new Date().valueOf());
    const endTime = startTime + (1 * 60 * 60 * 1000);
    setMaintenanceEntryToEdit({
      ...entry,
      start: convertToLocaleString(startTime),
      end: convertToLocaleString(endTime),
    });
    setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.EditMaintenanceEntry);
  }

  const onOpenPlus8hEditMaintenanceEntryDialog = (event: React.MouseEvent<HTMLElement>, entry: MaintenanceEntry) => {
    const startTime = (new Date().valueOf());
    const endTime = startTime + (8 * 60 * 60 * 1000);
    setMaintenanceEntryToEdit({
      ...entry,
      start: convertToLocaleString(startTime),
      end: convertToLocaleString(endTime),
    });
    setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.EditMaintenanceEntry);
  }

  const onOpenEditMaintenanceEntryDialog = (event: React.MouseEvent<HTMLElement>, entry: MaintenanceEntry) => {
    const startTime = (new Date().valueOf());
    const endTime = startTime;
    setMaintenanceEntryToEdit({
      ...entry,
      ...(entry.start && endTime ? { start: convertToLocaleString(entry.start), end: convertToLocaleString(entry.end) } : { start: convertToLocaleString(startTime), end: convertToLocaleString(endTime) }),
    });
    setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.EditMaintenanceEntry);
  }

  const onOpenRemoveMaintenanceEntryDialog = (event: React.MouseEvent<HTMLElement>, entry: MaintenanceEntry) => {
    const startTime = (new Date().valueOf());
    const endTime = startTime;
    setMaintenanceEntryToEdit({
      ...entry,
      ...(entry.start && endTime ? { start: convertToLocaleString(entry.start), end: convertToLocaleString(entry.end) } : { start: convertToLocaleString(startTime), end: convertToLocaleString(endTime) }),
    });
    setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.RemoveMaintenanceEntry);
  }

  const onCloseEditMaintenanceEntryDialog = () => {
    setMaintenanceEntryToEdit(emptyMaintenanceEntry);
    setMaintenanceEntryEditorMode(EditMaintenanceEntryDialogMode.None);
  }

  const onCloseRefreshMaintenanceEntryDialog = () => {
    setRefreshMaintenanceEntriesEditorMode(RefreshMaintenanceEntriesDialogMode.None);
  }

  const now = new Date().valueOf();
  return (
    <>
      <MaintenanceEntriesTable stickyHeader tableId="maintenance-table" title={'Maintenance'} customActionButtons={[refreshMaintenanceEntriesAction, addMaintenanceEntryAction]} columns={
        [
          { property: 'nodeId', title: 'Node Name', type: ColumnType.text },
          {
            property: 'notifications', title: 'Notification', width: 50, align: 'center', type: ColumnType.custom, customControl: ({ rowData }) => (
              rowData.active && (Date.parse(rowData.start).valueOf() <= now) && (Date.parse(rowData.end).valueOf() >= now) && <FontAwesomeIcon icon={faBan} /> || null
            ),
          },
          { property: 'active', title: 'Activation State', type: ColumnType.boolean, labels: { 'true': 'active', 'false': 'not active' } },
          { property: 'start', title: 'Start Date (UTC)', type: ColumnType.text },
          { property: 'end', title: 'End Date (UTC)', type: ColumnType.text },
        ]
      } idProperty={'mId'}{...maintenanceEntriesActions} {...maintenanceEntriesProperties} asynchronus createContextMenu={rowData => {
        return getContextMenu(rowData);
      }} >
      </MaintenanceEntriesTable>
      <EditMaintenanceEntryDialog initialMaintenanceEntry={maintenanceEntryToEdit} mode={maintenanceEntryEditorMode}
        onClose={onCloseEditMaintenanceEntryDialog} />
      <RefreshMaintenanceEntriesDialog mode={refreshMaintenanceEntriesEditorMode}
        onClose={onCloseRefreshMaintenanceEntryDialog} />
    </>
  );
};

export default MaintenanceView;
