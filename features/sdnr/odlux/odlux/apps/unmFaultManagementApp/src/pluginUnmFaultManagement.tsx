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
// app configuration and main entry point for the app


import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { connect, Connect, IDispatcher } from '../../../framework/src/flux/connect';
import applicationManager from '../../../framework/src/services/applicationManager';

import { SetPanelAction } from './actions/panelChangeActions';
import UnmFaultManagementDashboard from './components/unmFaultManagementDashboard';
import { UnmFaultManagementAppRootHandler } from './handlers/unmFaultManagementAppRootHandler';
import { PanelId } from './models/panelId';
import  UnmFaultManagementApplication  from './views/unmFaultManagementApplication';

const appIcon = require('./assets/icons/unmFaultManagementAppIcon.svg');  // select app icon

let currentMountId: string | undefined = undefined;
let currentSeverity: string | undefined = undefined;

const mapProps = () => ({
});

const mapDispatch = (dispatcher: IDispatcher) => ({
  setCurrentPanel: (panelId: PanelId) => dispatcher.dispatch(new SetPanelAction(panelId)),
});

const UnmFaultManagementApplicationRouteAdapter = connect(mapProps, mapDispatch)((props: RouteComponentProps<{ mountId?: string }> & Connect<typeof mapProps, typeof mapDispatch>) => {
  if (currentMountId !== props.match.params.mountId) {
    currentMountId = props.match.params.mountId || undefined;
  }
  <UnmFaultManagementDashboard />;
  return (
    <UnmFaultManagementApplication />
  );
});

const UnmFaultManagementApplicationAlarmStatusRouteAdapter = connect(mapProps, mapDispatch)((props: RouteComponentProps<{ severity?: string }> & Connect<typeof mapProps, typeof mapDispatch>) => {
  if (currentSeverity !== props.match.params.severity) {
    currentSeverity = props.match.params.severity || undefined;
  }
  return (
    <UnmFaultManagementApplication />
  );
});

const App = withRouter((props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/alarmStatus/:severity?`} component={UnmFaultManagementApplicationAlarmStatusRouteAdapter} />
    <Route path={`${props.match.path}/:mountId?`} component={UnmFaultManagementApplicationRouteAdapter} />
    <Route path={`${props.match.url}`} component={UnmFaultManagementApplication} />
    <Redirect to={`${props.match.url}`} />
  </Switch>
));

export function register() {
  applicationManager.registerApplication({
    name: 'unmFaultManagement',
    icon: appIcon,
    rootComponent: App,
    rootActionHandler: UnmFaultManagementAppRootHandler,
    menuEntry: 'UNM Fault Management',
  });
}