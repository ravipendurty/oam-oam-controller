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

import React, { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useSelectApplicationState } from '../../../../../framework/src/flux/connect';


const MissingInformation: FC = (() => {
  const isCalculationServerReachable = useSelectApplicationState(state => state.microwave.view.reachable);
  const formView = useSelectApplicationState(state => state.microwave.view.formView);
  return (
    (isCalculationServerReachable && formView) ? <Paper style={{ padding: 5, width: 230, position: 'absolute', top: '40%', left: '40%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ 'alignSelf': 'center', marginBottom: 5 }}> <Typography> <FontAwesomeIcon icon={faExclamationTriangle} />  Link Information Missing</Typography></div>

            </div>
        </Paper> : null

  );
});


export default MissingInformation;

