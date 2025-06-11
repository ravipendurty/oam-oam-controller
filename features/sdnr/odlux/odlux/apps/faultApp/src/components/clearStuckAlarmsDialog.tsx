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
import React, { FC, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { clearStuckAlarmAsyncAction } from '../actions/clearStuckAlarmsAction';
import { currentAlarmsReloadAction } from '../handlers/currentAlarmsHandler';

export enum ClearStuckAlarmsDialogMode {
  None = 'none',
  Show = 'show',
}

type ClearStuckAlarmsProps = {
  numberDevices: number;
  mode: ClearStuckAlarmsDialogMode;
  stuckAlarms: string[];
  onClose: () => void;
};

const ClearStuckAlarmsDialogComponent: FC<ClearStuckAlarmsProps> = (props) => {
  const dispatch = useApplicationDispatch();
  const clearStuckAlarmsAsync = clearStuckAlarmAsyncAction(dispatch);
  const reloadCurrentAlarmsAction = () => dispatch(currentAlarmsReloadAction);

  const [clearAlarmsSuccessful, setClearAlarmsSuccessful] = useState(true);
  const [errormessage, setErrormessage] = useState('');
  const [unclearedAlarms, setUnclearedAlarms] = useState<string[]>([]);

  const onCloseDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    props.onClose();
  };

  const onRefresh = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const result = await clearStuckAlarmsAsync(props.stuckAlarms);

    if (result && result['devicemanager:output'].nodenames && result['devicemanager:output'].nodenames.length !== props.stuckAlarms.length) {
      const undeletedAlarm = props.stuckAlarms.filter(item => !result['devicemanager:output'].nodenames.includes(item));
      const error = 'The alarms of the following devices couldn\'t be refreshed: ';
      setClearAlarmsSuccessful(false);
      setErrormessage(error);
      setUnclearedAlarms(undeletedAlarm);
    } else {
      setClearAlarmsSuccessful(false);
      setErrormessage('Alarms couldn\'t be refreshed.');
      setUnclearedAlarms([]);
    }
    reloadCurrentAlarmsAction();
    props.onClose();
  };

  const onOk = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (unclearedAlarms.length > 0)
      reloadCurrentAlarmsAction();
    props.onClose();
  };

  const device = props.numberDevices > 1 ? 'devices' : 'device';
  const defaultMessage = `Are you sure you want to refresh all alarms for ${props.numberDevices} ${device}?`;
  const message = clearAlarmsSuccessful ? defaultMessage : errormessage;

  const defaultTitle = 'Refresh Confirmation';
  const title = clearAlarmsSuccessful ? defaultTitle : 'Refresh Result';

  return (
    <Dialog open={props.mode !== ClearStuckAlarmsDialogMode.None}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
        {unclearedAlarms.map(item =>
          <DialogContentText key={item}>
            {item}
          </DialogContentText>,
        )}
      </DialogContent>
      <DialogActions>
        {clearAlarmsSuccessful && (
          <>
            <Button color="inherit" onClick={onRefresh}>Yes</Button>
            <Button color="inherit" onClick={onCloseDialog}>No</Button>
          </>
        )}
        {!clearAlarmsSuccessful && <Button color="inherit" onClick={onOk}>Ok</Button>}
      </DialogActions>
    </Dialog>
  );
};

const ClearStuckAlarmsDialog = ClearStuckAlarmsDialogComponent;
export default ClearStuckAlarmsDialog;
