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

// app configuration and main entry point for the app

import React from 'react';

import { useApplicationDispatch } from '../../../framework/src/flux/connect';
import applicationManager from '../../../framework/src/services/applicationManager';

import { addMapMessageListener } from '../../../lib/broadcast/mapChannel';
import { URL_BASEPATH } from './config';

import { CheckSitedocReachability } from './actions/detailsAction';
import { SetFilterValueAction } from './actions/filterActions';
import { getSettings } from './actions/settingsAction';

import { NetworkMapSetup } from './components/customize/networkMapSetup';

import { networkmapRootHandler } from './handlers/rootHandler';
import { MapMiddleware } from './handlers/mapHandler';

import MainView from './app';

const appIcon = require('./assets/icons/networkMapAppIcon.svg');  // select app icon

const NetworkMapApp = () => {

  const dispatch = useApplicationDispatch();
  const tryReachSitedocServer = () => dispatch(CheckSitedocReachability());

  React.useLayoutEffect(() => {
    tryReachSitedocServer();
  }, []);

  return (
    <MainView />
  );
};

NetworkMapApp.displayName = 'NetworkMapApp';

export const register = async () => {
  const appApi = applicationManager.registerApplication({
    name: URL_BASEPATH, // used as name of state as well
    icon: appIcon,
    middlewares: [MapMiddleware],
    rootActionHandler: networkmapRootHandler,
    rootComponent: NetworkMapApp,
    settingsElement: NetworkMapSetup,
    menuEntry: 'Network Map',
  });

  addMapMessageListener('setFilter', (filter) => {
    const store = appApi && appApi.applicationStore;
    store?.dispatch(new SetFilterValueAction(filter));
  });

  await appApi.applicationStoreInitialized;
  await appApi.applicationStore?.dispatch(getSettings());
};
