
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
import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { locationMandatoryAction, UpdateLatLonAction } from '../actions/siteAction';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';


 



const styles = makeStyles({
  row: { flexDirection: 'column', display: 'flex', width: '60%', marginLeft: '10px' },
});

const ManualLocationEnter: React.FC = (() => {

  const [latitude1Error, setLatitude1Error] = useState('');
  const [latitude2Error, setLatitude2Error] = useState('');
  const [longitude1Error, setLongitude1Error] = useState('');
  const [longitude2Error, setLongitude2Error] = useState('');

  const lat1 = useSelectApplicationState(state =>  state.microwave.site.lat1);
  const lon1 = useSelectApplicationState(state =>  state.microwave.site.lon1);
  const lat2 = useSelectApplicationState(state =>  state.microwave.site.lat2);
  const lon2 = useSelectApplicationState(state =>  state.microwave.site.lon2);
  // const latitude1Error = useSelectApplicationState(state =>  state.microwave.error.latitude1Error);
  // const latitude2Error = useSelectApplicationState(state =>  state.microwave.error.latitude2Error);
  // const longitude1Error = useSelectApplicationState(state =>  state.microwave.error.longitude1Error);
  // const longitude2Error = useSelectApplicationState(state =>  state.microwave.error.longitude2Error);
  const loadingComplete = useSelectApplicationState(state =>  state.microwave.view.loadingComplete);


  const dispatch = useApplicationDispatch();
  const updateLatLon = (updateLat1: number, updateLon1: number, updateLat2: number, updateLon2: number) => dispatch(new UpdateLatLonAction(updateLat1, updateLon1, updateLat2, updateLon2));
  const updateMandatoryParameters = (mandatory: boolean) => dispatch(new locationMandatoryAction(mandatory));

  const classes = styles();

  const checkMandatoryParameters = () => {
    if (latitude1Error === '' && longitude1Error === '' && latitude1Error === '' && longitude1Error === '') {
      updateMandatoryParameters(true);
    } else updateMandatoryParameters(false);
  };
  React.useEffect(() => {
    checkMandatoryParameters();
  }, [loadingComplete]);

  const changeLatLon = (e: any) => {

    if (e.target.id == 'Lat1') {
      updateLatLon(e.target.value, lon1, lat2, lon2);
    }
    if (e.target.id == 'Lon1') {
      updateLatLon(lat1, e.target.value, lat2, lon2);
    }
    if (e.target.id == 'Lat2')  {
      updateLatLon(lat1, lon1, e.target.value, lon2);
    } 
    if (e.target.id == 'Lon2') { 
      updateLatLon(lat1, e.target.value, lat2, e.target.value);
    }
  };

  const handleChange = (e: any) => {

    if (e.target.id === 'Lat1') {
      if (e.target.value > 90 || e.target.value < -90) {
        setLatitude1Error('Enter a number between -90 to 90');
      } else {
        changeLatLon(e);
        setLatitude1Error('');
      }
    } else if (e.target.id === 'Lat2') {
      if (e.target.value > 90 || e.target.value < -90) {
        setLatitude2Error('Enter a number between -90 to 90');
      } else {
        changeLatLon(e);
        setLatitude2Error('');
      }
    } else if (e.target.id === 'Lon1') {
      if (e.target.value > 180 || e.target.value < -180) {
        setLongitude1Error('Enter a number between -180 to 180');
      } else {
        changeLatLon(e);
        setLongitude1Error('');
      }
    } else if (e.target.id === 'Lon2') {
      if (e.target.value > 180 || e.target.value < -180) {
        setLongitude2Error('Enter a number between -180 to 180');
      } else {
        changeLatLon(e);
        setLongitude2Error('');
      }
    }
    checkMandatoryParameters();
  };


  return (
        <Stack className='GeoLocation'>
            <Stack >
                <Typography className='sideBySide' aria-label="site-a-label" variant="body1" >Site A</Typography>
                <Typography className='sideBySide' aria-label="site-b-label" variant="body1" >Site B</Typography>
            </Stack>
            <Stack >
                <Stack className={classes.row}>
                    <TextField variant="standard" id="Lat1" inputProps={{ 'aria-label': 'site-a-latitude' }} label="Latitude" margin="dense" className='texFieldInput'
                        helperText={latitude1Error || latitude1Error}
                        error={latitude1Error.length > 0 || latitude1Error!.length > 0}
                        onChange={(e: any) => {
                          handleChange(e);
                        }} />
                    <TextField variant="standard" id="Lon1" inputProps={{ 'aria-label': 'site-a-longitude' }} label="longitude" margin="dense" className='texFieldInput'
                        helperText={longitude1Error || longitude1Error}
                        error={longitude1Error.length > 0 || longitude1Error!.length > 0}
                        onChange={(e: any) => {
                          handleChange(e);
                        }} />
                </Stack>
                <Stack className={classes.row}>

                    <TextField variant="standard" id="Lat2" inputProps={{ 'aria-label': 'site-b-latitude' }} label="Latitude" margin="dense" className='texFieldInput'
                        helperText={latitude2Error || latitude2Error}
                        error={latitude2Error.length > 0 || latitude2Error!.length > 0}
                        onChange={(e: any) => {
                          handleChange(e);
                        }} />
                    <TextField variant="standard" id="Lon2" label="longitude" margin="dense" className='texFieldInput'
                        aria-label='site-b-longitude'
                        helperText={longitude2Error || longitude2Error}
                        error={longitude2Error.length > 0 || longitude2Error!.length > 0}
                        onChange={(e: any) => {
                          handleChange(e);
                        }} />

                </Stack>
            </Stack>
        </Stack>
  );
});
export default ManualLocationEnter;
