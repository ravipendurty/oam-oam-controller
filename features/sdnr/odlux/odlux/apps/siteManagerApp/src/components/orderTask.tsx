/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2021 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import * as React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

import { SitedocOrderTask } from '../models/siteDocTypes';

type taskProps = { value: SitedocOrderTask; onDescUpdate(val: string): void; onTypeUpdate(val: string): void; error: boolean };

const Task = (props: taskProps) => {
  const [orderTypes] = React.useState(['UPDATE', 'DELETE']);

  return <>
    <Stack style={{ marginBottom: '15px' }}>
      <FormControl style={{ marginTop: '20px', marginBottom: '20px' }} fullWidth variant='standard' error={props.error}>
        <InputLabel id='task-type-label-site-manager'>Task Type</InputLabel>
        <Select
          fullWidth
          aria-label='select-task-type'
          variant='standard'
          labelId='task-type-label-site-manager'
          label={'Task Type'}
          value={props.value.type}
          onChange={(e) => { props.onTypeUpdate(e.target.value as string); }}>
          <MenuItem aria-label='none-value' value={''}>None</MenuItem>
          {
            orderTypes.map(el => {
              return <MenuItem aria-label={el} value={el}>{el}</MenuItem>;
            })
          }
        </Select>
      </FormControl>
      <TextField fullWidth aria-label='task-description' error={props.error} multiline variant='standard' label={'Task Description'}
        value={props.value.description} onChange={e => { props.onDescUpdate(e.target.value); }}></TextField>
      {
        props.error && <FormHelperText error={props.error}>Cannot be empty</FormHelperText>
      }
    </Stack>
  </>;
};

const OrderTask = Task;

export default OrderTask;