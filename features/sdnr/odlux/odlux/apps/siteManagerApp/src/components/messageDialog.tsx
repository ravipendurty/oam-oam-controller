/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

type MessageDialogComponentProps = {
  dialogMessage: string;
  isFromSearch: boolean;
  onClose: (event: React.SyntheticEvent, isFromSearch: boolean) => void;
  openDialog: boolean;
  setOpenDialog: any;
};

export const MessageDialog = (props: MessageDialogComponentProps) => {
  const handleDialogClose = (event: React.SyntheticEvent) => {
    props.setOpenDialog(false);
    props.onClose(event, props.isFromSearch);
  };

  return (
    <Dialog open={props.openDialog} onClose={handleDialogClose}>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Server Error: {props.dialogMessage}
        </DialogContentText>
        <Button style={{ marginTop: '20px' }} variant='contained' color='primary'
          onClick={handleDialogClose}>Ok</Button>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};
