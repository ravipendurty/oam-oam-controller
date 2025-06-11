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

import * as React from 'react';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Stack from '@mui/material/Stack';

import { useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { LatLonToDMS } from '../utils/geoConverter';

import { TextFieldwithAdornment } from './textFieldwithAdornment';
import ManualLocationEnter from './manualLocationEntr';

const styles = makeStyles({
  column: {
    width: '220px',
  },
  container: {
    display: 'flex', flexDirection: 'column', width: 'column',
  },
  component: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  centerColumn: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '5',
  },
});


const LocationView: React.FC = (() => {
  const linkId = useSelectApplicationState(state => state.microwave.link.linkId);
  const lat1 = useSelectApplicationState(state => state.microwave.site.lat1);
  const lon1 = useSelectApplicationState(state => state.microwave.site.lon1);
  const lat2 = useSelectApplicationState(state =>  state.microwave.site.lat2);
  const lon2 = useSelectApplicationState(state => state.microwave.site.lon2);
  const formView = useSelectApplicationState(state =>  state.microwave.view.formView);
  const siteA = useSelectApplicationState(state =>  state.microwave.site.siteNameA);
  const siteB = useSelectApplicationState(state => state.microwave.site.siteNameB);
  const distance = useSelectApplicationState(state =>  state.microwave.link.distance);
  const amslA = useSelectApplicationState(state =>  state.microwave.site.amslA);
  const amslB = useSelectApplicationState(state => state.microwave.site.amslB);
  const siteAId = useSelectApplicationState(state =>  state.microwave.site.siteIdA);
  const siteBId = useSelectApplicationState(state =>  state.microwave.site.siteIdB);
  const azimuthDegSiteA = useSelectApplicationState(state =>  state.microwave.site.azimuthA);
  const azimuthDegSiteB = useSelectApplicationState(state =>  state.microwave.site.azimuthB);
  const tiltDegSiteA = useSelectApplicationState(state =>  state.microwave.site.tiltDegA);
  const tiltDegSiteB = useSelectApplicationState(state =>  state.microwave.site.tiltDegB);


  const classes = styles();

  return (
    <>

      {!formView &&
        <ManualLocationEnter />
      }
      <div className={classes.container}>
        <Stack className={classes.centerColumn}>
          <TextField variant="standard" aria-label='linkid' disabled value={linkId} label="LinkID" className={classes.column} />
        </Stack>

        <Stack className={classes.component}>
          <Typography aria-label="site-a-label" variant="body1" >Site A</Typography>

          <Typography aria-label="site-b-label" variant="body1" >Site B</Typography>
        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            aria-label="site-a-id-label"
            className={classes.column}
            label="Site ID"
            error={false}
            disabled
            value={siteAId}
          />


          <TextField variant="standard"
            aria-label="site-b-id-label"
            className={classes.column}
            label="Site ID"
            error={false}
            disabled
            value={siteBId}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            aria-label="site-a-name-label"
            className={classes.column}
            label="Site Name"
            error={false}
            disabled
            value={siteA}
          />

          <TextField variant="standard"
            aria-label="site-b-name-label"
            className={classes.column}
            label="Site Name"
            error={false}
            disabled
            value={siteB}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            aria-label="site-a-latitude-dms"
            className={classes.column}
            label="Latitude"
            error={false}
            disabled
            value={lat1 && LatLonToDMS(lat1, false)}
          />


          <TextField variant="standard"
            aria-label="site-b-latitude-dms"
            className={classes.column}
            label="Latitude"
            error={false}
            disabled
            value={lat2 && LatLonToDMS(lat2, false)}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            aria-label="site-a-longitude-dms"
            className={classes.column}
            label="Longitude"
            error={false}
            disabled
            value={lon1 && LatLonToDMS(lon1, true)}
          />

          <TextField variant="standard"
            aria-label="site-b-longitude-dms"
            className={classes.column}
            label="Longitude"
            error={false}
            disabled
            value={lon2 && LatLonToDMS(lon2, true)}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            className={classes.column}
            aria-label="site-a-azimuth"
            label="Azimuth"
            error={false}
            disabled
            value={azimuthDegSiteA && azimuthDegSiteA.toFixed(3)}
          />

          <TextField variant="standard"
            className={classes.column}
            aria-label="site-b-azimuth"
            label="Azimuth"
            error={false}
            disabled
            value={azimuthDegSiteB && azimuthDegSiteB.toFixed(3)}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextField variant="standard"
            className={classes.column}
            aria-label="site-a-tilt"
            label="Tilt"
            error={false}
            disabled
            value={tiltDegSiteA && tiltDegSiteA.toFixed(3)}
          />


          <TextField variant="standard"
            className={classes.column}
            aria-label="site-b-tilt"
            label="Tilt"
            error={false}
            disabled
            value={tiltDegSiteB && tiltDegSiteB.toFixed(3)}
          />

        </Stack>
        <Stack className={classes.component}>

          <TextFieldwithAdornment
            className={classes.column}
            aria-label="site-a-amsl"
            label="AMSL"
            errorText=" "
            andornmentUnit="m"
            error={false}
            disabled
            value={amslA && amslA.toFixed(2)}
          />


          <TextFieldwithAdornment
            className={classes.column}
            aria-label="site-b-amsl"
            label="AMSL"
            errorText=" "
            andornmentUnit="m"
            error={false}
            disabled
            value={amslB && amslB.toFixed(2)}
          />
        </Stack>
        <Stack className={classes.centerColumn}>
          <TextFieldwithAdornment
            className={classes.centerColumn}
            errorText=""
            aria-label="distance"
            label="Distance"
            andornmentUnit="km"
            error={false}
            disabled
            value={distance.toFixed(3)}
          />
        </Stack>

      </div >

    </>

  );

});
export default LocationView;
