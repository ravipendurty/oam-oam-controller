
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

import  React, { FC, useEffect, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';


import { UpdateNewWaveguideParametersAction, waveguideMandatoryAction } from '../actions/waveguideActions';
import { Waveguide } from '../model/waveguide';
import { TextFieldwithAdornment } from './textFieldwithAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';




const waveguideStyles = makeStyles({
  siteLabel: {
    marginTop: '10px',
  },
  column: {
    width: '220px',
  },
  container: {
    display: 'flex', flexDirection: 'column', width: 'column',
  },
  component: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
});




const WaveguideView: FC = (() => {
  const [enterWaveguideLengthA, setEnterWaveguideLengthA] = useState(false);
  const [enterWaveguideLengthB, setEnterWaveguideLengthB] = useState(false);

  const waveguideLossA = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLossA);
  const waveguideLossB = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLossB);
  const waveguideSiteA = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideNameA);
  const waveguideSiteB = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideNameB);
  const waveguidelengthA = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLengthDisplayA);
  const waveguidelengthB = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLengthDisplayB);
  const waveguideTypeA = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideTypeA);
  const waveguideTypeB = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideTypeB);
  const waveguideParameters = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideParameters);
  const waveguideLengthACalculate = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLengthACalculate);
  const waveguideLengthBCalculate = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideLengthBCalculate);
  const waveguideNameList = useSelectApplicationState(state =>  state.microwave.waveguide.waveguideNameList);
  
  const dispatch = useApplicationDispatch();

  const updateMandatoryParameters = (mandatoryParameters: boolean) => dispatch(new waveguideMandatoryAction(mandatoryParameters));
  const updateWaveguideParameters = (waveguideParametersA: Waveguide | null, waveguideParametersB: Waveguide | null) => dispatch(new UpdateNewWaveguideParametersAction(waveguideParametersA, waveguideParametersB));

  const classes = waveguideStyles();
  const updateWaveguide = async (waveguideA: string | null, waveguideB: string | null) => {
    let waveguideAParameters: Waveguide;
    let waveguideBParameters: Waveguide;

    waveguideParameters.forEach(async (element: Waveguide) => {
      if (waveguideA !== null && waveguideA === element.modelName) {

        waveguideAParameters = element;
        await updateWaveguideParameters(waveguideAParameters, waveguideBParameters);

        if (element.operationalParameters?.type === 'rigid')
          setEnterWaveguideLengthA(false);
        else
          setEnterWaveguideLengthA(true);
      }
      if (waveguideB !== null && waveguideB === element.modelName) {
        waveguideBParameters = element;
        await updateWaveguideParameters(waveguideAParameters, waveguideBParameters);

        if (element.operationalParameters?.type === 'rigid') setEnterWaveguideLengthB(false);
        else {
          setEnterWaveguideLengthB(true);
        }
      }
    });

  };

  const onChangeWaveguideLength = async (waveguideLengthA: number | null, waveguideLengthB: number | null) => {


    let waveguideLengthAstate: number = waveguidelengthA;
    let waveguideLengthBstate: number = waveguidelengthB;
    let waveguideLengthACalculated = waveguideLengthACalculate;
    let waveguideLengthBCalculated = waveguideLengthBCalculate;
    if (waveguideLengthA && waveguideLengthA !== waveguideLengthAstate) {

      waveguideLengthAstate = waveguideLengthA;
      waveguideLengthACalculated = waveguideLengthA;

    }
    if (waveguideLengthB && waveguideLengthB !== waveguideLengthBstate) {
      waveguideLengthBstate = waveguideLengthB;
      waveguideLengthBCalculated = waveguideLengthB;
    }
    type Subset<Waveguide> = {
      [attr in keyof Waveguide]?: Waveguide[attr] extends object ? Subset<Waveguide[attr]> : Waveguide[attr];
    };
    type Nested<Waveguide> = {
      [value in keyof Subset<Waveguide>]?: Waveguide[value] extends object ? Nested<Waveguide[value]> : Subset<Waveguide[value]>;
    };
    let waveguideAParameters: Nested<Waveguide> | null = null;
    let waveguideBParameters: Nested<Waveguide> | null = null;
    waveguideParameters.forEach(x => {
      if (x.modelName === waveguideSiteA) {

        waveguideAParameters = { ...x, operationalParameters: { length: waveguideLengthAstate, type: x.operationalParameters?.type }, calculationParameters: { waveguideLength: waveguideLengthACalculated } };

      }

      if (x.modelName === waveguideSiteB) {

        waveguideBParameters = { ...x, operationalParameters: { length: waveguideLengthBstate, type: x.operationalParameters?.type }, calculationParameters: { waveguideLength: waveguideLengthBCalculated } };

      }
    });

    updateWaveguideParameters(waveguideAParameters, waveguideBParameters);

  };

  const checkMandatoryParameters = () => {
    if (waveguideTypeA === 'rigid') {
      if (waveguidelengthA !== 0) {
        updateMandatoryParameters(true);
      } else updateMandatoryParameters(false);
    }
    if (waveguideTypeB === 'rigid') {
      if (waveguidelengthB !== 0) {
        updateMandatoryParameters(true);
      } else updateMandatoryParameters(false);
    }
    if (waveguideTypeA === 'flexible_twistable') {
      if (waveguideTypeB === 'flexible_twistable') {
        updateMandatoryParameters(true);
      }
    }
  };

  useEffect(() => {
    checkMandatoryParameters();

  }, [waveguidelengthA, waveguidelengthB]);

  useEffect(() => {
    if (waveguideTypeA === 'rigid') {
      setEnterWaveguideLengthA(false);
    } else setEnterWaveguideLengthA(true);
    if (waveguideTypeB === 'rigid') {
      setEnterWaveguideLengthB(false);
    } else setEnterWaveguideLengthB(true);
    checkMandatoryParameters();

  }, [waveguideSiteA, waveguideSiteB]);


  return (

    <div className={classes.container}>

      <Stack className={classes.component}>

        <Typography className={classes.siteLabel} aria-label="site-a-label" variant="body1" >Site A</Typography>
        <Typography className={classes.siteLabel} aria-label="site-b-label" variant="body1" >Site B</Typography>

      </Stack>

      <Stack className={classes.component}>
        <FormControl variant="standard" className={classes.column}  >

          <InputLabel htmlFor="pass">--Waveguide--</InputLabel>
          <Select variant="standard"
            id="waveguideKeyA"
            aria-label="site-a-select-waveguide"
            value={waveguideSiteA || '0'}  // displayEmpty
            onChange={async (e) => {
              await updateWaveguide(e.target.value as string, null);
            }}
            inputProps={{ name: 'waveguide', id: 'waveguide' }}
            error={waveguideSiteA === ''}
          >
            <MenuItem value={'0'} disabled>--Select Waveguide--</MenuItem>
            {
              waveguideNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(waveguide =>
                (<MenuItem value={waveguide} aria-label="site-a-waveguide">{waveguide}</MenuItem>))
            }
          </Select>
          {
            waveguideSiteA === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>

        <FormControl variant="standard" className={classes.column}  >

          <InputLabel htmlFor="pass">--Waveguide--</InputLabel>
          <Select variant="standard"
            id="waveguideKeyA"
            aria-label="site-b-select-waveguide"
            value={waveguideSiteB || '0'}  // displayEmpty
            onChange={async (e) => {
              await updateWaveguide(null, e.target.value as string);


            }}
            inputProps={{ name: 'waveguide', id: 'waveguide' }}
            error={waveguideSiteB === ''}
          >
            <MenuItem value={'0'} disabled>--Select Waveguide--</MenuItem>
            {waveguideNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(waveguide =>
              (<MenuItem value={waveguide} aria-label="site-b-waveguide">{waveguide}</MenuItem>))}
          </Select>
          {
            waveguideSiteB === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>
      </Stack>
      <Stack className={classes.component}>
        <TextField variant="standard"
          aria-label="site-a-waveguide-type"
          className={classes.column}
          label="Waveguide Type"
          error={false}
          disabled
          value={waveguideTypeA}
        />
        <TextField variant="standard"
          aria-label="site-b-waveguide-type"
          className={classes.column}
          label="Waveguide Type"
          error={false}
          disabled
          value={waveguideTypeB}
        />
      </Stack>
      <Stack className={classes.component}>
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-waveguide-length"
          label="waveguide-length"
          type='number'
          errorText={enterWaveguideLengthA === true ? ' *Required ' : ''}
          andornmentUnit="m"
          error={!enterWaveguideLengthA && waveguidelengthA === 0}
          disabled={enterWaveguideLengthA}
          value={waveguidelengthA || 0} //added || 0 to avoid input with adornment issue
          onChange={(e) => {

            onChangeWaveguideLength(Number(e.target.value), null);
          }}
        />
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-waveguide-length"
          label="waveguide-length"
          type='number'
          errorText={enterWaveguideLengthB === true ? ' *Required ' : ''}
          andornmentUnit="m"
          error={!enterWaveguideLengthB && waveguidelengthB === 0}
          disabled={enterWaveguideLengthB}
          value={waveguidelengthB || 0}
          onChange={(e) => {

            onChangeWaveguideLength(null, Number(e.target.value));
          }}
        />
      </Stack>
      <Stack className={classes.component}>
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-waveguide-loss"
          label="waveguide-loss"
          errorText=" "
          andornmentUnit="dB"
          error={false}
          disabled
          value={waveguideLossA}
        />
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-waveguide-loss"
          label="waveguide-loss"
          errorText=" "
          andornmentUnit="dB"
          error={false}
          disabled
          value={waveguideLossB}
        />

      </Stack>
    </div>

  );

});

export default WaveguideView;