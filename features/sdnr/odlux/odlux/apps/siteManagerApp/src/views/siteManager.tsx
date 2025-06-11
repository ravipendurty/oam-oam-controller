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

import React, { useState } from 'react';

import { AppBar, Tab, Tabs } from '@mui/material';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { NavigateToApplication } from '../../../../framework/src/actions/navigationActions';
import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { SearchValueAction } from '../actions/siteManagerSiteSearchAction';
import { SiteManagerTreeView } from '../components/siteManagerTreeview';
import { SiteTableView } from '../components/siteTable';


type TabId = 'SiteTable' | 'TreeView';

type DashboardComponentProps = RouteComponentProps & { activePanel: string };
const scrollbar = { overflow: 'auto' };

const SiteManagerComponent = (props: DashboardComponentProps) => {
  const [activeTab, setActiveTab] = useState(props.activePanel);
  const dispatch = useApplicationDispatch();
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path, ''));
  const setSearchTerm = (value: string) => dispatch(new SearchValueAction(value));

  React.useEffect(() => {
    if (activeTab == null) {
      setActiveTab('SiteTable');
    }
  }, []);

  const onHandleTabChange = (event: React.SyntheticEvent, value: TabId) => {
    setActiveTab(value);
  };

  const siteTableTab = () => {
    setSearchTerm('');
    return navigateToApplication('siteManager', '');
  };

  const treeViewTab = () => {
    return navigateToApplication('siteManager', 'treeview');
  };

  return (
    <>
      <AppBar enableColorOnDark position='static'>
        <Tabs indicatorColor='secondary' textColor='inherit' value={activeTab} onChange={onHandleTabChange} aria-label='site-manager-app-tabs'>
          <Tab aria-label='site-manager-table-view-tab' label='Sites' value='SiteTable' onClick={siteTableTab} />
          <Tab aria-label='site-manager-treeview-tab' label='Tree View' value='TreeView' onClick={treeViewTab} />
        </Tabs>
      </AppBar>
      {activeTab === 'SiteTable'
        ? <div style={scrollbar} aria-label='site-manager-table-view' id='siteManagerTableView' >
          <SiteTableView />
        </div>
        : activeTab === 'TreeView'
          ? <div style={scrollbar} aria-label='site-manager-treeview' id='siteManagerTreeview' >
            <SiteManagerTreeView />
          </div>
          : null}
    </>
  );
};


export const SiteManager = withRouter(SiteManagerComponent);
export default SiteManager;

