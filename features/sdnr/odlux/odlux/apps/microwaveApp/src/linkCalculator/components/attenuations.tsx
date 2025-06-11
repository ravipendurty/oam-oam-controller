
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
import React, { FC, useEffect } from 'react';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import makeStyles from '@mui/styles/makeStyles';


import { attenuationMandatoryParametersAction, UpdateAttenuationMethodAction, UpdateRainMethodAction, UpdateRainValAction, UpdateWorstMonthAction } from '../actions/atmosphericLossAction';
import { UpdatePolAction } from '../actions/linkAction';
import { UpdateRainMethodDisplayAction } from '../actions/viewAction';
import OutlinedDiv from './outlinedDiv';
import { TextFieldwithAdornment } from './textFieldwithAdornment';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';


const styles = makeStyles({

  stack: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5',
    paddingTop: '15px',
    alignItems:'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
  },
  formStyle: {
    paddingTop: '10px',
    width: '40%',
  },
  waterAbsorptionStyle: {
    display: 'flex',
    placeSelf: 'flex-end',
    width: '35%',
    paddingRight: '62px',
  },
  textFieldwithAdornment: {
    paddingTop: '10px',
    width: '80%',
  },
  insideGridStack: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centerColumn: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5',
  },

});

const AttenuationView: FC = (() => {
  const classes = styles();
  const dispatch = useApplicationDispatch();
  const rainAtt = useSelectApplicationState(state =>  state.microwave.atmosphere.rainAtt);
  const rainVal = useSelectApplicationState(state =>  state.microwave.atmosphere.rainVal);
  const absorptionOxygen = useSelectApplicationState(state =>  state.microwave.atmosphere.absorptionOxygen);
  const absorptionWater = useSelectApplicationState(state =>  state.microwave.atmosphere.absorptionWater);
  const worstMonth = useSelectApplicationState(state =>  state.microwave.atmosphere.worstMonth);
  const rainMethod = useSelectApplicationState(state =>  state.microwave.atmosphere.rainMethod);
  const attenuationMethod = useSelectApplicationState(state => state.microwave.atmosphere.attenuationMethod);
  const rainDisplay = useSelectApplicationState(state =>  state.microwave.view.rainDisplay);
  const fsl = useSelectApplicationState(state =>  state.microwave.atmosphere.fsl);
  const polarization = useSelectApplicationState(state =>  state.microwave.link.polarization);

  const updateRainValue = async (rainRate: number) => dispatch(new UpdateRainValAction(rainRate));
  const updateRainMethod = (rainMethodSelect: string) => dispatch(new UpdateRainMethodAction(rainMethodSelect));
  
  const updateAttenuationMethod = (attenuationMethodSelect: string) => dispatch(new UpdateAttenuationMethodAction(attenuationMethodSelect));
  const updateRainMethodDisplay = (rainMethodDisplay: boolean) => dispatch(new UpdateRainMethodDisplayAction(rainMethodDisplay));
  const updateWorstMonth = (worstMonthSelect: string) => {
    if (worstMonthSelect === 'Annual') {
      dispatch(new UpdateWorstMonthAction(false));
    } else dispatch(new UpdateWorstMonthAction(true));
  };
  const updatePolarization = (polarizationSelect: 'HORIZONTAL' | 'VERTICAL' | null) => dispatch(new UpdatePolAction(polarizationSelect));
  const updateMandatoryParameters = (mandatoryParametersPresent: boolean) => dispatch(new attenuationMandatoryParametersAction(mandatoryParametersPresent));


  const checkMandatoryParameters = () => {
    let error: boolean = false;
    if (rainVal !== 0 && rainMethod.length > 0 && attenuationMethod.length > 0) {
      error = true;
    }
    if (rainVal === 0 && rainMethod === 'ITURP8377' && attenuationMethod.length > 0) {
      error = true;
    }
    updateMandatoryParameters(error);
  };

  useEffect(() => {
    checkMandatoryParameters();
  }, [rainVal, rainMethod, attenuationMethod]);

 
  const setRainValue = async (rainfall: number) => {
    await updateRainValue(rainfall);
  };
  const handleSelectChange = async (event: any) => {
    if (event.target.name === 'rainmethod') {
      await updateRainMethod(event.target.value as any);
      if (await event.target.value === 'ITURP8377') {
        updateRainMethodDisplay(false);
      } else {
        updateRainMethodDisplay(true);
      }

    } else if (event.target.name === 'absorptionmethod') {
      await updateAttenuationMethod(event.target.value as any);
    }
  };

  const onRadioSelect = (e: any) => {

    if (e.target.name === 'worstmonth') {
      updateWorstMonth(e.target.value);
    } else if (e.target.name === 'polarization') {
      updatePolarization(e.target.value);
    }
  };



  return (
    <div >
      <div className={classes.centerColumn} >
        <RadioGroup row aria-label="worstmonth-label" name="worstmonth" value={worstMonth === false ? 'Annual' : 'Worstmonth'}
        >
          <FormControlLabel aria-label="annual" value='Annual'
            control={<Radio color="secondary" />} label="Annual"
            onChange={onRadioSelect} />
          <FormControlLabel aria-label="worst-month" value="Worstmonth"
            control={<Radio color="secondary" />} label="Worst Month"
            onChange={onRadioSelect} />
        </RadioGroup>
      </div>
      <div className={classes.centerColumn} >
        <TextFieldwithAdornment
          label="FSL"
          errorText=" "
          aria-label="fspl-value"
          andornmentUnit="dB"
          error={false}
          disabled
          value={fsl.toFixed(3)}
        />
      </div>
      <Stack className={classes.stack}>
        <OutlinedDiv label='Rain'>
          <Grid container className={classes.grid}>
            <Stack className={classes.insideGridStack}>
              <FormControl variant="standard" className={classes.formStyle} >
                <InputLabel htmlFor="pass">--Rain Method--</InputLabel>
                <Select variant="standard"
                  aria-label="rain-method"
                  value={rainMethod}  // displayEmpty
                  onChange={(e) => {
                    handleSelectChange(e);
                  }}
                  inputProps={{ name: 'rainmethod', id: 'rainmethod' }}
                  error={rainMethod.length === 0}
                >
                  <MenuItem value={''} aria-label="none-value" disabled>--Select Rain Method--</MenuItem>
                  <MenuItem value={'ITURP8377'} aria-label="itur8377">ITU-R P.837-7</MenuItem>
                  <MenuItem value={'MANUAL'} aria-label="manual-entry">Specific Rain</MenuItem>
                </Select>
                {rainMethod.length === 0 && <FormHelperText error>  * Required </FormHelperText>}
              </FormControl>
              <RadioGroup className={classes.formStyle} aria-label="polarization-label" name="polarization" value={polarization!}
              >
                <FormControlLabel aria-label="polarization-horizontal"
                  value='HORIZONTAL'
                  control={<Radio color="secondary" />}
                  label="Horizontal"
                  onChange={onRadioSelect}
                />
                <FormControlLabel aria-label="polarization-vertical"
                  value='VERTICAL'
                  control={<Radio color="secondary" />}
                  label="Vertical"
                  onChange={onRadioSelect}
                />
              </RadioGroup>
            </Stack>
            <Stack className={classes.insideGridStack}>
              <TextFieldwithAdornment
                aria-label="rain-value"
                name='rainValue'
                type='number'
                className={classes.textFieldwithAdornment}
                label="rainFall"
                errorText={rainDisplay === true ? ' *Required ' : ''}
                andornmentUnit="mm/hr"
                inputProps={{ name: 'rainValue', id: 'rainValue' }}
                error={rainDisplay === true && rainVal === 0}
                disabled={rainDisplay === false ? true : false}
                onChange={async (e) => {
                  await setRainValue(Number(e.target.value));
                }}
                value={rainVal}
              />
              <TextFieldwithAdornment
                label="Rain Loss"
                aria-label="rain-loss"
                className={classes.textFieldwithAdornment}
                errorText=" "
                andornmentUnit="dB"
                error={false}
                disabled
                value={rainAtt.toFixed(3)}
              />
            </Stack>
          </Grid>
        </OutlinedDiv>
      </Stack>
      <Stack className={classes.stack}>
        <OutlinedDiv label='Absorption' >
          <Grid container className={classes.grid}>
            <Stack className={classes.insideGridStack}>
              <FormControl variant="standard" className={classes.formStyle}  >
                <InputLabel htmlFor="pass">--Absorption Method--</InputLabel>
                <Select variant="standard"
                  aria-label="absorption-method"
                  value={attenuationMethod && attenuationMethod}  // displayEmpty
                  onChange={(e) => {
                    handleSelectChange(e);
                  }}
                  inputProps={{ name: 'absorptionmethod', id: 'absorptionmethod' }}
                  error={attenuationMethod.length === 0}
                >
                  <MenuItem value={''} aria-label="none-value" disabled>--Select Absorption Method--</MenuItem>
                  <MenuItem value="ITURP67612" aria-label="iturp67612">ITU-R P.676-12</MenuItem>
                  <MenuItem value="ITURP67611" aria-label="iturp67611">ITU-R P.676-11</MenuItem>
                  <MenuItem value="ITURP67610" aria-label="iturp67610">ITU-R P.676-10</MenuItem>
                </Select>
                {(attenuationMethod.length === 0) && <FormHelperText error>  * Required  </FormHelperText>}
              </FormControl>
              <TextFieldwithAdornment
                label="Oxygen absorption"
                aria-label="absorption-oxygen-value"
                className={classes.textFieldwithAdornment}
                errorText=" "
                andornmentUnit="dB"
                error={false}
                disabled
                value={absorptionOxygen.toFixed(3)}
              />
            </Stack>
            <Stack className={classes.waterAbsorptionStyle}>
              <TextFieldwithAdornment
                label="water vapor absorption"
                aria-label="absorption-water-value"
                errorText=" "
                andornmentUnit="dB"
                error={false}
                disabled
                value={absorptionWater.toFixed(3)}
              />
            </Stack>
          </Grid>
        </OutlinedDiv>
      </Stack>
    </div>
  );
});

export default AttenuationView;