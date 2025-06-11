/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2021 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { GPSProfileResult } from '../model/lineOfSightGPSProfileResult';
import { calculateDistanceInMeter } from '../utils/lineOfSightMap';

type MapInfoProps = {
  minHeight: GPSProfileResult | undefined;
  maxHeight: GPSProfileResult | undefined;
};

const styles = (props: any) => makeStyles({
  accordion: { padding: 5, position: 'absolute', top: 10, width: props.width, marginLeft: 10, zIndex: 1 },
  container: { flexDirection: 'column', marginLeft: 10, padding: 5 },
  caption: { width: '40%' },
  subTitleRow: { width: '60%' },
  titleRowElement: { width: '40%', fontWeight: 'bold' },
  secondRow: { width: '25%' },
  thirdRow: { width: '20%' },
});

const MapInfo: FC<MapInfoProps> = (props) => {

  const center = useSelectApplicationState(state => state.microwave.map.center);
  const zoom = useSelectApplicationState(state => state.microwave.map.zoom);
  const start = useSelectApplicationState(state => state.microwave.map.start);
  const end = useSelectApplicationState(state => state.microwave.map.end);
  const heightA = useSelectApplicationState(state => state.microwave.map.heightA);
  const heightB = useSelectApplicationState(state => state.microwave.map.heightB);
  const [expanded, setExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, setWidth] = useState(470);
  const [length, setLength] = useState<string | undefined>();
  const classes = styles({ width: width })();
  const { minHeight, maxHeight } = props;

  useEffect(() => {
    if (start && end) {
      setLength(calculateDistanceInMeter(start.latitude, start.longitude, end.latitude, end.longitude).toFixed(3));
    } else {
      setLength(undefined);
    }
  }, [start, end]);

  const handleChange = (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return <Accordion className={classes.accordion} expanded={expanded} onChange={handleChange}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header">
      <Typography aria-label="map-info-accordion">Map Info</Typography>
    </AccordionSummary>
    
    <AccordionDetails aria-label="map-info-details" className={classes.container}>
      <Typography style={{ fontWeight: 'bold', flex: '1' }} >Map Center</Typography>
      <div >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Longitude</Typography><Typography>{center.longitude}</Typography></div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Latitude</Typography><Typography>{center.latitude}</Typography></div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Zoom</Typography><Typography> {zoom}</Typography></div>
      </div>

      <Typography style={{ fontWeight: 'bold', flex: '1', marginTop: 5 }} >Link</Typography>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '38%' }}>
          <Typography className={classes.titleRowElement}> Start</Typography>
          <Typography className={classes.titleRowElement}> End</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Longitude</Typography>
          <Typography className={classes.secondRow}> {start?.longitude.toFixed(3)}</Typography>
          <Typography className={classes.secondRow}> {end?.longitude.toFixed(3)}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Latitude</Typography>
          <Typography className={classes.secondRow}> {start?.latitude.toFixed(3)}</Typography>
          <Typography className={classes.secondRow}> {end?.latitude.toFixed(3)}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Meassured height [m]</Typography>
          <Typography className={classes.secondRow}> {heightA?.amsl}</Typography>
          <Typography className={classes.secondRow}> {heightB?.amsl}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Antenna height [m] </Typography>
          <Typography className={classes.secondRow}> {heightA?.antennaHeight}</Typography>
          <Typography className={classes.secondRow}> {heightB?.antennaHeight}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Length [m]</Typography>
          <Typography className={classes.secondRow}> {length}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Max height @ position </Typography>
          <Typography className={classes.thirdRow}> {maxHeight ? maxHeight.height + ' m' : ''}</Typography>
          <Typography className={classes.thirdRow}> {maxHeight?.gps.longitude.toFixed(3)}</Typography>
          <Typography className={classes.thirdRow}> {maxHeight?.gps.latitude.toFixed(3)}</Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography className={classes.caption}> Min height @ position</Typography>
          <Typography className={classes.thirdRow}> {minHeight ? minHeight.height + ' m' : ''}</Typography>
          <Typography className={classes.thirdRow}> {minHeight?.gps.longitude.toFixed(3)}</Typography>
          <Typography className={classes.thirdRow}> {minHeight?.gps.latitude.toFixed(3)}</Typography>
        </div>

      </div>
    </AccordionDetails>
  </Accordion>;
};

export default MapInfo;