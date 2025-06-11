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
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Refresh from '@mui/icons-material/Refresh';
import { AppBar, MenuItem, Tab, Tabs, Typography } from '@mui/material';

import { NavigateToApplication } from '../../../../framework/src/actions/navigationActions';
import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { loadAllInventoryDeviceListAsync } from '../actions/inventoryDeviceListActions';
import { updateInventoryTreeAsyncAction } from '../actions/inventoryTreeActions';
import { setPanelAction } from '../actions/panelActions';
import RefreshInventoryDialog, { RefreshInventoryDialogMode } from '../components/refreshInventoryDialog';
import { createInventoryElementsActions, createInventoryElementsProperties } from '../handlers/inventoryElementsHandler';
import { InventoryType } from '../models/inventory';
import { InventoryDeviceListType } from '../models/inventoryDeviceListType';
import { PanelId } from '../models/panelId';

const InventoryTable = MaterialTable as MaterialTableCtorType<InventoryType & { _id: string }>;
const InventoryDeviceListTable = MaterialTable as MaterialTableCtorType<InventoryDeviceListType>;

let inventoryInitialSorted = false;
const InventoryComponent: React.FC<RouteComponentProps> = () => {

  const panelId = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.currentOpenPanel);
  const inventoryElementsProperties = useSelectApplicationState((state: IApplicationStoreState) => createInventoryElementsProperties(state));
  const inventoryDeviceList = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.inventoryDeviceList.inventoryDeviceList);

  const dispatch = useApplicationDispatch();
  const switchActivePanel = (panelId: PanelId) => { dispatch(setPanelAction(panelId)); };
  const inventoryElementsActions = createInventoryElementsActions(dispatch);
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path));
  const updateInventoryTree = (mountId: string, searchTerm?: string) => dispatch(updateInventoryTreeAsyncAction(mountId, searchTerm));
  const getAllInventoryDeviceList = async () => { await dispatch(loadAllInventoryDeviceListAsync); };

  const [refreshInventoryEditorMode, setRefreshInventoryEditorMode] = useState<RefreshInventoryDialogMode>(RefreshInventoryDialogMode.None);

  const onHandleTabChange = (event: React.SyntheticEvent, newValue: PanelId) => {
    onTogglePanel(newValue);
  };

  const onTogglePanel = (panelId: PanelId) => {
    const nextActivePanel = panelId;
    switchActivePanel(nextActivePanel);

    switch (nextActivePanel) {
      case 'Equipment':
        if (!inventoryInitialSorted) {
          inventoryElementsActions.onHandleExplicitRequestSort('nodeId', 'asc');
          inventoryInitialSorted = true;
        } else {
          inventoryElementsActions.onRefresh();
        }
        break;
      case 'TreeView':
        getAllInventoryDeviceList();
        break;
      case null:
        // do nothing if all panels are closed
        break;
      default:
        console.warn('Unknown nextActivePanel [' + nextActivePanel + '] in connectView');
        break;
    }
  };

  const getContextMenu = (rowData: InventoryType) => {
    return [
      <MenuItem aria-label={'inventory-button'} onClick={() => { updateInventoryTree(rowData.nodeId, rowData.uuid); navigateToApplication('inventory', rowData.nodeId); }}><Typography>View in Treeview</Typography></MenuItem>,
    ];
  };


  const refreshInventoryAction = {
    icon: Refresh,
    tooltip: 'Refresh Inventory',
    ariaLabel: 'refresh',
    onClick: () => {
      setRefreshInventoryEditorMode(RefreshInventoryDialogMode.RefreshInventoryTable);
    },
  };


  useEffect(() => {
    if (panelId === null) { //set default tab if none is set
      onTogglePanel('Equipment');
    }
  }, [panelId]);

  return (
    <>
      <AppBar enableColorOnDark position="static">
        <Tabs indicatorColor="secondary" textColor="inherit" value={panelId} onChange={onHandleTabChange} aria-label="inventory-app-tabs">
          <Tab label="Equipment" value="Equipment" aria-label="equipment-tab" />
          <Tab label="Tree View" value="TreeView" aria-label="treeview-tab" />
        </Tabs>
      </AppBar>

      {panelId === 'Equipment' && (
        <>
          <InventoryTable
            stickyHeader
            idProperty="_id"
            tableId="inventory-table"
            customActionButtons={[refreshInventoryAction]}
            columns={[
              { property: 'nodeId', title: 'Node Name' },
              { property: 'manufacturerIdentifier', title: 'Manufacturer' },
              { property: 'parentUuid', title: 'Parent' },
              { property: 'uuid', title: 'Name' },
              { property: 'serial', title: 'Serial' },
              { property: 'version', title: 'Version' },
              { property: 'date', title: 'Date' },
              { property: 'description', title: 'Description' },
              { property: 'partTypeId', title: 'Part Type Id' },
              { property: 'modelIdentifier', title: 'Model Identifier' },
              { property: 'typeName', title: 'Type' },
              { property: 'treeLevel', title: 'Containment Level' },
            ]}
            {...inventoryElementsActions}
            {...inventoryElementsProperties}
            createContextMenu={(rowData) => getContextMenu(rowData)}
          />
          <RefreshInventoryDialog mode={refreshInventoryEditorMode} onClose={() => setRefreshInventoryEditorMode(RefreshInventoryDialogMode.None)} />
        </>
      )}

      {panelId === 'TreeView' && (
        <>
          <InventoryDeviceListTable
            stickyHeader
            tableId="treeview-networkelement-selection-table"
            defaultSortColumn={'nodeId'}
            defaultSortOrder="asc"
            onHandleClick={(e, row) => {
              navigateToApplication('inventory', row.nodeId);
              updateInventoryTree(row.nodeId, '*');
            }}
            rows={inventoryDeviceList}
            asynchronus
            columns={[{ property: 'nodeId', title: 'Node Name', type: ColumnType.text }]}
            idProperty="nodeId"
          />
        </>
      )}
    </>
  );
};

export const Dashboard = withRouter(InventoryComponent);
export default Dashboard;
