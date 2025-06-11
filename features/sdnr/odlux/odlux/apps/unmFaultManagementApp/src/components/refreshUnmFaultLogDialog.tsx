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
import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { connect, Connect, IDispatcher } from '../../../../framework/src/flux/connect';
import { unmFaultLogEntriesReloadAction } from '../handlers/unmFaultLogEntriesHandler';
import { FaultLog } from '../models/unmFault';

export enum RefreshFaultLogDialogMode {
  None = 'none',
  RefreshFaultLogTable = 'RefreshFaultLogTable',
}

const mapDispatch = (dispatcher: IDispatcher) => ({
  refreshFaultLog: () => dispatcher.dispatch(unmFaultLogEntriesReloadAction),
});

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
  [RefreshFaultLogDialogMode.None]: {
    dialogTitle: '',
    dialogDescription: '',
    applyButtonText: '',
    cancelButtonText: '',
    enableMountIdEditor: false,
    enableUsernameEditor: false,
    enableExtendedEditor: false,
  },
  [RefreshFaultLogDialogMode.RefreshFaultLogTable]: {
    dialogTitle: 'Do you want to refresh the Fault Log?',
    dialogDescription: '',
    applyButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: true,
    enableUsernameEditor: true,
    enableExtendedEditor: true,
  },
};

type RefreshFaultLogDialogComponentProps = Connect<undefined, typeof mapDispatch> & {
  mode: RefreshFaultLogDialogMode;
  onClose: () => void;
};

type RefreshFaultLogDialogComponentState = FaultLog & { isNameValid: boolean; isHostSet: boolean };

class RefreshFaultLogDialogComponent extends React.Component<RefreshFaultLogDialogComponentProps, RefreshFaultLogDialogComponentState> {
  render(): JSX.Element {
    const setting = settings[this.props.mode];
    return (
      <Dialog open={this.props.mode !== RefreshFaultLogDialogMode.None}>
        <DialogTitle id="form-dialog-title" aria-label={`${setting.dialogTitle.replace(/ /g, '-').toLowerCase()}-dialog`}>{setting.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {setting.dialogDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button aria-label="dialog-confirm-button" onClick={() => {
            this.onRefresh();
          }} color="inherit" > {setting.applyButtonText} </Button>
          <Button aria-label="dialog-cancel-button" onClick={() => {
            this.onCancel();
          }} color="secondary"> {setting.cancelButtonText} </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private onRefresh = () => {
    this.props.refreshFaultLog();
    this.props.onClose();
  };

  private onCancel = () => {
    this.props.onClose();
  };
}

export const RefreshFaultLogDialog = connect(undefined, mapDispatch)(RefreshFaultLogDialogComponent);
export default RefreshFaultLogDialog;