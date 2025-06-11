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

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { currentAlarmsReloadAction } from '../handlers/currentAlarmsHandler';

export enum RefreshCurrentAlarmsDialogMode {
  None = 'none',
  RefreshCurrentAlarmsTable = 'RefreshCurrentAlarmsTable',
}

type DialogSettings = {
  dialogTitle: string;
  dialogDescription: string;
  applyButtonText: string;
  cancelButtonText: string;
  enableMountIdEditor: boolean;
  enableUsernameEditor: boolean;
  enableExtendedEditor: boolean;
};

const settings: { [key: string]: DialogSettings } = {
  [RefreshCurrentAlarmsDialogMode.None]: {
    dialogTitle: '',
    dialogDescription: '',
    applyButtonText: '',
    cancelButtonText: '',
    enableMountIdEditor: false,
    enableUsernameEditor: false,
    enableExtendedEditor: false,
  },
  [RefreshCurrentAlarmsDialogMode.RefreshCurrentAlarmsTable]: {
    dialogTitle: 'Do you want to refresh the Current Alarms List?',
    dialogDescription: '',
    applyButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: true,
    enableUsernameEditor: true,
    enableExtendedEditor: true,
  },
};

type RefreshCurrentAlarmsDialogComponentProps = {
  mode: RefreshCurrentAlarmsDialogMode;
  onClose: () => void;
};

const RefreshCurrentAlarmsDialogComponent: React.FC<RefreshCurrentAlarmsDialogComponentProps> = (props) => {
  const dispatch = useApplicationDispatch();
  const refreshCurrentAlarms = () => dispatch(currentAlarmsReloadAction);
  const setting = settings[props.mode];

  const onRefresh = () => {
    refreshCurrentAlarms();
    props.onClose();
  };

  const onCancel = () => {
    props.onClose();
  };

  return (
    <Dialog open={props.mode !== RefreshCurrentAlarmsDialogMode.None}>
      <DialogTitle id="form-dialog-title" aria-label={`${setting.dialogTitle.replace(/ /g, '-').toLowerCase()}-dialog`}>
        {setting.dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {setting.dialogDescription}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button aria-label="dialog-confirm-button" onClick={onRefresh} color="inherit">
          {setting.applyButtonText}
        </Button>
        <Button aria-label="dialog-cancel-button" onClick={onCancel} color="secondary">
          {setting.cancelButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RefreshCurrentAlarmsDialog = RefreshCurrentAlarmsDialogComponent;
export default RefreshCurrentAlarmsDialog;
