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

import makeStyles from '@mui/styles/makeStyles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LinkComponent from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { AddToHistoryAction, ClearHistoryAction, SelectElementAction } from '../../actions/detailsAction';
import { highlightElementAction } from '../../actions/mapActions';

import { HistoryEntry } from '../../model/historyEntry';
import { Link, Site, Service, isService, isSite, isLink } from '../../model/topologyTypes';

import detailsUtils from '../../utils/detailsUtils';

import LinkDetails from './linkDetails';
import ServiceDetails from './serviceDetails';
import SiteDetails from './siteDetails';

const useStyles = makeStyles({
  mapDetails: {
    background: '#bbbdbf',
    padding: '20px',
    alignSelf: 'stretch',
    flex: '1 1 0',
  },
  container: {
    marginLeft: '15px',
    marginTop: '5px',
  },
  message: {
    marginTop: '5px',
  },
});

const Details: React.FC = () => {

  const data = useSelectApplicationState(state => state.network.details.data);
  const breadcrumbs = useSelectApplicationState(state => state.network.details.history);
 
  const dispatch = useApplicationDispatch();
  const displayElement = (element: Site | Link | Service) => dispatch(new SelectElementAction(element));
  const highlightElementOnMap = (element: Link | Site | Service) => dispatch(highlightElementAction(element));
  const addHistory = (newEntry: HistoryEntry) => dispatch(new AddToHistoryAction(newEntry));
  const clearHistory = () => dispatch(new ClearHistoryAction());

  const [message, _setMessage] = React.useState('No data selected.');

  const onLinkClick = async (id: string) => {
    detailsUtils.loadData('link', id, (result) => {
      displayElement(result);
      highlightElementOnMap(result);
      addHistory({ id: data!.name, data: data! as any });
    });
  };

  const backClick = (e: any) => {
    displayElement(breadcrumbs[0].data);
    highlightElementOnMap(breadcrumbs[0].data);
    clearHistory();
    e.preventDefault();
  };

  const renderDetailPanel = (element: Site | Link | Service) => {
    if (isSite(element)) {
      return <SiteDetails site={element} onLinkClick={onLinkClick} />;
    } else if (isService(element)) {
      return <ServiceDetails service={element} />;
    } else if (isLink(element)) {
      return <LinkDetails link={element} />;
    }
    return null;
  };

  const panelId = data !== null ? (isSite(data) ? 'site-details-panel' : 'link-details-panel') : 'details-panel';

  const styles = useStyles();

  return (
    <div className={styles.mapDetails }>
    <Paper style={{ height: '100%' }} id={panelId} aria-label={panelId}  >
      { breadcrumbs.length > 0 
        ? (
          <Breadcrumbs className={styles.container} aria-label="breadcrumbs-navigation">
          <LinkComponent underline="hover" aria-label="parent-element" color="inherit" href="/" onClick={backClick}>
            {breadcrumbs[0].id}
          </LinkComponent>
          <LinkComponent underline="hover" aria-label="child-element" color="textSecondary">
            {data?.name}
          </LinkComponent>
          </Breadcrumbs>
        )
        : null
      }
      { data
        ? renderDetailPanel(data)
        : <Typography className={styles.message} aria-label="details-panel-alt-message" align="center" variant="body1">{message}</Typography>
      }
    </Paper>
  </div>);
};

Details.displayName = 'MapDetails';

export default Details;