
/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2020 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';
import { InputProps } from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import MaterialTable, { ColumnType, MaterialTableCtorType } from '../../../../../framework/src/components/material-table';

import { AdaptiveModulationTable } from '../model/adaptiveModulationTable';
import { Modulation } from '../model/modulation';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';


type PropTypes = InputProps & {
  style?: React.CSSProperties;
  open: boolean;
  close(): void;
  row: AdaptiveModulationTable[];
  direction: string;
  selectedElement: string[];
  updateModulation(data: string[]): void;
};

const ModulationTable = MaterialTable as MaterialTableCtorType<AdaptiveModulationTable>;
const styles = makeStyles({
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'black',
  },
  closeButton: {
    marginTop: 20, position: 'absolute', top: '850px', right: '50px',
  },
  applyButton: {
    marginTop: 20, position: 'absolute', top: '850px', right: '160px',
  },
});

export const AdaptiveModulationDialog: FC<PropTypes> = ({ open, row, close, direction, selectedElement, updateModulation }) => {
  const [selectedElements, setSelectedElements] = useState<string[]>(selectedElement);
  const classes = styles();

  const onChange = (element: any) => {
    const data: { modulation: string; parameters: Modulation | null } = { modulation: element.target.value, parameters: null };
    setSelectedElements([element.target.value]);

    if (selectedElements.includes(data.modulation)) {

      setSelectedElements(selectedElements.filter((i) => i !== data.modulation));

    } else {
      var newData = [...selectedElements, data.modulation];
      setSelectedElements(newData);

    }
  };

  const onClose = () => {
    close();
  };

  const onSave = () => {
    updateModulation(selectedElements);
    close();
  };
  useEffect(() => {
    setSelectedElements(selectedElement);
  }, []);

  return (
    <div>
      <Dialog onClose={() => onClose()} open={open} fullWidth maxWidth={'lg'} >
        <DialogContent>
          <DialogContentText>
            Adaptive Modulation
          </DialogContentText>
          <DialogTitle>{direction}</DialogTitle>

          <DialogActions>
            <IconButton
              aria-label="close"
              className={classes.closeIcon}
              onClick={() => onClose()}
              size="large">
              <CloseIcon />
            </IconButton>

          </DialogActions>

          {row !== null ?
            <><ModulationTable allowHtmlHeader stickyHeader idProperty="modulation" tableId={`adaptive-modulation-${direction}`} title='Select adaptive modulations'
              defaultSortColumn='modulation' defaultSortOrder='desc' rows={row}
              columns={[
                { property: 'modulation', title: 'Supported Modulation', type: ColumnType.text, width: '20px' },
                {
                  property: 'enabledModulation', type: ColumnType.custom, title: 'Enabled Modulation',
                  customControl: ({ rowData }) => (<Checkbox color="secondary" checked={selectedElements.includes(rowData.modulation)}
                    value={rowData.modulation} onClick={(e) => onChange(e)} />),
                },
                { property: 'dataRate', title: 'Data Rate (Mbit/s)', type: ColumnType.numeric },
                { property: 'receiverThresholdBER-3', title: 'Thrs BER 10<sup>-3</sup> (dBm)', type: ColumnType.numeric },
                { property: 'receiverThresholdBER-6', title: 'Thrs BER 10<sup>-6</sup> (dBm)', type: ColumnType.numeric },
                { property: 'receivedSignalLevel', title: 'RSL (dBm)', type: ColumnType.numeric },
                { property: 'linkMarginBER-3', title: 'Margin (dB)\n BER 10<sup>-3</sup>', type: ColumnType.numeric },
                { property: 'linkMarginBER-6', title: 'Margin (dB)\n BER 10<sup>-6</sup>', type: ColumnType.numeric },
                { property: 'txPowerMin', title: 'txPower\nMin(dBm)', type: ColumnType.numeric },
                { property: 'txPowerMax', title: 'txPower\nMax(dBm)', type: ColumnType.numeric },
                { property: 'rainAvailabilityBER-3', title: 'Rain Availability\n BER10<sup>-3</sup>', type: ColumnType.numeric },
                { property: 'rainAvailabilityBER-6', title: 'Rain Availability\n BER10<sup>-6</sup>', type: ColumnType.numeric },
                { property: 'multipathAvailabilityBER-3', title: 'multipath Fading\n BER10<sup>-3</sup>', type: ColumnType.numeric },
                { property: 'multipathAvailabilityBER-6', title: 'multipath Fading\n BER10<sup>-6</sup>', type: ColumnType.numeric },
              ]} />        
              <Box>
                <Button variant="contained" color="primary" onClick={() => onClose()} className={classes.closeButton}>
                  CANCEL
                </Button>
                <Button variant="contained" color="primary" onClick={() => onSave()} className={classes.applyButton}>
                  SAVE
                </Button>
              </Box>
            </>
            : null
          }
        </DialogContent>
      </Dialog>
    </div >
  );
};
export default AdaptiveModulationDialog;
