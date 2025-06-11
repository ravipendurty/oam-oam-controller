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

import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

import { useSelectApplicationState, useApplicationDispatch } from '../../../../../framework/src/flux/connect';
import { IsTileServerReachableAction, IsTopologyServerReachableAction } from '../../actions/connectivityAction';

const useStyles = makeStyles({
  connectionInfo: {
    padding: 5, 
    position: 'absolute', 
    top: 160, 
    width: 230, 
    left: '40%', 
    zIndex: 1, 
  },
  container: {
    display: 'flex', 
    flexDirection: 'column', 
  },
  errorIcon:{
    'alignSelf': 'center', 
    marginBottom: 5, 
  },
});

const ConnectionInfo: React.FC = () => {

  const dispatch = useApplicationDispatch();

  const isTopoServerReachable = useSelectApplicationState(state => state.network.connectivity.isTopologyServerAvailable);
  const isTileServerReachable = useSelectApplicationState(state => state.network.connectivity.isTileServerAvailable);

  const handleClose = () => {
    dispatch(new IsTopologyServerReachableAction(true));
    dispatch(new IsTileServerReachableAction(true));
  };

  const styles = useStyles();

  return ((!isTopoServerReachable || !isTileServerReachable) ?
    <Paper className={styles.connectionInfo}>
      <div aria-label="connection-error-map-not-displayed" className={styles.container}>
        <div className={styles.errorIcon}> 
          <Typography> <FontAwesomeIcon icon={faExclamationTriangle} /> Connection Error</Typography>
        </div>
        {
          !isTileServerReachable 
            ? <Typography variant="body1" aria-label="tiles-unavailable"> Tile data can't be loaded.</Typography>
            : null
        }
        {
          !isTopoServerReachable
            ? < Typography variant="body1" aria-label="network-data-unavailable"> Network data can't be loaded.</Typography>
            : null
        }
        <Button variant="contained" color="primary" aria-label="reload-map" onClick={handleClose}>Close</Button>
      </div>
    </Paper> : null
  );
};

ConnectionInfo.displayName = 'ConnectionInfo';

export { ConnectionInfo };