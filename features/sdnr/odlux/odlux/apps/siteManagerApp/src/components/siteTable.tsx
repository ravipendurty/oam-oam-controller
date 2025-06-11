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

import React, { useEffect, useState } from 'react';

import Map from '@mui/icons-material/Map';
import Refresh from '@mui/icons-material/Refresh';
import { Divider, MenuItem, Typography } from '@mui/material';

import { NavigateToApplication } from '../../../../framework/src/actions/navigationActions';
import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useSelectApplicationState, useApplicationDispatch } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { SearchValueAction } from '../actions/siteManagerSiteSearchAction';
import { createSiteTableActions, createSiteTableProperties } from '../handlers/siteTableHandler';
import { SiteDetails } from '../models/siteDetails';
import RefreshSiteTableDialog, { RefreshSiteTableDialogMode } from './refreshSiteTableDialog';


const SiteTable = MaterialTable as MaterialTableCtorType<SiteDetails>;

let initialSorted = false;

const SiteTableComponent: React.FC = () => {
  const siteTableProperties = useSelectApplicationState((state: IApplicationStoreState) => createSiteTableProperties(state));

  const dispatch = useApplicationDispatch();
  const siteTableActions = createSiteTableActions(dispatch);
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path));

  const [refreshSiteTableEditorMode, setRefreshSiteTableEditorMode] = useState<RefreshSiteTableDialogMode>(RefreshSiteTableDialogMode.None);

  const setSearchTerm = (event: React.SyntheticEvent, value: string) => dispatch(new SearchValueAction(value));

  const getContextMenu = (rowData: SiteDetails) => {
    return [
      <MenuItem aria-label={'inventory-button'} onClick={(event: React.SyntheticEvent) => {
        navigateToApplication('siteManager', '/treeview/' + rowData.id);
        setSearchTerm(event, rowData.id + '');
      }}>
        <Typography>View in Treeview</Typography>
      </MenuItem>,
      <Divider />,
      <MenuItem aria-label={'show-on-map-button'} onClick={() => {
        const siteId = rowData.id;
        const baseUrl = window.location.pathname.split('#')[0];
        const url = `${baseUrl}#/network?siteId=${siteId}`;
        window.open(url);
      }}>
        <Typography>Show on Map</Typography>
      </MenuItem>,
    ];
  };

  useEffect(() => {
    if (!initialSorted) {
      initialSorted = true;
      siteTableActions.onHandleExplicitRequestSort('id', 'asc');
    } else {
      siteTableActions.onRefresh();
    }
  }, []);

  const refreshSiteTableAction = [{
    icon: Refresh, tooltip: 'Refresh Site Table', ariaLabel: 'refresh', onClick: () => {
      setRefreshSiteTableEditorMode(RefreshSiteTableDialogMode.RefreshSiteTableTable);
    },
  },
  ...siteTableProperties.showFilter ? [{
    icon: Map, tooltip: 'Show on map', ariaLabel: 'showOnMap', onClick: async () => {
      const siteId = siteTableProperties.rows[0].id;
      const baseUrl = window.location.pathname.split('#')[0];
      const url = `${baseUrl}#/network?siteId=${siteId}`;
      window.open(url);
    },
  }] : [],
  ];

  return (
    <>
      <SiteTable stickyHeader tableId='site-table' customActionButtons={refreshSiteTableAction} columns={[
        { property: 'id', title: 'Site Id', type: ColumnType.numeric },
        { property: 'name', title: 'Site Name', type: ColumnType.text },
        { property: 'areaName', title: 'Area Name', type: ColumnType.text },
        { property: 'operationalState', title: 'operational State', type: ColumnType.text },
        { property: 'operatorId', title: 'Operator Id', type: ColumnType.text },
        { property: 'lifecycleState', title: 'life Cycle State', type: ColumnType.text },
        { property: 'forecastEnabled', title: 'Forecast Enabled', type: ColumnType.boolean },
        { property: 'alarmState', title: 'Alarm State', type: ColumnType.text },
        { property: 'latitude', title: 'Latitude', type: ColumnType.numeric },
        { property: 'longitude', title: 'Longitude', type: ColumnType.numeric },
      ]} idProperty='id' {...siteTableActions} {...siteTableProperties}
        createContextMenu={rowData => {
          return getContextMenu(rowData);
        }} >
      </SiteTable>
      <RefreshSiteTableDialog
        mode={refreshSiteTableEditorMode}
        onClose={() => setRefreshSiteTableEditorMode(RefreshSiteTableDialogMode.None)}
      />
    </>
  );
};

export const SiteTableView = SiteTableComponent;
export default SiteTableView;