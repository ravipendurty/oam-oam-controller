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
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { useApplicationDispatch } from '../../../framework/src/flux/connect';
import applicationManager from '../../../framework/src/services/applicationManager';

import { loadTreeSiteSearchBySiteIdOrNameAsync, SearchValueAction } from './actions/siteManagerSiteSearchAction';
import siteManagerAppRootHandler from './handlers/siteManagerAppRootHandler';
import SiteManager from './views/siteManager';

const appIcon = require('./assets/icons/siteManagerAppIcon.svg');  // select app icon

let currentSearchSiteId: string | undefined = undefined;
let currentSearchCategoryName: string | undefined = undefined;

interface SearchProps {
  handleRefresh: (event: React.SyntheticEvent) => void;
  handleSearch: (event: React.SyntheticEvent, searchValue: string) => void;
}

const SiteManagerTableApplicationRouteAdapter = ((props: SearchProps & RouteComponentProps<{
  searchSiteId?: string; searchCategoryName?: string;
}>) => {

  const dispatch = useApplicationDispatch();
  const setSearchTerm = (siteId: string, categoryName?: string) => dispatch(new SearchValueAction(siteId, categoryName));
  const searchSiteIdTrail = async (searchValue: string) => dispatch(loadTreeSiteSearchBySiteIdOrNameAsync(searchValue));

  if (currentSearchCategoryName !== props.match.params.searchCategoryName) {
    currentSearchCategoryName = props.match.params.searchCategoryName || undefined;
    if (currentSearchCategoryName && currentSearchSiteId !== props.match.params.searchSiteId) {
      currentSearchSiteId = props.match.params.searchSiteId || undefined;
      if (currentSearchSiteId) {
        setSearchTerm(currentSearchSiteId, currentSearchCategoryName);
        searchSiteIdTrail(currentSearchSiteId);
      }
    }
  } else {
    if (currentSearchSiteId !== props.match.params.searchSiteId) {
      currentSearchSiteId = props.match.params.searchSiteId || undefined;
      if (currentSearchSiteId) {
        setSearchTerm(currentSearchSiteId);
        searchSiteIdTrail(currentSearchSiteId);
      }
    }
  }
  return (
    <SiteManager activePanel='TreeView' />
  );
});

const App = withRouter((props: RouteComponentProps) => (
  <Switch>
    <Route exact path={`${props.match.path}/treeview/:searchSiteId/:searchCategoryName`} component={SiteManagerTableApplicationRouteAdapter} />
    <Route path={`${props.match.path}/treeview/:searchSiteId`} component={SiteManagerTableApplicationRouteAdapter} />
    <Route path={`${props.match.path}/treeview`} component={SiteManagerTableApplicationRouteAdapter} />
    <Route path={`${props.match.path}`} component={SiteManager} />
    <Redirect to={`${props.match.path}`} />
  </Switch>
));

export function register() {
  applicationManager.registerApplication({
    name: 'siteManager',
    icon: appIcon,
    rootActionHandler: siteManagerAppRootHandler,
    rootComponent: App,
    menuEntry: 'Site Manager',
  });
}

