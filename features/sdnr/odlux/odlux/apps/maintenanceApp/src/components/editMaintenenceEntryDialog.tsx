/* eslint-disable @typescript-eslint/no-unused-expressions */
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

import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { addMaintenenceEntryAsyncActionCreator, removeFromMaintenenceEntrysAsyncActionCreator, updateMaintenenceEntryAsyncActionCreator } from '../actions/maintenenceActions';
import { MaintenanceEntry } from '../models/maintenanceEntryType';

export enum EditMaintenanceEntryDialogMode {
  None = 'none',
  AddMaintenanceEntry = 'addMaintenanceEntry',
  EditMaintenanceEntry = 'editMaintenanceEntry',
  RemoveMaintenanceEntry = 'removeMaintenanceEntry',
}


type DialogSettings = {
  dialogTitle: string;
  dialogDescription: string;
  applyButtonText: string;
  cancelButtonText: string;
  enableMountIdEditor: boolean;
  enableTimeEditor: boolean;
};

const settings: { [key: string]: DialogSettings } = {
  [EditMaintenanceEntryDialogMode.None]: {
    dialogTitle: '',
    dialogDescription: '',
    applyButtonText: '',
    cancelButtonText: '',
    enableMountIdEditor: false,
    enableTimeEditor: false,
  },
  [EditMaintenanceEntryDialogMode.AddMaintenanceEntry]: {
    dialogTitle: 'Add new maintenance entry',
    dialogDescription: '',
    applyButtonText: 'Add',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: true,
    enableTimeEditor: true,
  },
  [EditMaintenanceEntryDialogMode.EditMaintenanceEntry]: {
    dialogTitle: 'Edit maintenance entry',
    dialogDescription: '',
    applyButtonText: 'Save',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: false,
    enableTimeEditor: true,
  },
  [EditMaintenanceEntryDialogMode.RemoveMaintenanceEntry]: {
    dialogTitle: 'Remove maintenance entry',
    dialogDescription: '',
    applyButtonText: 'Remove',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: false,
    enableTimeEditor: false,
  },
};

type EditMaintenanceEntryDIalogComponentProps = {
  mode: EditMaintenanceEntryDialogMode;
  initialMaintenanceEntry: MaintenanceEntry;
  onClose: () => void;
};


const EditMaintenanceEntryDIalogComponent: FC<EditMaintenanceEntryDIalogComponentProps> = (props) => {

  const dispatch = useApplicationDispatch();
  const addMaintenanceEntry = (entry: MaintenanceEntry) => {
    dispatch(addMaintenenceEntryAsyncActionCreator(entry));
  };
  const updateMaintenanceEntry = (entry: MaintenanceEntry) => {
    dispatch(updateMaintenenceEntryAsyncActionCreator(entry));
  };
  const removeMaintenanceEntry = (entry: MaintenanceEntry) => {
    dispatch(removeFromMaintenenceEntrysAsyncActionCreator(entry));
  };

  const [maintenanceEntry, setMaintenanceEntry] = useState<MaintenanceEntry>({ ...props.initialMaintenanceEntry });
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const setting = settings[props.mode];


  const onApply = (entry: MaintenanceEntry) => {
    props.onClose && props.onClose();
    switch (props.mode) {
      case EditMaintenanceEntryDialogMode.AddMaintenanceEntry:
        entry && addMaintenanceEntry(entry);
        break;
      case EditMaintenanceEntryDialogMode.EditMaintenanceEntry:
        entry && updateMaintenanceEntry(entry);
        break;
      case EditMaintenanceEntryDialogMode.RemoveMaintenanceEntry:
        entry && removeMaintenanceEntry(entry);
        break;
    }
  };

  const onCancel = () => {
    props.onClose && props.onClose();
  };

  useEffect(() => {
    setMaintenanceEntry(props.initialMaintenanceEntry);
  }, [props.initialMaintenanceEntry]);

  return (
    <Dialog open={props.mode !== EditMaintenanceEntryDialogMode.None}>
      <DialogTitle id="form-dialog-title">{setting.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {setting.dialogDescription}
        </DialogContentText>
        <TextField variant="standard" disabled={!setting.enableMountIdEditor} spellCheck={false} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth value={maintenanceEntry.nodeId} onChange={(event) => { setMaintenanceEntry({ ...maintenanceEntry, nodeId: event.target.value }); }} />
        {isErrorVisible && <Typography variant="body1" color="error" >Name must not be empty.</Typography>}
        <TextField variant="standard" disabled={!setting.enableTimeEditor} spellCheck={false} autoFocus margin="dense" id="start"
          label="Start (Local DateTime)" type="datetime-local" fullWidth value={maintenanceEntry.start} onChange={(event) => { setMaintenanceEntry({ ...maintenanceEntry, start: event.target.value }) }} />
        <TextField variant="standard" disabled={!setting.enableTimeEditor} spellCheck={false} autoFocus margin="dense" id="end"
          label="End (Local DateTime)" type="datetime-local" fullWidth value={maintenanceEntry.end} onChange={(event) => { setMaintenanceEntry({ ...maintenanceEntry, end: event.target.value }) }} />
        <FormControl variant="standard" fullWidth disabled={!setting.enableTimeEditor}>
          <InputLabel htmlFor="active">Active</InputLabel>
          <Select variant="standard" value={maintenanceEntry.active || false} onChange={(event) => {
            setMaintenanceEntry({ ...maintenanceEntry, active: event.target.value as any as boolean })
          }} inputProps={{ name: 'active', id: 'active' }} fullWidth >
            <MenuItem value={true as any as string}>active</MenuItem>
            <MenuItem value={false as any as string}>not active</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={(event) => {
          if (props.mode === EditMaintenanceEntryDialogMode.AddMaintenanceEntry && maintenanceEntry.nodeId.trim().length === 0) {
            setIsErrorVisible(true);
          } else {
            onApply({
              mId: maintenanceEntry.mId || maintenanceEntry.nodeId,
              nodeId: maintenanceEntry.nodeId,
              description: maintenanceEntry.description,
              start: maintenanceEntry.start,
              end: maintenanceEntry.end,
              active: maintenanceEntry.active,
            });
            setIsErrorVisible(false);
          }
          event.preventDefault();
          event.stopPropagation();
        }} color="inherit" > {setting.applyButtonText} </Button>
        <Button onClick={(event) => {
          onCancel();
          event.preventDefault();
          event.stopPropagation();
          setIsErrorVisible(false);
        }} color="secondary"> {setting.cancelButtonText} </Button>
      </DialogActions>
    </Dialog>
  );
}

export const EditMaintenanceEntryDIalog = EditMaintenanceEntryDIalogComponent;
export default EditMaintenanceEntryDIalog;