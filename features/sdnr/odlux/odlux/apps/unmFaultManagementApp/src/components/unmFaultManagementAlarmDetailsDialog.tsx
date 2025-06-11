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

import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { connect, Connect } from '../../../../framework/src/flux/connect';

import { FaultLog } from '../models/unmFault';

export enum ViewAlarmDetailsDialogMode {
  None = 'none',
  ViewAlarmDetails = 'viewDetails',
}

const mapDispatch = () => ({
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
  [ViewAlarmDetailsDialogMode.None]: {
    dialogTitle: '',
    dialogDescription: '',
    applyButtonText: '',
    cancelButtonText: '',
    enableMountIdEditor: false,
    enableUsernameEditor: false,
    enableExtendedEditor: false,
  },
  [ViewAlarmDetailsDialogMode.ViewAlarmDetails]: {
    dialogTitle: 'Alarm Details',
    dialogDescription: 'Details',
    applyButtonText: 'Save',
    cancelButtonText: 'Cancel',
    enableMountIdEditor: false,
    enableUsernameEditor: true,
    enableExtendedEditor: false,
  },
};

type ViewAlarmDetailsDialogComponentProps = Connect<undefined, typeof mapDispatch> & {
  initialAlarmDetails: FaultLog;
  mode: ViewAlarmDetailsDialogMode;
  onClose: () => void;
};

type ViewAlarmDetailsDialogComponentState = FaultLog & {
};

class UnmFaultManagementAlarmDetailsComponent extends React.Component<ViewAlarmDetailsDialogComponentProps, ViewAlarmDetailsDialogComponentState> {
  constructor(props: ViewAlarmDetailsDialogComponentProps) {
    super(props);
    this.state = {
      nodeId: this.props.initialAlarmDetails.nodeId,
      counter: this.props.initialAlarmDetails.counter,
      timestamp: this.props.initialAlarmDetails.timestamp,
      objectId: this.props.initialAlarmDetails.objectId,
      severity: this.props.initialAlarmDetails.severity,
      problem: this.props.initialAlarmDetails.problem,
      sourceType: this.props.initialAlarmDetails.sourceType,
    };
  }

  render(): JSX.Element {
    const setting = settings[this.props.mode];
    return (
      <Dialog open={this.props.mode !== ViewAlarmDetailsDialogMode.None}>
        <DialogTitle id="form-dialog-title" aria-label={`${setting.dialogTitle.replace(/ /g, '-').toLowerCase()}-dialog`}>{setting.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {setting.dialogDescription}
          </DialogContentText>
          <TextField variant="standard" disabled spellCheck={false} autoFocus margin="dense"
            id="nodeId" label="Node ID" aria-label="nodeId" type="text" fullWidth value={this.state.nodeId} />

          <TextField variant="standard" disabled spellCheck={false} margin="dense"
            id="objectId" label="Object Id" aria-label="objectId" type="text" fullWidth value={this.state.objectId} />

          <TextField variant="standard" disabled spellCheck={false} margin="dense"
            id="timestamp" label="Timestamp" aria-label="timestamp" type="text" fullWidth value={this.state.timestamp} />

          <TextField variant="standard" disabled spellCheck={false} autoFocus margin="dense"
            id="severity" label="Severity" aria-label="severity" type="text" fullWidth value={this.state.severity} />

          <TextField variant="standard" disabled spellCheck={false} margin="dense"
            id="problem" label="Problem" aria-label="problem" type="text" fullWidth value={this.state.problem} />

          <TextField variant="standard" disabled spellCheck={false} margin="dense"
            id="sourceType" label="Source Type" aria-label="sourceType" type="text" fullWidth value={this.state.sourceType} />

          <TextField variant="standard" spellCheck={false} margin="dense"
            id="comment" label="Comment" aria-label="comment" type="text" fullWidth value={this.state.comment}
            onChange={(event) => { this.setState({ comment: event.target.value }); }} />

        </DialogContent>
        <DialogActions>
          <Button aria-label="dialog-confirm-button" onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }} color="inherit" > {setting.applyButtonText} </Button>
          <Button aria-label="dialog-cancel-button" onClick={(event) => {
            this.onCancel();
            event.preventDefault();
            event.stopPropagation();
          }} color="secondary"> {setting.cancelButtonText} </Button>
        </DialogActions>
      </Dialog>
    );
  }

  public componentDidMount() {
  }


  private onApply = () => {
    if (this.props.onClose) this.props.onClose();

    switch (this.props.mode) {
      case ViewAlarmDetailsDialogMode.ViewAlarmDetails:
        break;
    }
  };

  private onCancel = () => {
    if (this.props.onClose) this.props.onClose();
  };

  static getDerivedStateFromProps(props: ViewAlarmDetailsDialogComponentProps, state: ViewAlarmDetailsDialogComponentState & { initialAlarmDetails: FaultLog }): ViewAlarmDetailsDialogComponentState & { initialAlarmDetails: FaultLog } {
    let returnState = state;
    if (props.initialAlarmDetails !== state.initialAlarmDetails) {
      returnState = {
        ...state,
        ...props.initialAlarmDetails,
        initialAlarmDetails: props.initialAlarmDetails,
      };
    }
    return returnState;
  }
}

export const ViewAlarmDetailsDialog = connect(undefined, mapDispatch)(UnmFaultManagementAlarmDetailsComponent);
export default ViewAlarmDetailsDialog;