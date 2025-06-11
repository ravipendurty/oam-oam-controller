
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

import React, { useEffect, FC } from 'react';

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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';

import MaterialTable, { ColumnType, MaterialTableCtorType } from '../../../../../framework/src/components/material-table';
import { ChannelTable } from '../model/bandPlan';
import { TextFieldwithAdornment } from './textFieldwithAdornment';
import ConnectionInfo from './connectionInfo';


type PropTypes = InputProps & {
  style?: React.CSSProperties;
  linkId: number;
  open: boolean;
  close(): void;
  row: ChannelTable[];
  updatechannels(data: ChannelTable[], totalBandwidthMHz: number): void;
  frequencyPlanSiteA: 'HIGH' | 'LOW';
  frequencyPlanSiteB: 'HIGH' | 'LOW';
  band: number;
  selectedElementProp: ChannelTable[];
};

const ChannelSelectTable = MaterialTable as MaterialTableCtorType<ChannelTable>;
const styles = makeStyles({
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'black',
  },
  closeButton: {
    marginTop: 10, position: 'absolute', top: '750px', right: '50px',
  },
  applyButton: {
    marginTop: 10, position: 'absolute', top: '750px', right: '160px',
  },
  tables: {
    height: '700px',
  },
  dialogContent: {
    height: '900px',
  },
  summary: {
    position: 'absolute', right: '160px',
  },
  error: {
    height: '200px',
  },
});

