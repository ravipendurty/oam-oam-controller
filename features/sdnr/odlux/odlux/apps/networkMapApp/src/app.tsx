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
import { useLocation } from 'react-router-dom';

import SplitPane from 'react-split-pane';
import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch, useSelectApplicationState } from '../../../framework/src/flux/connect';

import { Map } from './components/map/map';
import Details from './components/details/details';
import { RemoveHighlightingAction, SetCoordinatesAction, updateZoomAction } from './actions/mapActions';
import { ClearHistoryAction, LoadNetworkElementDetails } from './actions/detailsAction';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const useStyles = makeStyles({
  networkMap: {
    position: 'relative',
    flex: 1,
    height: '100%',
  },
  resizer: {
    background: '#000',
    opacity: 0.2,
    zIndex: 1,
    MozBoxSizing: 'border-box',
    WebkitBoxSizing: 'border-box',
    boxSizing: 'border-box',
    MozBackgroundClip: 'padding',
    WebkitBackgroundClip: 'padding',
    backgroundClip: 'padding-box',

    '&:hover': {
      WebkitTransition: 'all 2s ease',
      transition: 'all 2s ease',
    },
  
    '&.horizontal': {
      height: 11,
      margin: '-5px 0',
      borderTop: '5px solid rgba(255, 255, 255, 0)',
      borderBottom: '5px solid rgba(255, 255, 255, 0)',
      cursor: 'row-resize',
      width: '100%',
    },
  
    '&.horizontal:hover': {
      borderTop: '5px solid rgba(0, 0, 0, 0.5)',
      borderBottom: '5px solid rgba(0, 0, 0, 0.5)',
    },
  
    '&.vertical': {
      width: 11,
      margin: '0 -5px',
      borderLeft: '5px solid rgba(255, 255, 255, 0)',
      borderRight: '5px solid rgba(255, 255, 255, 0)',
      cursor: 'col-resize',
    },
  
    '&.vertical:hover': {
      borderLeft: '5px solid rgba(0, 0, 0, 0.5)',
      borderRight: '5px solid rgba(0, 0, 0, 0.5)',
    },

    '&.disabled': {
      cursor: 'not-allowed',
    },
    
    '&.disabled:hover': {
      borderColor: 'transparent',
    },
  },
});

const MainView: FC = () => {

  const query = useQuery();
  
  const [ newLatParam, newLonParam ] = query.get('center')?.split(',') ?? [];
  const newZoomParam = query.get('zoom');

  const newLat = newLatParam ? Number(newLatParam).toFixed(4) : undefined;
  const newLon = newLonParam ? Number(newLonParam).toFixed(4) : undefined;
  const newZoom = newZoomParam ? Number(newZoomParam).toFixed(2) : undefined;

  const newSiteId = query.get('siteId');
  const newLinkId = query.get('linkId');
  const newServiceId = query.get('serviceId');

  const { lat, lon, zoom } = useSelectApplicationState(state => state.network.map.coordinates);
  const selectedLink = useSelectApplicationState(state => state.network.map.selectedLink);
  const selectedSite = useSelectApplicationState(state => state.network.map.selectedSite);
  const selectedService = useSelectApplicationState(state => state.network.map.selectedService);
  
  const dispatch = useApplicationDispatch();
  
  useEffect(() => {
    const coordinateHasChanged = (newLat !== lat) || (newLon !== lon) || (newZoom !== zoom);
    const atLeastOneCoordinateIsDefined = newLat || newLon || newZoom;
    
    if (coordinateHasChanged && atLeastOneCoordinateIsDefined) {
      dispatch(new SetCoordinatesAction(newLat || lat, newLon || lon, newZoom || zoom));
    }

    const handleSelectedElement = async () => {
      // network element has changed
      if (!newSiteId && !newLinkId && !newServiceId) {
        dispatch(new ClearHistoryAction());
        dispatch(new RemoveHighlightingAction());
        return;
      } else if (newSiteId) {
        if (selectedSite?.properties.id !== Number(newSiteId) || coordinateHasChanged) {
          await dispatch(LoadNetworkElementDetails('site', newSiteId, !newLat && !newLon));
        }
      } else if (newLinkId) {
        if (selectedLink?.properties.id !== Number(newLinkId) || coordinateHasChanged) {
          await dispatch(LoadNetworkElementDetails('link', newLinkId, !newLat && !newLon));
        }
      } else if (newServiceId) {
        if (selectedService?.properties.id !== Number(newServiceId) || coordinateHasChanged) {
          await dispatch(LoadNetworkElementDetails('service', newServiceId, !newLat && !newLon));
        }
      }

      if (newZoom) {
        dispatch(updateZoomAction(newZoom));
      }
    };

    handleSelectedElement();

  }, [newLat, newLon, newZoom, newSiteId, newLinkId, newServiceId]);
  
  const styles = useStyles();
  
  return (
    <div className={styles.networkMap}>
      <SplitPane split="vertical" allowResize primary='second' resizerClassName={styles.resizer} minSize={200} pane2Style={{ display: 'flex' }}>
        <Map />   
        <Details />
      </SplitPane>
    </div>
  );
};

export default MainView;
