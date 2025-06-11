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

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { loadLayers, OpenLayersAction, updateLayerAsyncAction } from '../../actions/mapActions';

const useStyles = makeStyles({
  mapLayer: {
    position: 'absolute', 
    display: 'flex', 
    flexDirection: 'column', 
    top: 323, 
    width: 200, 
    marginLeft: 5, 
    zIndex: 1,
  },
  title:{
    fontWeight: 'bold',
  },
});

const MapLayer : FC = () => {

  const elements = useSelectApplicationState(state => state.network.map.layersContainer.elements);
  const isOpen = useSelectApplicationState(state => state.network.map.layersContainer.isOpen);
  const areFurtherLayersAvailable = useSelectApplicationState(state => state.network.map.layersContainer.areFurtherLayersAvailable);

  const dispatch = useApplicationDispatch();
  const updateLayer = (name: string, displayed: boolean) => dispatch(updateLayerAsyncAction(name, displayed, true));
  const loadMapLayers = () => dispatch(loadLayers());
  const open = (newOpenState: boolean) => dispatch(new OpenLayersAction(newOpenState));

  React.useEffect(() => {
    loadMapLayers();
  }, []);

  const classes = useStyles();
  return (
    <Accordion expanded={isOpen} onChange={() => open(!isOpen)} className={classes.mapLayer}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-label="map-layer-accordion">
        <Typography className={classes.title} variant="body1">Layers</Typography>
      </AccordionSummary>
      <AccordionDetails aria-label="layer-accordion-details" style={{ 'marginTop': -15 }}>
        <FormGroup>
          {
            elements.map((el, i) => el.base
              ? <FormControlLabel
                  aria-label={'layer-' + (i + 1)}
                  key={i}
                  control={
                    <Checkbox
                    color='secondary'
                    checked={el.displayed}
                      onChange={(e) => { updateLayer(el.name, e.target.checked); }}
                    />
                  }
                  label={el.name}
                />
              : null,
            )
          }
        </FormGroup>
        {
          areFurtherLayersAvailable 
            ? ( <>
                <Typography className={classes.title} variant="body1">Further Layers</Typography>
                <FormGroup>
                  {
                    elements.map((el, i) => !el.base
                      ? <FormControlLabel
                          aria-label={'layer-' + (i + 1)}
                          key={i}
                          control={
                            <Checkbox color='secondary'
                              checked={el.displayed}
                              onChange={(e) => { updateLayer(el.name, e.target.checked); }}
                            />
                          }
                          label={el.name}
                        />
                      : null,
                    )
                  }
                </FormGroup>
              </>)
            : null
        }
      </AccordionDetails>
    </Accordion>);
};

MapLayer.displayName = 'MapLayer';

export default MapLayer;
