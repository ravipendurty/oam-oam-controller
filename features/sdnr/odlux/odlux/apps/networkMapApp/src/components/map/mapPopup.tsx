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

import React, { FC, useState } from 'react';

import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { useApplicationDispatch } from '../../../../../framework/src/flux/connect';

import { LoadNetworkElementDetails } from '../../actions/detailsAction';
import { Feature } from '../../model/topologyTypes';

type MapPopupProps = { 
  elements: Feature[];
  type: string;
  position: { left: number; top: number };
  onClose(): void; 
};

const MapPopup: FC<MapPopupProps> = (props) => {
  const { type, position, elements, onClose } = props;

  const dispatch = useApplicationDispatch();
  
  const [value, setValue] = useState('');

  const handleElementSelected = (event: any) => {
    setValue(event.target.value);
    const element = elements[event.target.value];
    const typeOfFeature = element?.properties?.layer || 'site';
    const id = element.properties.id;
    dispatch(LoadNetworkElementDetails(typeOfFeature, String(id)));
    onClose();
  };

  return (
    <Popover open={true} anchorEl={undefined} onClose={onClose} anchorReference="anchorPosition" anchorPosition={{ top: position.left, left: position.top }}>
      <Paper aria-label={'multiple-elements-selected'} style={{ padding: '15px' }}>
        <Typography variant="h5">{`Multiple ${type}s were selected`}</Typography>
        <Typography variant="body1">Please select one.</Typography>
        <Select variant="standard" aria-label={type + '-selection'} style={{ width: 300 }} onChange={handleElementSelected} value={value} native>
          <option aria-label="none-value" value={''} disabled>{type} ids</option>
          {
            elements.map((el, index) => (
              <option
                aria-label={String(el.properties.id)}
                key={String(el.properties.id)}
                value={index}>
                {el.properties.id}
                {(el.properties.subType !== 'null') ? ' - ' + el.properties.subType : ''}
                {(el.properties.polarization !== 'null' && el.properties.polarization !== 'NULL') ? ' - ' + el.properties.polarization : ''}
              </option>
            ))
          }
        </Select>
      </Paper>
    </Popover>
  );
};

MapPopup.displayName = 'MapPopup';

export default MapPopup;