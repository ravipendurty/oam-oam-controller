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

import Typography from '@mui/material/Typography/Typography';
import TextField from '@mui/material/TextField/TextField';

import { Service } from '../../model/topologyTypes';

type ServiceDetailsProps = { service: Service };

const ServiceDetails: React.FC<ServiceDetailsProps> = (props) => {

  return (
    <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '0px', display: 'flex', flexDirection: 'column' }}>
      <Typography style={{ marginTop: 35, marginBottom: 15 }} variant="h5" fontWeight={'bold'} aria-label="service-id">{props.service.id}</Typography>
      <TextField variant="standard" inputProps={{ 'aria-label': 'name' }} disabled style={{ marginTop: '5px' }} value={props.service.name} label="Name" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'type' }} disabled style={{ marginTop: '5px' }} value={props.service?.feature?.properties.layer} label="Layer" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'distance-in-km' }} disabled style={{ marginTop: '5px' }} value={props.service.length?.toFixed(2)} label="Distance in km" />
      {
        props.service.backupForServiceId &&
        <TextField variant="standard" inputProps={{ 'aria-label': 'backup-for-service-id' }} disabled style={{ marginTop: '5px' }} value={props.service.backupForServiceId} label="Backup for service (id)" />
      }
      <TextField variant="standard" inputProps={{ 'aria-label': 'created' }} disabled style={{ marginTop: '5px' }} value={props.service.created} label="Created" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'modified' }} disabled style={{ marginTop: '5px' }} value={props.service.modified} label="Modified" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'lifecycle-state' }} disabled style={{ marginTop: '5px' }} value={props.service.lifecycleState.toLowerCase()} label="Lifecyle State" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'operational-state' }} disabled style={{ marginTop: '5px' }} value={props.service.operationalState.toLowerCase()} label="Operational State" />
      <TextField variant="standard" inputProps={{ 'aria-label': 'admin-state' }} disabled style={{ marginTop: '5px' }} value={props.service.administrativeState.toLowerCase()} label="Administrative State" />
    </div>);
};

export default ServiceDetails;