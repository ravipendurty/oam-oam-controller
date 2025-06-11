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

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { RouteComponentProps } from 'react-router-dom';
import { SearchMode, TreeView, TreeViewCtorType } from '../../../../framework/src/components/material-ui/treeView';
import { renderObject } from '../../../../framework/src/components/objectDump';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { UpdateExpandedNodesAction, UpdateSelectedNodeAction, selectInventoryNodeAsyncAction, setSearchTermAction, updateInventoryTreeAsyncAction } from '../actions/inventoryTreeActions';
import { TreeDemoItem } from '../models/inventory';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: '1 0 0%',
    display: 'flex',
    flexDirection: 'row',
  },
  tree: {
    wordWrap: 'break-word',
    minWidth: '250px',
    padding: `0px ${theme.spacing(1)}`,
  },
  details: {
    flex: '5 0 0%',
    padding: `0px ${theme.spacing(1)}`,
  },
}));

const InventoryTree = TreeView as any as TreeViewCtorType<string>;

interface TreeviewComponentProps extends RouteComponentProps<{ mountId: string }> {
  isBusy: boolean;
  rootNodes: TreeDemoItem[];
  searchTerm: string;
  selectedNode: TreeDemoItem | null;
  expendedItems: TreeDemoItem[];
  updateExpendedNodes: (expendedNodes: TreeDemoItem[]) => void;
  updateInventoryTree: (mountId: string, searchTerm?: string) => void;
  selectTreeNode: (nodeId?: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}

const InventoryTreeView: React.FC<TreeviewComponentProps> = (props) => {

  const rootNodes = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.inventoryTree.rootNodes);
  const searchTerm = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.inventoryTree.searchTerm);
  const selectedNode = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.inventoryTree.selectedNode);
  const expendedItems = useSelectApplicationState((state: IApplicationStoreState) => state.inventory.inventoryTree.expandedItems);

  const dispatch = useApplicationDispatch();
  const updateExpendedNodes = (expendedNodes: TreeDemoItem[]) => dispatch(new UpdateExpandedNodesAction(expendedNodes));
  const updateInventoryTree = (mountId: string, searchTerm?: string) => dispatch(updateInventoryTreeAsyncAction(mountId, searchTerm));
  const selectTreeNode = (nodeId?: string) => nodeId ? dispatch(selectInventoryNodeAsyncAction(nodeId)) : dispatch(new UpdateSelectedNodeAction(undefined));
  const setSearchTerm = (searchTerm: string) => dispatch(setSearchTermAction(searchTerm));

  const classes = useStyles();
  const [cachedRootNodes, setCachedRootNodes] = useState<TreeDemoItem[]>([]);

  useEffect(() => {
    if (cachedRootNodes !== rootNodes) {
      setCachedRootNodes(rootNodes);
    }
  }, [cachedRootNodes, rootNodes]);

  useEffect(() => {
    return () => {
      setSearchTerm('*');
    };
  }, []);

  const scrollbar = { overflow: 'auto', paddingRight: '20px' };
  let filteredDashboardPath = `/inventory/dashboard/${props.match.params.mountId}`;
  let basePath = `/inventory/${props.match.params.mountId}`;

  return (
    <div style={scrollbar}>
      <div>
        <Breadcrumbs aria-label="breadcrumbs">
          <Link underline="hover" color="inherit" href="#" aria-label="back-breadcrumb" onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            props.history.push(filteredDashboardPath);
          }}>Back</Link>
          <Link underline="hover" color="inherit" href="#" aria-label={`${props.match.params.mountId}-breadcrumb`} onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            props.history.push(basePath);
          }}><span>{props.match.params.mountId}</span></Link>
        </Breadcrumbs>
      </div>
      <br />
      <div style={scrollbar} className={classes.root}>
        <InventoryTree className={classes.tree} items={cachedRootNodes} enableSearchBar initialSearchTerm={searchTerm} searchMode={SearchMode.OnEnter} searchTerm={searchTerm}
          onSearch={(searchTerm) => updateInventoryTree(props.match.params.mountId, searchTerm)} expandedItems={expendedItems} onFolderClick={(item) => {
            const indexOfItemToToggle = expendedItems.indexOf(item);
            if (indexOfItemToToggle === -1) {
              updateExpendedNodes([...expendedItems, item]);
            } else {
              updateExpendedNodes([
                ...expendedItems.slice(0, indexOfItemToToggle),
                ...expendedItems.slice(indexOfItemToToggle + 1),
              ]);
            }
          }}
          onItemClick={(elm) => selectTreeNode(elm.value)} />
        <div className={classes.details}>
          {selectedNode && renderObject(selectedNode, 'tree-view')}
        </div>
      </div>
    </div>
  );
};

export default InventoryTreeView;
