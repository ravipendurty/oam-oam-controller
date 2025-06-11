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
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { OpenStatisticsAction } from '../../actions/mapActions';

const Statistics: FC = () => {

  const linkCount = useSelectApplicationState(state => state.network.map.statistics.links);
  const siteCount = useSelectApplicationState(state => state.network.map.statistics.sites);
  const serviceCount = useSelectApplicationState(state => state.network.map.statistics.services);
  const isOpen = useSelectApplicationState(state => state.network.map.statistics.isOpen);
  const isTopoServerReachable = useSelectApplicationState(state => state.network.connectivity.isTopologyServerAvailable);
  const isTileServerReachable = useSelectApplicationState(state => state.network.connectivity.isTileServerAvailable);

  const dispatch = useApplicationDispatch();
  const openStatistics = (open: boolean) => dispatch(new OpenStatisticsAction(open));
   
  const reachable = isTopoServerReachable && isTileServerReachable;

  return (
    <Accordion expanded={isOpen} onChange={() => openStatistics(!isOpen)} style={{ position: 'absolute', display: 'flex', flexDirection: 'column', top: 140, width: 200, marginLeft: 5, zIndex: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-label="statistics-accordion">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography style={{ fontWeight: 'bold', flex: '1', color: reachable ? 'black' : 'lightgrey' }} >Statistics</Typography>
          <Tooltip disableInteractive style={{ marginLeft: 5 }} title="Gets updated when the map stops moving.">
            <InfoIcon fontSize="small" />
          </Tooltip>
        </div>
      </AccordionSummary>
      <AccordionDetails aria-label="statistics-accordion-details" style={{ 'marginTop': -15 }}>
        <Typography aria-label="site-count" style={{ color: reachable ? 'black' : 'lightgrey' }}>Sites: {siteCount}</Typography>
        <Typography aria-label="link-count" style={{ color: reachable ? 'black' : 'lightgrey' }}>Links: {linkCount}</Typography>
        <Typography aria-label="service-count" style={{ color: reachable ? 'black' : 'lightgrey' }}>Services: {serviceCount}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

Statistics.displayName = 'Statistics';

export default Statistics;