export const ChannelListDialog: FC<PropTypes> = ({ open, row, close, updatechannels, linkId, band, frequencyPlanSiteA, frequencyPlanSiteB, selectedElementProp }) => {

  const [polarizationAlert, setPolarizationAlert] = React.useState(false);
  const [selectedElements, setSelectedElements] = React.useState<ChannelTable[]>(selectedElementProp);
  const [totalBandwidthMHz, setTotalBandwidthMHz] = React.useState<number>(0);

  const classes = styles();

  const onChange = (tableRow: ChannelTable, checked: boolean) => {

    if (checked) {
      setSelectedElements(selectedElements.filter((x) => x.name !== tableRow.name));
      if (tableRow.polarization.length !== 0) {
        if (tableRow.polarization === 'XPOL') {
          setTotalBandwidthMHz(totalBandwidthMHz - 2 * tableRow.bandwidthMHz);
        } else setTotalBandwidthMHz(totalBandwidthMHz -  tableRow.bandwidthMHz);
      }
  

    } else {
      tableRow.polarization = '';
      setSelectedElements([...selectedElements, tableRow]);
      // setTotalBandwidthMHz(totalBandwidthMHz + tableRow.bandwidthMHz);
    }
  };

  const onClose = () => {
    close();
  };

  const onSave = () => {
    let checker = false;
    selectedElements.forEach(channel => {
      if (channel.polarization === '') {
        checker = true;
        setPolarizationAlert(true);
      }
    });
    if (!checker) {
      setPolarizationAlert(false);
      updatechannels(selectedElements, totalBandwidthMHz);
      close();
    }
  };


  const setChannelPolarization = (tableRow: ChannelTable, polarization: 'HORIZONTAL' | 'VERTICAL' | 'XPOL' | '') => {
   
    if (tableRow.polarization === 'HORIZONTAL' || tableRow.polarization === 'VERTICAL') {
      if (polarization === 'XPOL') {
        setTotalBandwidthMHz(totalBandwidthMHz +  tableRow.bandwidthMHz);
      } else setTotalBandwidthMHz(totalBandwidthMHz);
    } else if (tableRow.polarization === '') {
      if (polarization === 'XPOL') {
        setTotalBandwidthMHz(totalBandwidthMHz + 2 * tableRow.bandwidthMHz);
      } else {
        setTotalBandwidthMHz(totalBandwidthMHz + tableRow.bandwidthMHz);
      }
    } else if (polarization === 'XPOL') {
      setTotalBandwidthMHz(totalBandwidthMHz );
    } else {
      debugger;
      setTotalBandwidthMHz(totalBandwidthMHz - tableRow.bandwidthMHz);
    }
   
    
    tableRow.polarization = polarization;
    setSelectedElements(selectedElements.map(x => {
      if (x.keyId === tableRow.keyId) {
        return tableRow;
      } else return x;
    }));
  };

  useEffect(() => {
    let bandwidthList: number[] = [];
    row.forEach(x => {
      selectedElementProp.forEach(tableRow => {
        if (tableRow.keyId === x.keyId) {
          if (tableRow.polarization === 'XPOL') {
            bandwidthList.push(2 * x.bandwidthMHz);
          } else bandwidthList.push(x.bandwidthMHz);
        }
      });
    });
    row.map(eachRow => {
      selectedElements.forEach(selectedRow => {
        if (eachRow.keyId === selectedRow.keyId) {
          eachRow.polarization = selectedRow.polarization;
        }
      });
    });
    setTotalBandwidthMHz(bandwidthList.reduce((partialSum, a) => partialSum + a, 0));
  }, []);



  return (
    <>
      <Dialog onClose={() => onClose()} open={open} fullWidth maxWidth={'lg'} >
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            Channel
          </DialogContentText>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <DialogTitle>Channel Select for link : {linkId}</DialogTitle>
            <Stack className={classes.summary}>
              <TextField
                variant="standard"
                aria-label="site-b-channel"
                label="Channel"
                error={false}
                disabled
                value={selectedElements.map(x => x.name)}
              />
              <TextFieldwithAdornment
                label="Total Bandwidth"
                errorText=" "
                andornmentUnit="MHz"
                error={false}
                disabled
                value={totalBandwidthMHz}
              />
            </Stack>
          </div>


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
            <>
              <Stack className={classes.tables}>

                <ChannelSelectTable allowHtmlHeader stickyHeader idProperty="name" tableId={`channel-list-${linkId}`} title={'Channels (' + band + ' GHz)'}
                  defaultSortColumn='name' defaultSortOrder='desc' rows={row}
                  columns={[
                    { property: 'name', title: 'Channel', type: ColumnType.text, width: 5 },
                    {
                      property: 'enabledChannel', type: ColumnType.custom, title: 'Select Channel',
                      customControl: ({ rowData }) => (<Checkbox color="secondary" checked={selectedElements.filter(i => i.name === rowData.name).length > 0}
                        value={rowData.name} onClick={() => onChange(rowData, selectedElements.filter(i => i.name === rowData.name).length > 0)} />), width: 8,
                    },
                    { property: 'bandwidthMHz', title: 'Bandwidth (MHz)', type: ColumnType.numeric, width: 3 },
                    { property: 'centerFrequencyHigh', title: 'Frequency ' + frequencyPlanSiteA + '(MHz)', type: ColumnType.numeric, width: 3 },
                    { property: 'centerFrequencyLow', title: 'Frequency ' + frequencyPlanSiteB + '(MHz)', type: ColumnType.numeric, width: 3 },
                    {
                      property: 'polarization', type: ColumnType.custom, title: 'Polarization', customControl: ({ rowData }) => (
                        <Stack>
                          <FormControl>
                            <Select variant="standard" value={rowData.polarization}
                              onChange={(e) => { setChannelPolarization(rowData, e.target.value as 'HORIZONTAL' | 'VERTICAL' | 'XPOL' | ''); }}
                              defaultValue={''}
                              disabled={selectedElements.filter(i => i.name === rowData.name).length === 0}
                              fullWidth
                              error={selectedElements.filter(i => i.name === rowData.name).length > 0 && rowData.polarization.length === 0} >
                              <MenuItem value={''} ></MenuItem>
                              <MenuItem value={'HORIZONTAL'} >HORIZONTAL</MenuItem>
                              <MenuItem value={'VERTICAL'} >VERTICAL</MenuItem>
                              <MenuItem value={'XPOL'} >XPOL</MenuItem>
                            </Select>
                            {selectedElements.filter(i => i.name === rowData.name).length > 0 && rowData.polarization.length === 0 && <FormHelperText error>  *Required </FormHelperText>}
                          </FormControl>
                        </Stack>
                      ),
                    },
                    { property: 'availability', title: 'Availability', type: ColumnType.text, width: 3 },
                    { property: 'xPolCondition', title: 'XPol', type: ColumnType.text, width: 3 },
                  ]} />

              </Stack>
              <Box>
                <Button variant="contained" color="primary" onClick={() => onClose()} className={classes.closeButton}>
                  CANCEL
                </Button>
                <Button variant="contained" color="primary" onClick={() => onSave()} className={classes.applyButton} >
                  SAVE
                </Button>
              </Box>
            </>

            : null

          }
        </DialogContent>

      </Dialog>
      
        {
          polarizationAlert &&
          <Stack>
            <Dialog fullWidth maxWidth={'lg'} open={polarizationAlert} >
              <DialogContent className={classes.error}>

                <DialogActions>
                  <IconButton
                    aria-label="close"
                    className={classes.closeIcon}
                    onClick={() => setPolarizationAlert(false)}
                    size="large">
                    <CloseIcon />
                  </IconButton>
                </DialogActions>

                <ConnectionInfo
                  messageType={'Saving Error'}
                  message={'Select a polarization'}
                  reachable={!polarizationAlert}
                />

              </DialogContent>
            </Dialog>
          </Stack>
        }
      



    </>
  );
};
export default ChannelListDialog;
