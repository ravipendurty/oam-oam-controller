/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import React, { FC } from 'react';

import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper/Paper';
import IconButton from '@mui/material/IconButton/IconButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

type MapControlProps = {
  onZoomIn(): void;
  onZoomOut(): void;
  onAlignNorth(): void;
  bearing: number;
  align?: AllowedAlignment;
};

type AllowedAlignment = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

const useStyles = makeStyles({
  mapControl: {
    zIndex: 2,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
  },
  mapControlButton: {
    borderRadius: 0,
    height: 29,
    width: 29,
  },
  zoomIcon: {
    color: 'black',
    height: '15px',
  },
  biggerZoomIcon: {
    color: 'black',
    height: '17px',
  },
  borderBottom: {
    borderBottom: '1px solid lightgray',
  },
});

// created because normal zoom controls caused error (see: https://git-highstreet-technologies.com/highstreet/odlux/-/issues/367)

const MapControl: FC<MapControlProps> = (props) => {

  const getAlignment = (align: AllowedAlignment | undefined) => {
    const defaultCss = { top: 0, right: 0, margin: '10px 10px 0 0' };

    if (!align) {
      return defaultCss;
    }

    let alignment: React.CSSProperties;

    switch (align) {
      case 'top-right':
        alignment = defaultCss;
        break;
      case 'top-left':
        alignment = { top: 0, left: 0, margin: '10px 0 0 10px' };
        break;
      case 'bottom-right':
        alignment = { bottom: 0, right: 0, margin: '0 10px 45px 0' };
        break;
      case 'bottom-left':
        alignment = { bottom: 0, left: 0, margin: '0 0 10px 10px' };
        break;
    }

    return alignment;
  };

  const positioning = getAlignment(props.align);
  const bearing = props.bearing - 44; //align icon towards north
  
  const classes = useStyles();
  return (
    <Paper className={classes.mapControl} style={positioning}>
    <IconButton aria-label="zoom-in-button" className={`${classes.mapControlButton} ${classes.borderBottom}`} onClick={props.onZoomIn}>
      <FontAwesomeIcon className={classes.zoomIcon} icon={faPlus} />
    </IconButton>
    <IconButton aria-label="zoom-out-button" className={`${classes.mapControlButton} ${classes.borderBottom}`} onClick={props.onZoomOut}>
      <FontAwesomeIcon className={classes.zoomIcon} icon={faMinus} />
    </IconButton>
    <IconButton aria-label="align-north-button" className={classes.mapControlButton} onClick={props.onAlignNorth}>
      <FontAwesomeIcon className={classes.biggerZoomIcon} style={{ 'transform': `rotate(${bearing}deg)` }} icon={faCompass} />
    </IconButton>
    </Paper>
  );
};

MapControl.displayName = 'MapControl';

export default MapControl;