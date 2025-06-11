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

import React, { FC, useEffect, useState, SyntheticEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { NavigateToApplication } from '../../../../../framework/src/actions/navigationActions';
import { useApplicationDispatch } from '../../../../../framework/src/flux/connect';

import LineOfSightMainView from '../../lineOfSight/views/lineOfSightMain';
import { TabId } from '../model/tabId';
import LinkCalculation from './linkCalculation';
import LinkTableComponent from '../components/linkTable';

type mainComponentProps = RouteComponentProps & { activePanel: string };

export const MainView: FC<mainComponentProps> = (props) => {

  const [panel, setPanel] = useState(props.activePanel);
  const dispatch = useApplicationDispatch();
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path, ''));

  // const dispatch = useApplicationDispatch();
  // const updateTab =(value:TabId) => dispatch(new UpdateTabAction(value)) 

  const changeTab = (event: SyntheticEvent, value: TabId) => {
    setPanel(value);
  };

  const linkTableTab = () => {
    navigateToApplication('microwave', '');
  };

  const calculateLinkTab = () => {
    navigateToApplication('microwave', 'calculateLink');
  };

  const lineOfSightTab = () => {
    navigateToApplication('microwave', 'lineOfSightMap');
  };

  useEffect(() => {
    if (panel == null) {
      setPanel('linkTable');
    }
  }, []);

  return (
    <>
      <AppBar position="static" enableColorOnDark >
        <Tabs onChange={changeTab} value={panel} indicatorColor="secondary" textColor="inherit">
          <Tab label="links" value="linkTable" onClick={linkTableTab} />
          <Tab label="link calculation" value="linkCalculation" onClick={calculateLinkTab} />
          <Tab label="Line of Sight" value="lineOfSight" onClick={lineOfSightTab} />
        </Tabs>
      </AppBar>
      {panel === 'linkTable'
        ? <LinkTableComponent />
        : panel === 'linkCalculation'
          ? <LinkCalculation />
          : panel === 'lineOfSight'
            ? <LineOfSightMainView />
            : null
      }
    </>
  );
};

export default withRouter(MainView);