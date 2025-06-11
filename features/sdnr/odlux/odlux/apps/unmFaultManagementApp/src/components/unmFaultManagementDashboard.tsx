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
import { RouteComponentProps } from 'react-router-dom';

import { WithStyles, withStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';

import { connect, Connect } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

const styles = () => createStyles({
  pageWidthSettings: {
    width: '50%',
    float: 'left',
  },
  root: {
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#eee',
    borderStyle: 'solid',
    width: '75%',
    padding: '15px',
    'fontfamily': 'Arial, Helvetica, sans-serif',
    'borderCollapse': 'collapse',
    'paddingBottom': '12px',
    'paddingLeft': '25px',
    'text-align': 'left',
    'color': 'black',
  },

});

const scrollbar = { overflow: 'auto', paddingRight: '20px' };


const mapProps = (state: IApplicationStoreState) => ({
  unmAlarmCount: state.unmFaultManagement.unmFaultStatus,
});

const mapDispatch = () => ({
});

type UnmFaultManagementComponentProps = RouteComponentProps & Connect<typeof mapProps, typeof mapDispatch> & WithStyles<typeof styles>;

class UnmFaultManagementDashboard extends React.Component<UnmFaultManagementComponentProps>  {
  constructor(props: UnmFaultManagementComponentProps) {
    super(props);
    this.state = {
    };
  }

  render(): JSX.Element {
    const { classes, unmAlarmCount } = this.props;
    return (
      <>
        <div style={scrollbar} >
          <h3 aria-label='unm-alarm-overview'>Alarm Overview</h3>
          <div style={{ width: '50%', float: 'left' }}>
            <table className={classes.root} >
              <tbody>
                <tr>
                  <th><h3>Total number of Alarms</h3></th>
                  <td> {unmAlarmCount.critical + unmAlarmCount.major + unmAlarmCount.minor
                    + unmAlarmCount.warning + unmAlarmCount.indeterminate} </td>
                </tr>
                <tr>
                  <th><h3>Critical</h3></th>
                  <td> {unmAlarmCount.critical} </td>
                </tr>
                <tr>
                  <th><h3>Major</h3></th>
                  <td> {unmAlarmCount.major} </td>
                </tr>
                <tr>
                  <th><h3>Minor</h3></th>
                  <td> {unmAlarmCount.minor} </td>
                </tr>
                <tr>
                  <th><h3>Warning</h3></th>
                  <td> {unmAlarmCount.warning} </td>
                </tr>
                <tr>
                  <th><h3>Indeterminate</h3></th>
                  <td> {unmAlarmCount.indeterminate} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapProps, mapDispatch)(withStyles(styles)(UnmFaultManagementDashboard));
