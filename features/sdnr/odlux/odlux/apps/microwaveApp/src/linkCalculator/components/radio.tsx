
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
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';



import { adaptiveModulationInputCreator, UpdateAdaptiveModulationProcessing } from '../../linkCalculator/actions/adaptiveModulationAction';
import { radioMandatoryParametersAction, UpdateEnabeldAdaptiveModulations, UpdateModulationAction, updateRadioAttributes, UpdateModulationParametersAction, UpdateTxPowerAction } from '../actions/radioActions';
import { Modulation } from '../model/modulation';
import AdaptiveModulationDialog from './adaptiveModulationDialog';
import { Radio } from '../model/radio';
import { isNumber } from '../utils/math';
import { TextFieldwithAdornment } from './textFieldwithAdornment';
import ConnectionInfo from './connectionInfo';
import CircularProgress from '@mui/material/CircularProgress';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';








 




const styles = makeStyles({
  modulationControl: { width: '230px' },
  adaptiveModulationButton: { paddingTop: '10px', width: '250px' },
  radioResultBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around' },
  loading: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999,
  },
  pasperStyle: {
    padding: 5, width: 230, position: 'absolute', top: '40%', left: '40%',
  },
  componentDiv: {
    'alignSelf': 'center', marginBottom: 5,
  },
  wrappingDiv: {
    display: 'flex', flexDirection: 'column',
  },
  closeIcon: {
    marginTop: 20, top: '-75px', right: '-40px',
  },
  container: {
    display: 'flex', flexDirection: 'column', width: 'column',
  },
  component: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  textField: {
    width: '85%',
  },
  column: {
    width: '220px',
  },
});

