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
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { antennaMandatoryAction, UpdateAntennaAction } from '../actions/antennaActions';
import { Antenna } from '../model/antenna';
import { TextFieldwithAdornment } from './textFieldwithAdornment';



const antennaStyles = makeStyles({
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

const AntennaView: FC = (() => {
  const antennaDb = useSelectApplicationState(state => state.microwave.antenna.antenna);
  const eirpA = useSelectApplicationState(state => state.microwave.antenna.eirpA).toFixed(3);
  const eirpB = useSelectApplicationState(state => state.microwave.antenna.eirpB).toFixed(3);
  const antennaGainA = useSelectApplicationState(state => state.microwave.antenna.antennaGainA);
  const antennaGainB = useSelectApplicationState(state => state.microwave.antenna.antennaGainB);
  const aglA = useSelectApplicationState(state => state.microwave.antenna.antennaHeightA);
  const aglB = useSelectApplicationState(state => state.microwave.antenna.antennaHeightB);
  const lat1 = useSelectApplicationState(state => state.microwave.site.lat1);
  const lon1 = useSelectApplicationState(state => state.microwave.site.lon1);
  const lat2 = useSelectApplicationState(state => state.microwave.site.lat2);
  const lon2 = useSelectApplicationState(state => state.microwave.site.lon2);
  const antennaNameList = useSelectApplicationState(state => state.microwave.antenna.antennaNameList);
  const antennaModelA = useSelectApplicationState(state => state.microwave.antenna.antennaNameA);
  const antennaModelB = useSelectApplicationState(state => state.microwave.antenna.antennaNameB);
  
  const dispatch = useApplicationDispatch();
  
  const updateAntennaParameters = (antennaA: Antenna | null, antennaB: Antenna | null) => {
    dispatch(new UpdateAntennaAction(antennaA, antennaB));
  };
  const updateMandatoryParameters = (mandatoryParameters: boolean) => {
    dispatch(new antennaMandatoryAction(mandatoryParameters));
  };
  
  const classes = antennaStyles();

  const checkMandatoryParameters = () => {
    if (antennaModelA !== '0' && antennaModelB !== '0' && antennaGainA !== 0 && antennaGainB !== 0) {
      updateMandatoryParameters(true);
    } else {
      updateMandatoryParameters(false);
    }
  };
  const updateAntennaName = async (antennaA: string | null, antennaB: string | null) => {
    antennaDb.forEach(antenna => {
      if (antennaA === antenna.modelName) {
        updateAntennaParameters(antenna, null);
      }
      if (antenna.modelName === antennaB) {
        updateAntennaParameters(null, antenna);
      }
    });

  };

  useEffect(() => checkMandatoryParameters(), [antennaModelA, antennaModelB]);
  
  return (
    <div className={classes.container}>
      <Stack className={classes.component}>
        <Typography aria-label="site-a-label" variant="body1" >Site A</Typography>
        <Typography aria-label="site-b-label" variant="body1" >Site B</Typography>

      </Stack>
      <Stack className={classes.component}>

        <FormControl variant="standard" className={classes.column} >
          <InputLabel >--Antenna--</InputLabel>
          <Select variant="standard"

            id="antennaKeyA"
            aria-label="site-a-select-antenna"
            value={antennaModelA}  // displayEmpty
            onChange={async (e) => {
              await updateAntennaName(e.target.value as string, null);
            }}
            inputProps={{ name: 'antenna', id: 'antenna' }}
            error={antennaModelA === ''}
          >
            <MenuItem value={'0'} disabled>--Select Antenna--</MenuItem>
            {antennaNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(antenna =>
              (<MenuItem value={antenna} aria-label="site-a-antenna">{antenna}</MenuItem>))}
          </Select>
          {
            antennaModelA === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>

        <FormControl variant="standard" className={classes.column}  >
          <InputLabel >--Antenna--</InputLabel>
          <Select variant="standard"

            id="antennaKeyB"
            aria-label="site-b-select-antenna"
            value={antennaModelB}  // displayEmpty
            onChange={async (e) => {
              await updateAntennaName(null, e.target.value as string);
            }}
            inputProps={{ name: 'antenna', id: 'antenna' }}
            error={antennaModelB === ''}
          >
            <MenuItem value={'0'} disabled>--Select Antenna--</MenuItem>
            {antennaNameList.sort(function (a, b) { return Number(a) - Number(b); }).map(antenna =>
              (<MenuItem value={antenna} aria-label="site-b-antenna">{antenna}</MenuItem>))}
          </Select>
          {
            antennaModelB === '' && <FormHelperText error>  *Required </FormHelperText>
          }
        </FormControl>

      </Stack>
      <Stack className={classes.component}>

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-antenna-gain"
          label="Gain"
          errorText=" "
          andornmentUnit="dBi"
          error={false}
          disabled
          value={antennaGainA || 0}
        />

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-antenna-gain"
          label="Gain"
          errorText=" "
          andornmentUnit="dBi"
          error={false}
          disabled
          value={antennaGainB || 0}
        />

      </Stack>
      <Stack className={classes.component}>

        <TextFieldwithAdornment
          aria-label="site-a-antenna-above-ground-level"
          className={classes.column}
          label="AGL"
          errorText=" "
          andornmentUnit="m"
          error={false}
          disabled
          value={aglA || 0}
        />


        <TextFieldwithAdornment
          aria-label="site-b-antenna-above-ground-level"
          className={classes.column}
          label="AGL"
          errorText=" "
          andornmentUnit="m"
          error={false}
          disabled
          value={aglB || 0}
        />

      </Stack>
      <Stack className={classes.component}>

        <TextField
          variant="standard"
          aria-label="site-a-antenna-latitude-longitude-dd"
          className={classes.column}
          label="Latitude/Longitude"
          error={false}
          disabled
          value={lat1 + ' , ' + lon1}
        />
        <TextField
          variant="standard"
          aria-label="site-b-antenna-latitude-longitude-dd"
          className={classes.column}
          label="Latitude/Longitude"
          error={false}
          disabled
          value={lat2 + ' , ' + lon2}
        />

      </Stack>
      <Stack className={classes.component}>
        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-a-effective-isotropic-radiated-power"
          label="EIRP"
          errorText=" "
          andornmentUnit="dBm"
          error={false}
          disabled
          value={eirpA}
        />

        <TextFieldwithAdornment
          className={classes.column}
          aria-label="site-b-effective-isotropic-radiated-power"
          label="EIRP"
          errorText=" "
          andornmentUnit="dBm"
          error={false}
          disabled
          value={eirpB}
        />

      </Stack>
    </div>
  );

});
AntennaView.displayName = 'Antenna';
export default AntennaView;