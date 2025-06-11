
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

import  React, { CSSProperties, FC } from 'react';

import TextField from '@mui/material/TextField';
import { InputProps } from '@mui/material/Input';

type PropTypes = InputProps & {
  label: string;
  style?: CSSProperties;
};

const InputComponent : FC = ({ ...other }) => <div   {...other} />;

export const OutlinedDiv: FC<PropTypes> = ({ label, children, style }) => {
  return (
    <TextField
      variant="outlined"
      disabled
      label={label}
      style={style}
      multiline
      InputLabelProps={{ shrink: true }}
      inputProps={{ children: children }}
      InputProps={{
        inputComponent: InputComponent, style: { padding:'4px' },
      }}
    />
  );
};
export default OutlinedDiv;
