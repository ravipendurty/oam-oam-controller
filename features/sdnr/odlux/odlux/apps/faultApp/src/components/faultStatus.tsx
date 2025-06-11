/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // select app icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

const styles = makeStyles({
  icon: {
    marginLeft: 8,
    marginRight: 8,
  },
  critical: {
    color: 'red',
  },
  major: {
    color: 'orange',
  },
  minor: {
    color: '#f7f700',
  },
  warning: {
    color: '#428bca',
  },
});

const FaultStatusComponent = () => {
  const faultStatus = useSelectApplicationState((state: IApplicationStoreState) => state.fault.faultStatus);
  const classes = styles();
  return (
    <>
      <Typography variant="body1" color="inherit">
        Alarm Status:
        <Tooltip title="Critical Alarms" arrow>
          <span aria-label="critical-alarms">
            <FontAwesomeIcon className={`${classes.icon} ${classes.critical}`} icon={faExclamationTriangle} />
          </span>
        </Tooltip>
        {faultStatus.critical} |
      </Typography>

      <Typography variant="body1" color="inherit">
        <Tooltip title="Major Alarms" arrow>
          <span aria-label="major-alarms">
            <FontAwesomeIcon className={`${classes.icon} ${classes.major}`} icon={faExclamationTriangle} />
          </span>
        </Tooltip>
        {faultStatus.major} |
      </Typography>

      <Typography variant="body1" color="inherit">
        <Tooltip title="Minor Alarms" arrow>
          <span aria-label="minor-alarms">
            <FontAwesomeIcon className={`${classes.icon} ${classes.minor}`} icon={faExclamationTriangle} />
          </span>
        </Tooltip>
        {faultStatus.minor} |
      </Typography>

      <Typography variant="body1" color="inherit">
        <Tooltip title="Warning Alarms" arrow>
          <span aria-label="warning-alarms">
            <FontAwesomeIcon className={`${classes.icon} ${classes.warning}`} icon={faExclamationTriangle} />
          </span>
        </Tooltip>
        {faultStatus.warning} |
      </Typography>
    </>
  );
};

export const FaultStatus = FaultStatusComponent;
export default FaultStatus;