const RadioView: FC = (() => {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [adaptiveModulationSite, setAdaptiveModulationSite] = useState('');
  const classes = styles();
  const radioNameList = useSelectApplicationState(state => state.microwave.radio.radioNameList);
  const rxPowerA = useSelectApplicationState(state =>  state.microwave.radio.rxPowerA);
  const rxPowerB = useSelectApplicationState(state =>  state.microwave.radio.rxPowerB);
  const systemOperatingMarginA = useSelectApplicationState(state =>  state.microwave.radio.systemOperatingMarginA);
  const systemOperatingMarginB = useSelectApplicationState(state =>  state.microwave.radio.systemOperatingMarginB);
  const radioModelA = useSelectApplicationState(state =>  state.microwave.radio.radioNameA);
  const radioModelB = useSelectApplicationState(state =>  state.microwave.radio.radioNameB);
  const radioTxPowerA = useSelectApplicationState(state =>  state.microwave.radio.txPowerA);
  const radioTxPowerB = useSelectApplicationState(state =>  state.microwave.radio.txPowerB);
  const radioParameters = useSelectApplicationState(state =>  state.microwave.radio.radioParameters);
  const radioBandwidthA = useSelectApplicationState(state =>  state.microwave.radio.radioBandwidthA);
  const radioBandwidthB = useSelectApplicationState(state =>  state.microwave.radio.radioBandwidthB);
  const modulationListA = useSelectApplicationState(state =>  state.microwave.radio.modulationListA);
  const modulationListB = useSelectApplicationState(state =>  state.microwave.radio.modulationListB);
  const radioModulationA = useSelectApplicationState(state =>  state.microwave.radio.modulationA);
  const radioModulationB = useSelectApplicationState(state =>  state.microwave.radio.modulationB);
  const modulationParametersA = useSelectApplicationState(state =>  state.microwave.radio.modulationParametersA);
  const modulationParametersB = useSelectApplicationState(state =>  state.microwave.radio.modulationParametersB);
  const adaptiveModulationTableBtoA = useSelectApplicationState(state =>  state.microwave.radio.adaptiveModulationTableBtoA);
  const adaptiveModulationTableAtoB = useSelectApplicationState(state =>  state.microwave.radio.adaptiveModulationTableAtoB);
  const enabledAdaptiveModulations = useSelectApplicationState(state =>  state.microwave.radio.enabledAdaptiveModulations);
  const rxThresholdBER3A = useSelectApplicationState(state =>  state.microwave.radio.thresholdBER3A);
  const rxThresholdBER6A = useSelectApplicationState(state =>  state.microwave.radio.thresholdBER6A);
  const rxThresholdBER3B = useSelectApplicationState(state =>  state.microwave.radio.thresholdBER3B);
  const rxThresholdBER6B = useSelectApplicationState(state =>  state.microwave.radio.thresholdBER6B);
  const processing = useSelectApplicationState(state =>  state.microwave.radio.processing);
  const admTableMessage = useSelectApplicationState(state =>  state.microwave.radio.admMessage);
  const admTableStatus = useSelectApplicationState(state =>  state.microwave.radio.admStatus);
  const radios = useSelectApplicationState(state =>  state.microwave.radio.radioParameters);

  const dispatch = useApplicationDispatch();

  const UpdateTxPower = async (txPowerA: number | null, txPowerB: number | null) => dispatch(new UpdateTxPowerAction(txPowerA, txPowerB));
  const updateRadio = async (radioA: string | null, radioB: string | null) => dispatch(updateRadioAttributes(radioA ? radioA : radioB, radioB ? radioB : radioA, radios));
  const updateMandatoryParameters = (parametersComplete: boolean) => dispatch(new radioMandatoryParametersAction(parametersComplete));
  const updateRadioModulation = async (modulationA: string | null, modulationB: string | null) => dispatch(new UpdateModulationAction(modulationA, modulationB));
  const updateModulationParameters = (newModulationParametersA: Modulation | null, newModulationParametersB: Modulation | null) => dispatch(new UpdateModulationParametersAction(newModulationParametersA, newModulationParametersB));
  const adaptiveModulation = async () => dispatch(adaptiveModulationInputCreator());
  const updateADMlist = (admList: any) => dispatch(new UpdateEnabeldAdaptiveModulations(admList.map((x: any) => x.modulation)));
  const resetAdapativeModulationTableProcessing = () => dispatch(new UpdateAdaptiveModulationProcessing(true));
  const handleClickOpen = (show: boolean) => {
    setOpenDialog(show);
  };

  const calculateAdaptiveModulation = async () => {
    handleClickOpen(true);
    await adaptiveModulation();
  };

  const checkMandatoryParameters = () => {

    if (radioModelA.length > 0 && radioModelB.length > 0) {
      if (radioModulationA.length > 0 && radioModulationB.length > 0) {
        if (isNumber(radioTxPowerA) || radioTxPowerA === 0) {
          if (isNumber(radioTxPowerB) || radioTxPowerB === 0) {
            if (Number(modulationParametersA?.txMax!)) {
              if (Number(modulationParametersB?.txMax!)) {
                updateMandatoryParameters(true);
              }
            }
          }
        } else updateMandatoryParameters(false);
      }
    }
  };

  useEffect(() => {
    checkMandatoryParameters();
  }, [radioModelA, radioModelB, radioModulationA, radioModulationB, radioTxPowerA, radioTxPowerB, modulationParametersA?.txMax, modulationParametersB?.txMax]);

 

  const handleDialogClose = () => {
    resetAdapativeModulationTableProcessing();
    setOpenDialog(false);

  };

  const setModulationParameters = (modulationA: string | null, modulationB: string | null) => {
    updateRadioModulation(modulationA, modulationB);

    radioParameters.forEach(async (element: Radio) => {
      if (radioModelA !== null && radioModelA === element.modelName) {
        Object.entries(element.operationalParameters?.modulations!).forEach((elementModulation) => {
          if (elementModulation[0] === modulationA) {
            updateModulationParameters(elementModulation[1] as any, null);
          }
        });
      }
      if (radioModelB !== null && radioModelB === element.modelName) {
        Object.entries(element.operationalParameters?.modulations!).forEach((elementModulation) => {
          if (elementModulation[0] === modulationB) {
            updateModulationParameters(null, elementModulation[1] as any);
          }
        });
      }
    });
  };


  const selectModulation = async (modulationA: string | null, modulationB: string | null) => {
    setModulationParameters(modulationA ? modulationA : modulationB, modulationB ? modulationB : modulationA);
  };
  const updateTxPower = async (txPowerA: number | null, txPowerB: number | null) => {
    await UpdateTxPower(txPowerA, txPowerB);
  };

  const updateADMModulation = (modulationList: string[]) => {
    let admList: { modulation: string; parameter: Modulation | null }[] = [];
    radioParameters.forEach(y => {
      if (y.modelName === radioModelA) {
        modulationList.forEach(modulation => {
          let entry: { modulation: string; parameter: Modulation | null } = { modulation: '', parameter: null };
          entry.modulation = modulation;
          const parameter: any = y.operationalParameters?.modulations!;
          if (parameter[modulation]) {
            entry.parameter = parameter[modulation];
            admList.push(entry);
          }
        });
      }
    });
    updateADMlist(admList);
  };
  return (
    <div className={classes.container}>

      <Stack className={classes.component} >

        <Typography aria-label="site-a-label" variant="body1" >Site A</Typography>

        <Typography aria-label="site-b-label" variant="body1" >Site B</Typography>

      </Stack>
      <Stack className={classes.component} >

        <FormControl variant="standard">

          <InputLabel>--Radio--</InputLabel>
          <Select variant="standard"
            className={classes.column}
            id="radioKeyA"
            aria-label="site-a-select-radio"
            value={radioModelA}  // displayEmpty

            onChange={(e) => {
              updateRadio(e.target.value as string, null);

            }}
            inputProps={{ name: 'radio', id: 'radio' }}
            error={radioModelA === ''}
          >
            <MenuItem value={'0'} disabled>--Select Radio--</MenuItem>
            {radioNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(radio =>
              (<MenuItem value={radio} aria-label="site-a-radio">{radio}</MenuItem>))}
          </Select>
          {
            radioModelA === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>

        <FormControl variant="standard" >
          <InputLabel >--Radio--</InputLabel>
          <Select variant="standard"
            className={classes.column}
            id="radioKeyB"
            aria-label="site-b-select-radio"
            value={radioModelB}  // displayEmpty
            onChange={(e) => {
              updateRadio(null, e.target.value as string);

            }}
            inputProps={{ name: 'radio', id: 'radio' }}
            error={radioModelB === ''}
          >
            <MenuItem value={'0'} disabled>--Select Radio--</MenuItem>
            {radioNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(radio =>
              (<MenuItem value={radio} aria-label="site-b-radio">{radio}</MenuItem>))}
          </Select>
          {
            radioModelB === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>
      </Stack>
      <Stack className={classes.component}>

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-bandwidth"
          label="Bandwidth"
          errorText=" "
          andornmentUnit="MHz"
          error={false}
          disabled
          value={radioBandwidthA}
        />

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-bandwidth"
          label="Bandwidth"
          errorText=" "
          andornmentUnit="MHz"
          error={false}
          disabled
          value={radioBandwidthB}
        />

      </Stack>
      <Stack className={classes.component}>
        <FormControl variant="standard" className={classes.modulationControl} >

          <InputLabel>--Reference Modulation--</InputLabel>
          <Select
            className={classes.column}
            variant="standard"
            id="modulationkey"
            aria-label="site-a-select-modulation"
            value={radioModulationA}  // displayEmpty
            onChange={async (e) => {
              await selectModulation(e.target.value as string, null);
            }}
            inputProps={{ name: 'modulation', id: 'modulation' }}
            error={radioModulationA.length === 0}
          >
            <MenuItem value={'0'} disabled>--Reference Modulation--</MenuItem>
            {modulationListA.sort(function (a, b) { return Number(a) - Number(b); }).map(modulation =>
              (<MenuItem value={modulation} aria-label="site-a-modulation">{modulation}</MenuItem>))}
          </Select>
          {
            radioModulationA === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>

        <FormControl variant="standard" className={classes.modulationControl} >
          <InputLabel htmlFor="pass">--Reference Modulation--</InputLabel>
          <Select variant="standard"
            className={classes.column}
            id="modulationkey"
            aria-label="site-b-select-modulation"
            value={radioModulationB}  // displayEmpty
            onChange={async (e) => {
              await selectModulation(null, e.target.value as string);
            }}
            inputProps={{ name: 'modulation', id: 'modulation' }}
            error={radioModulationB.length === 0}
          >
            <MenuItem value={'0'} disabled>--Reference Modulation---</MenuItem>
            {modulationListB.sort(function (a, b) { return Number(a) - Number(b); }).map(modulation =>
              (<MenuItem value={modulation} aria-label="site-b-modulation">{modulation}</MenuItem>))}
          </Select>
          {
            radioModulationB === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>


      </Stack>
      <Stack className={classes.component}>
        <Box textAlign='center' className={classes.adaptiveModulationButton}>
          <Button aria-label="site-a-adaptive-modulation-button" variant="contained"
            color="primary"
            name="adaptiveModulationSiteA"
            onClick={async () => {
              calculateAdaptiveModulation();
              setAdaptiveModulationSite('adaptiveModulationSiteA');
            }}
          >
            Adaptive Modulation
          </Button >
        </Box>
        <Box textAlign='center' className={classes.adaptiveModulationButton}>
          <Button aria-label="site-b-adaptive-modulation-button" variant="contained"
            color="primary"
            name="adaptiveModulationSiteB"
            onClick={async () => {
              calculateAdaptiveModulation();
              setAdaptiveModulationSite('adaptiveModulationSiteB');
            }}
          >
            Adaptive Modulation
          </Button >
        </Box>
      </Stack>
      <div>
        {isOpenDialog &&
          <>
            {processing ?

              <Stack>
                <Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'} >
                  <DialogContent>
                    <DialogContentText>
                      Adaptive Modulation
                    </DialogContentText>
                    <DialogActions>
                      <IconButton
                        aria-label="close"
                        className={classes.closeIcon}
                        onClick={handleDialogClose}
                        size="large">
                        <CloseIcon />
                      </IconButton>
                    </DialogActions>
                    <Paper>
                      <div className={classes.loading}>
                        <CircularProgress style={{ color: '#2596be' }} />
                        <h3>Processing ...</h3>
                      </div>
                    </Paper>
                  </DialogContent>
                </Dialog>
              </Stack>
              :
              <>
                {admTableStatus === 200 ?

                  <Stack>
                    <AdaptiveModulationDialog
                      close={handleDialogClose}
                      open={isOpenDialog}
                      row={adaptiveModulationSite === 'adaptiveModulationSiteB' ? adaptiveModulationTableBtoA! : adaptiveModulationTableAtoB!}
                      direction={adaptiveModulationSite === 'adaptiveModulationSiteB' ? 'Site B to A' : 'Site A to B'}
                      selectedElement={enabledAdaptiveModulations}
                      updateModulation={updateADMModulation}
                    />
                  </Stack>

                  :
                  <div>
                    <Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'} >
                      <DialogContent>
                        <DialogContentText>
                          Adaptive Modulation
                        </DialogContentText>
                        <DialogActions>
                          <IconButton
                            aria-label="close"
                            className={classes.closeIcon}
                            onClick={handleDialogClose}
                            size="large">
                            <CloseIcon />
                          </IconButton>
                        </DialogActions>
                        <Paper>
                          <ConnectionInfo
                            message={admTableMessage}
                            messageType={'Calculation Error'}
                            reachable={admTableStatus === 200}
                          />
                        </Paper>
                      </DialogContent>
                    </Dialog>
                  </div>

                }
              </>
            }
          </>
        }

      </div >
      <Stack className={classes.component}>

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-radio-transmitted-power"
          label="Tx Power"
          errorText="*Required"
          andornmentUnit="dBm"
          error={radioTxPowerA == null}
          value={radioTxPowerA || 0} // 0 is to displayEmpty
          onChange={(e) => {
            updateTxPower(Number(e.target.value), null);
          }}
        />
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-radio-transmitted-power"
          label="Tx Power"
          errorText="*Required"
          andornmentUnit="dBm"
          error={radioTxPowerB == null}
          value={radioTxPowerB || 0} //0 is to displayEmpty
          onChange={(e) => {
            updateTxPower(null, Number(e.target.value));
          }}
        />
      </Stack>
      <div className={classes.radioResultBox}>
        <div>
          <Stack className={classes.component}>

            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-a-radio-receiver-threshold-ber3"
              label="Rx Threshold BER -3"
              errorText=" "
              disabled
              andornmentUnit="dBm"
              error={false}
              value={rxThresholdBER3A || 0}
            />
            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-a-radio-receiver-threshold-ber6"
              label="Rx Threshold BER -6"
              errorText=" "
              disabled
              andornmentUnit="dBm"
              error={false}
              value={rxThresholdBER6A || 0}
            />
          </Stack>
          <Stack className={classes.component}>
            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-a-received-signal-level"
              label="received-signal-level"
              errorText=" "
              andornmentUnit="dBm"
              error={false}
              disabled
              value={rxPowerA.toFixed(3)}
            />

            <TextFieldwithAdornment
              className={classes.textField}
              label="fade-margin"
              errorText=" "
              aria-label="uplink-fade-margin"
              andornmentUnit="dB"
              error={false}
              disabled
              value={systemOperatingMarginA.toFixed(3)}
            />

          </Stack>
        </div>
        <Divider orientation="vertical" flexItem style={{ marginRight: '20px' }} />
        <div>
          <Stack className={classes.component} >

            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-b-radio-receiver-threshold-ber3"
              label="Rx Threshold BER -3"
              errorText=" "
              andornmentUnit="dBm"
              disabled
              error={false}
              value={rxThresholdBER3B || 0}
            />
            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-b-radio-receiver-threshold-ber6"
              label="Rx Threshold BER -6"
              errorText=" "
              andornmentUnit="dBm"
              disabled
              error={false}
              value={rxThresholdBER6B || 0}
            />

          </Stack>
          <Stack className={classes.component} >
            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="site-b-received-signal-level"
              label="received-signal-level"
              errorText=" "
              andornmentUnit="dBm"
              error={false}
              disabled
              value={rxPowerB.toFixed(3)}
            />
            <TextFieldwithAdornment
              className={classes.textField}
              aria-label="downlink-fade-margin"
              label="fade-margin"
              errorText=" "
              andornmentUnit="dB"
              error={false}
              disabled
              value={systemOperatingMarginB.toFixed(3)}
            />
          </Stack>
        </div>
      </div>
    </div >

  );

});

export default RadioView;