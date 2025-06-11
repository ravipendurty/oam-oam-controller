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

import React, { useEffect, useRef, useState } from 'react';

import { ExpandMoreOutlined } from '@mui/icons-material';
import { default as SiteMap } from '@mui/icons-material/Map';
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Paper, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { TransitionProps } from '@mui/material/transitions';
import { makeStyles } from '@mui/styles';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { loadAllSiteDetailsBySiteIdAsync } from '../actions/sitedocManagementAction';
import { loadTreeSiteSearchBySiteIdOrNameAsync } from '../actions/siteManagerSiteSearchAction';
import {
  loadAllAreasByAreaIdAsync, loadAllCategoriesBySiteIdAsync, loadAllCategoryItemsBySiteIdAsync,
  loadAllCountriesAsync, loadAllSiteBySiteIdAsync, loadAllSitesByAreaIdAsync,
} from '../actions/siteManagerTreeActions';
import SiteManagerSiteSearch from '../components/siteManagerSiteSearch';
import {
  ITreeViewItem, SiteManagerAreas, SiteManagerCategories, SiteManagerCategoryItems,
  SiteManagerSiteOrderItemsDetails, Sites,
} from '../models/siteManager';
import CreateOrderView from '../views/OrderCreation';
import DeviceTableView from './deviceTable';
import LinkTableView from './linkTable';
import { MessageDialog } from './messageDialog';
import PicturesView from './picturesTable';
import SiteAdditionalInformation from './siteAdditionalInformation';
import SiteConfigurationComponent from './siteConfiguration';
import SiteDetailsAccordion from './siteDetails';
import SiteOrdersView from './siteOrdersTable';
import { CustomContent } from './treeItem';
import TSSReportsView from './tssReportsTable';

const styles = makeStyles({
  root: {
    flex: '1 0 0%',
    display: 'flex',
    flexDirection: 'row',
  },
  iconButton: {
    padding: 10,
  },
  paperTreeView: {
    width: '50%',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
  },
  paperDisplayView: {
    position: 'relative',
    width: '100%',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
  },
  searchParentDiv: {
    padding: '5px',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  emptyDiv: {
    width: '30%',
  },
  tree: {
    height: '700px',
    flexGrow: 1,
    maxWidth: '600px',
    overflowY: 'auto',
    overflowX: 'auto',
  },
  table: {
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'grey',
    borderStyle: 'solid',
    top: '15px',
    width: '100%',
    padding: '15px',
    'bordercollapse': 'collapse',
    'paddingbottom': '12px',
    'text-align': 'left',
    'color': 'black',
  },
  tableDetails: {
    border: '1px solid black',
    padding: '5px',
  },
  selectedSearchNode: {
    backgroundColor: '#D0CDCD',
  },
  normalNode: {
  },
  accordionTitle: {
    width: '33%', flexShrink: 0,
  },
  iconContainer: {
    position: 'absolute',
    top: '50px',
    right: '0',
    display: 'flex',
    zIndex: 1,
  },
  loadingSpinnerDisplayView: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: '50px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 9999,
  },
  loadingSpinnerTreeView: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: '350px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 9999,
  },
});
interface CategoryIdMap {
  [index: string]: ITreeViewItem;
}

type SiteManagerTreeviewComponentState = {
  nodes: ITreeViewItem[];
  expanded: string[];
  selected: string;
  parentChildMap: Map<string, string>;
  selectedSite: Sites;
  isSite: boolean;
  isCategory: boolean;
  isCategoryExpanded: boolean;
  sitesList: string[];
  treeItemName: string;
  siteManagerCategoryItems: SiteManagerCategoryItems;
  siteManagerSiteOrderItems: SiteManagerSiteOrderItemsDetails;
  categoryList: string[];
  categoryIdMap: CategoryIdMap;
  selectedCategoryLinkType: string;
  searchLeafParent: string[];
  selectedSearchItem: string;
  siteId: string;
  isDialogOpen: boolean;
  openDialog: boolean;
  dialogMessage: string;
  isFromSearch: boolean;
  isFocused: boolean;
  isReady: boolean;
  isLoadingTreeView: boolean;
  isLoadingDisplayView: boolean;
  searchSiteSelected: ITreeViewItem;
};

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0
-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q
-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562
-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t
-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682
-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375
-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className='close'
      fontSize='inherit'
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294
-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696
-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0
-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365
-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  return (
    <Collapse {...props} />
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem ContentComponent={CustomContent} {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: '#D0CDCD !important',
  },
}));

const SiteManagerTreeViewComponent: React.FC = () => {
  useSelectApplicationState((state: IApplicationStoreState) => state.siteManager);
  const dispatch = useApplicationDispatch();
  const getCountryList = async () => dispatch(loadAllCountriesAsync());
  const getAreaList = async (areaId: string) => dispatch(loadAllAreasByAreaIdAsync(areaId));
  const getSiteList = async (areaId: string) => dispatch(loadAllSitesByAreaIdAsync(areaId));
  const getCategoryList = async (siteId: string) => dispatch(loadAllCategoriesBySiteIdAsync(siteId));
  const getSiteDetailsBySiteId = async (siteId: string) => dispatch(loadAllSiteBySiteIdAsync(siteId));
  const getCategoryItemsBySiteId = async (siteId: string, categoryName: string) => dispatch(loadAllCategoryItemsBySiteIdAsync(siteId, categoryName));
  const getSiteDetailsWithContactsBySiteId = async (siteId: string) => dispatch(loadAllSiteDetailsBySiteIdAsync(siteId));
  const searchSiteIdTrail = async (searchValue: string) => dispatch(loadTreeSiteSearchBySiteIdOrNameAsync(searchValue));

  const [state, setState] = useState<SiteManagerTreeviewComponentState>({
    nodes: [],
    parentChildMap: new Map<string, string>(),
    selectedSite: {
      id: '',
      uuid: '',
      name: '',
      amslInMeters: '',
      type: '',
      'area-id': '',
      'item-count': 0,
      address: {
        streetAndNr: '',
        city: '',
        zipCode: '',
        country: '',
      },
      operator: '',
      location: {
        lon: '',
        lat: '',
      },
    },
    expanded: [],
    selected: '',
    isSite: false,
    isCategory: false,
    isCategoryExpanded: false,
    sitesList: [],
    treeItemName: '',
    siteManagerCategoryItems: [{
      name: '',
      url: '',
      'last-update': '',
    }],
    siteManagerSiteOrderItems: [{
      assignedUser: '',
      state: '',
      note: '',
      tasks: [{
        type: '',
        description: '',
        completed: false,
      }],
    }],
    categoryList: [],
    categoryIdMap: {},
    selectedCategoryLinkType: '',
    searchLeafParent: [],
    selectedSearchItem: '',
    siteId: '',
    isDialogOpen: false,
    openDialog: false,
    dialogMessage: '',
    isFromSearch: false,
    isFocused: false,
    isReady: false,
    isLoadingTreeView: false,
    isLoadingDisplayView: false,
    searchSiteSelected: {
      id: '',
      areaCount: 0,
      isCategory: false,
      isNodeSelected: false,
      isSite: false,
      name: '',
      parentId: '',
      siteCount: 0,
    },
  });

  const treeRef = useRef<HTMLUListElement>(null);
  const categoriesWithDownloadOption = ['mtssr', 'order', 'Pictures'];
  const categoriesForTables = ['microwave', 'node', 'fibre'];
  const classes = styles();
  const MAX_SITES_COUNT = 100;

  const categoriesIdDisplayNameMap = new Map<string, string>([
    ['order', 'Site Orders'],
    ['mtssr', 'TSS-Reports'],
    ['Pictures', 'Photos'],
    ['node', 'Nodes'],
    ['fibre', 'Optical Links'],
    ['microwave', 'MW Links'],
  ]);

  const categoriesDisplayNameIdMap = new Map<string, string>([
    ['Site Orders', 'order'],
    ['TSS-Reports', 'mtssr'],
    ['Photos', 'Pictures'],
    ['Nodes', 'node'],
    ['Optical Links', 'fibre'],
    ['MW Links', 'microwave'],
  ]);

  /**
  * Function to get the reverse trail of parents to help find the right trail
  * to append or identify the parent for a child/the children
  */
  const getTrail = (nodeId: string, trail: string[]) => {
    trail.push(nodeId);
    if (state.parentChildMap.has(nodeId.toString())) {
      const superParentId = state.parentChildMap.get(nodeId.toString()) + '';
      getTrail(superParentId, trail);
    }
  };

  /**
  * Function to add the sites to a given area
  */
  const addSiteToLeafArea = (nodes: ITreeViewItem[], site: ITreeViewItem) => {
    for (let iter = 0; iter < nodes.length; iter++) {
      const node = nodes[iter];
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      node.children ? node.children : node.children = [];
      if (node.id === site.parentId) {
        node.children.push(site);
        state.parentChildMap.set(site.id.toString(), node.id.toString());
        break;
      } else {
        addSiteToLeafArea(node.children, site);
      }
    }
  };

  /**
  * Add tree items of sites under area
  */
  const addTreeItemSites = (parentId: string, sites: Sites[]) => {
    const maxSize = sites.length <= MAX_SITES_COUNT ? sites.length : MAX_SITES_COUNT;
    const siteCountTotal = sites.length;
    if (sites.length > MAX_SITES_COUNT) {
      window.alert(`There are ${siteCountTotal} sites in this area, showing just ${MAX_SITES_COUNT} sites`);
    }
    const nodes: ITreeViewItem[] = [];
    for (var iter = 0; iter < maxSize; iter++) {
      const site = sites[iter];
      let node: ITreeViewItem = {
        id: site.id.toString(),
        name: site.id,
        isSite: true,
        isCategory: false,
        parentId: parentId,
        siteCount: site['item-count'],
        areaCount: 0,
        isNodeSelected: false,
      };
      state.sitesList.push(site.id.toString());
      state.parentChildMap.set(node.id.toString(), node.parentId.toString());
      nodes.push(node);
    }
    return nodes;
  };

  /**
  * Add categories to site in the tree items
  */
  const addTreeItemCategories = (siteId: string, categories: SiteManagerCategories[]) => {
    const nodes: ITreeViewItem[] = categories.map(category => {
      const categoryId: string = category.id;
      const categoryName: string = categoriesIdDisplayNameMap.get(category.id) + '';
      let node: ITreeViewItem = {
        id: siteId + '#' + categoryId,
        name: categoryName,
        isSite: false,
        isCategory: true,
        parentId: siteId,
        siteCount: 0,
        areaCount: 0,
        isNodeSelected: false,
      };
      state.categoryIdMap[node.id] = node;
      state.categoryList.push(node.id);
      state.parentChildMap.set(node.id.toString(), siteId.toString());
      return node;
    });
    return nodes;
  };

  /**
  * Add tree items of areas under area
  */
  const addTreeItemAreas = (areas: SiteManagerAreas[], isSearch?: boolean,
    selectedSite?: string, searchValue?: string): ITreeViewItem[] => {
    const nodes: ITreeViewItem[] = areas.map(area => {
      let node: ITreeViewItem = {
        id: area.id.toString(),
        name: area.name,
        isSite: false,
        isCategory: false,
        treeLevel: area['tree-level'],
        parentId: area['parent-id'] + '',
        areaCount: area['area-count'] ? area['area-count'] : 0,
        siteCount: area['site-count'] ? area['site-count'] : 0,
        siteLevel: area['site-level'],
        isNodeSelected: false,
      };
      if (area['parent-id']) {
        state.parentChildMap.set(node.id.toString(), node.parentId.toString());
      }
      if (isSearch) {
        state.expanded.push(area.id.toString());
        // eslint-disable-next-line no-param-reassign
        selectedSite = area.id == searchValue ? area.id.toString() : '';
        if (area.areas) {
          node.children = addTreeItemAreas(area.areas, isSearch, selectedSite, searchValue);
        } else {
          state.searchLeafParent.push(area.id.toString());
        }
      }
      return node;
    });
    return nodes;
  };

  const setOpenDialog = async (openDialog: boolean, dialogMessage: string, isFromSearch: boolean) => {
    setState({
      ...state,
      openDialog: openDialog,
      dialogMessage: dialogMessage,
      isFromSearch: isFromSearch,
    });
  };

  /**
  * Function to append children to the right parent node by navigating through the tree list
  */
  const appendChildrenToParentObject = async (nodes: ITreeViewItem[], trail: string[], forceUpdateChildren: boolean) => {
    const searchId = trail.pop();
    if (searchId === undefined)
      return nodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if ((node.id.toString()) == searchId) {
        if (node.isSite && forceUpdateChildren) {
          node.children = [];
        }
        const children = node.children ? node.children : [];
        if (children.length > 0) {
          await appendChildrenToParentObject(children, trail, forceUpdateChildren);
        } else {
          if (node.siteLevel && node.areaCount == 0) {
            await getSiteList(searchId).then((sitesList: any) => {
              if (sitesList.isError) {
                setOpenDialog(true, sitesList.errorMessage, false);
                return;
              }
              const childNodes = addTreeItemSites(searchId, sitesList.sites);
              node.children = childNodes;
            });
          } else if (node.isSite) {
            await getCategoryList(searchId).then((categories: any) => {
              const childNodes = addTreeItemCategories(searchId, categories);
              node.children = childNodes;
            });
          } else if (!node.isCategory) {
            await getAreaList(searchId).then((areas: any) => {
              const childNodes = addTreeItemAreas(areas);
              node.children = childNodes;
            });
          }
        }
        break;
      }
    }
    return nodes;
  };

  /**
  * Function to expand or collapse tree item
  * If child items are not loaded, it calls the async function to load the child items
  */
  const toggleTreeItems = async (nodeId: string, expanded: boolean) => {
    const strNodeId: string = nodeId.toString();
    const trail: string[] = [];
    if (expanded) {
      const expandedTree = state.expanded.filter(item => item !== strNodeId);
      setState({
        ...state,
        expanded: expandedTree,
        isFocused: false,
      });
      return;
    }
    getTrail(strNodeId, trail);
    await appendChildrenToParentObject(state.nodes, trail, false).then((nodes) => {
      setState({
        ...state,
        nodes: nodes,
        isFocused: false,
      });
      state.expanded.push(strNodeId);
    });
  };

  /**
  * Clear selected item during search
  */
  const clearSelection = async (nodes: ITreeViewItem[], trail: string[], selectedItem: string) => {
    const searchId = trail.pop();
    if (searchId === undefined)
      return;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === searchId) {
        if (searchId == selectedItem) {
          setState({
            ...state,
            selectedSearchItem: '',
            isFocused: false,
          });
          node.isNodeSelected = false;
          return;
        }
        const children = node.children ? node.children : [];
        if (children.length > 0) {
          clearSelection(children, trail, selectedItem);
        }
        return;
      }
    }
  };

  /**
  * Function to retrieve the details of site or category on click of the tree item
  */
  const retrieveDetails = async (siteId: string, isCallFromSearch: boolean) => {
    const selectedSearchItem = state.selectedSearchItem + '';
    if (!isCallFromSearch && (selectedSearchItem.length > 0)) {
      const trail: string[] = [];
      getTrail(state.selectedSearchItem, trail);
      await clearSelection(state.nodes, trail, state.selectedSearchItem);
    }
    const returnedSiteValue = state.sitesList.find(site => site.toString() == siteId.toString());
    if (returnedSiteValue && state.selectedSite.id != returnedSiteValue) {
      const trail: string[] = [];
      getTrail(siteId + '', trail);
      await appendChildrenToParentObject(state.nodes, trail, true).then((nodes) => {
        setState({ ...state, nodes: nodes });
        state.expanded.push(siteId + '');
      });
      await getSiteDetailsBySiteId(siteId).then((site: any) => {
        setState({
          ...state,
          selectedSite: site,
          isSite: true,
          isCategory: false,
          isCategoryExpanded: false,
          isLoadingDisplayView: false,
          treeItemName: site.name,
          selected: site.id,
        });
      });
    } else if (state.selectedSite.id == returnedSiteValue) {
    } else {
      const returnedCategoryValue = state.categoryList.find((category) => category === siteId);
      if (returnedCategoryValue) {
        const ids = siteId.split('#');
        if (state.selectedSite.id != ids[0]) {
          await getSiteDetailsBySiteId(ids[0]).then((site: any) => {
            setState({
              ...state,
              selectedSite: site,
              isSite: true,
              isLoadingDisplayView: false,
              treeItemName: site.name,
            });
          });
          const trail: string[] = [];
          getTrail(siteId + '', trail);
          appendChildrenToParentObject(state.nodes, trail, true).then((nodes) => {
            setState({ ...state, nodes: nodes });
            state.expanded.push(siteId + '');
          });
        }
        if (categoriesWithDownloadOption.includes(ids[1])) {
          await getCategoryItemsBySiteId(ids[0], ids[1]).then(async (categoryItems: any) => {
            const categoryName = categoriesIdDisplayNameMap.get(ids[1]) + '';
            if (categoryName.includes('Site Orders')) {
              await getSiteDetailsWithContactsBySiteId(siteId).then((siteOrderItems: any) => {
                setState({
                  ...state,
                  isCategory: true,
                  isCategoryExpanded: true,
                  siteManagerCategoryItems: categoryItems,
                  siteManagerSiteOrderItems: siteOrderItems,
                  treeItemName: categoryName,
                  selected: siteId,
                  selectedCategoryLinkType: '',
                });
              });
            } else {
              setState({
                ...state,
                isCategory: true,
                isCategoryExpanded: true,
                siteManagerCategoryItems: categoryItems,
                treeItemName: categoryName,
                selected: siteId,
                selectedCategoryLinkType: '',
              });
            }
          });
        } else if (categoriesForTables.includes(ids[1])) {
          // const selectedCategory = state.categoryIdMap[siteId];
          const categoryName = categoriesIdDisplayNameMap.get(ids[1]) + '';
          setState({
            ...state,
            isCategory: true,
            isCategoryExpanded: true,
            treeItemName: categoryName,
            selected: siteId,
            selectedCategoryLinkType: ids[1] ? ids[1] : '',
          });
        }
      } else {
        setState({
          ...state,
          selectedSite: {
            id: '',
            uuid: '',
            name: '',
            amslInMeters: '',
            type: '',
            'area-id': '',
            'item-count': 0,
            address: {
              streetAndNr: '',
              city: '',
              zipCode: '',
              country: '',
            },
            operator: '',
            location: {
              lon: '',
              lat: '',
            },
          },
          isSite: false,
          isCategory: false,
          isCategoryExpanded: false,
          siteManagerCategoryItems: [{
            name: '',
            url: '',
            'last-update': '',
          }],
          treeItemName: '',
          selected: '',
          selectedSearchItem: '',
          selectedCategoryLinkType: '',
          isFocused: false,
          isReady: false,
          isLoadingDisplayView: false,
        });
      }
    }
  };

  /**
  * Function to render the expandable tree item or leaf tree item
  */
  const renderChildren = (node: ITreeViewItem) => {
    const strNodeId = node.id.toString();
    return node.isCategory || node.isSite && node.siteCount == 0 || node.siteLevel && node.siteCount == 0 ||
      !node.isSite && !node.siteLevel && node.areaCount == 0 ?
      (
        <StyledTreeItem className={'node-id-selector-' + strNodeId} key={strNodeId} nodeId={strNodeId} label={node.name}
          ContentProps={{
            toggleTreeItems: toggleTreeItems,
            retrieveDetails: retrieveDetails,
            isNodeSelected: node.isNodeSelected,
          } as any}
          expandIcon={<PlusSquare />} endIcon={<CloseSquare />} >
          {Array.isArray(node.children)
            ? node.children.map((child) => renderChildren(child))
            : null}
        </StyledTreeItem>
      )
      : (
        <StyledTreeItem className={'node-id-selector-' + strNodeId} key={strNodeId} nodeId={strNodeId} label={node.name}
          ContentProps={{
            toggleTreeItems: toggleTreeItems,
            retrieveDetails: retrieveDetails,
            isNodeSelected: node.isNodeSelected,
          } as any}
          expandIcon={<PlusSquare />} endIcon={<PlusSquare />}>
          {Array.isArray(node.children)
            ? node.children.map((child) => renderChildren(child))
            : null}
        </StyledTreeItem>
      );
  };

  /**
  * Function to scroll and Focus on the searched item on click of search
  */
  const scrollAndFocus = (searchValue: string) => {
    if (state.isReady && searchValue && searchValue !== '') {
      const matchingNode = treeRef.current?.querySelector(`[id="site-manager-treeview-${searchValue}"]`);
      if (matchingNode) {
        state.isFocused = true;
        state.isReady = false;
        matchingNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  /**
  * Function to handle on click of search
  */
  const handleSearch = async (event: React.SyntheticEvent, searchValue: string, searchCategoryName?: string) => {
    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      nodes: [],
      parentChildMap: new Map<string, string>(),
      selectedSite: {
        id: '',
        uuid: '',
        name: '',
        amslInMeters: '',
        type: '',
        'area-id': '',
        'item-count': 0,
        address: {
          streetAndNr: '',
          city: '',
          zipCode: '',
          country: '',
        },
        operator: '',
        location: {
          lon: '',
          lat: '',
        },
      },
      expanded: [],
      selected: '',
      isSite: false,
      isCategory: false,
      isCategoryExpanded: false,
      searchLeafParent: [],
      treeItemName: '',
      categoryIdMap: {},
      selectedCategoryLinkType: '',
      selectedSearchItem: '',
      siteId: '',
      isDialogOpen: false,
      isFocused: false,
      isReady: false,
      isLoadingTreeView: true,
      searchSiteSelected: {
        id: '',
        areaCount: 0,
        isCategory: false,
        isNodeSelected: false,
        isSite: false,
        name: '',
        parentId: '',
        siteCount: 0,
      },
    }));
    await searchSiteIdTrail(searchValue).then(async (searchResult: any) => {
      if (searchResult.isError) {
        // alert(searchResult.errorMessage);
        setOpenDialog(true, searchResult.errorMessage, true);
        return;
      }
      let selected: string = '';
      let selectedSearchItem = '';
      const areas = searchResult.areas ? searchResult.areas : [];
      const nodes = await addTreeItemAreas(areas, true, selected, searchValue);
      const sites = searchResult.sites ? searchResult.sites : [];
      let searchSiteSelected = state.searchSiteSelected;
      if (sites.length > 0) {
        let sitesCount = sites.length;
        if (sites.length > MAX_SITES_COUNT) {
          window.alert('There are more than 100 Sites in this area of searched site, showing first 100');
          sitesCount = MAX_SITES_COUNT;
        }
        for (let iter = 0; iter < sitesCount; iter++) {
          const siteItr = sites[iter];
          let isNodeSelected = false;
          if (siteItr.id == searchValue) {
            selected = siteItr.id;
            selectedSearchItem = siteItr.id;
            isNodeSelected = true;
          }
          if (siteItr.name) {
            if (siteItr.name.toUpperCase() == searchValue.toUpperCase()) {
              selected = siteItr.id;
              selectedSearchItem = siteItr.id;
              isNodeSelected = true;
            }
          }
          const site: ITreeViewItem = {
            id: siteItr.id,
            name: siteItr.id,
            isSite: true,
            isCategory: false,
            parentId: siteItr['area-id'],
            siteCount: siteItr['item-count'],
            areaCount: 0,
            isNodeSelected: isNodeSelected,
          };
          if (isNodeSelected)
            searchSiteSelected = site;
          state.sitesList.push(site.id);
          addSiteToLeafArea(nodes, site);
        }
      }
      state.nodes = nodes;
      state.selected = selected;
      state.selectedSearchItem = selectedSearchItem;
      state.isReady = true;
      state.isLoadingTreeView = false;
      state.isLoadingDisplayView = true;
      state.searchSiteSelected = searchSiteSelected;
    });
    await retrieveDetails(state.selected, true);
    if (searchCategoryName && categoriesDisplayNameIdMap.get(searchCategoryName)) {
      const categoryId = state.selected + '#' + categoriesDisplayNameIdMap.get(searchCategoryName);
      setState((prevState) => ({
        ...prevState,
        selected: categoryId,
      }));
      await retrieveDetails(categoryId, true);
      state.searchSiteSelected.isNodeSelected = false;
      state.categoryIdMap[categoryId].isNodeSelected = true;
      await scrollAndFocus(categoryId);
    }
    scrollAndFocus(state.selectedSearchItem);
  };

  /**
  * Function to refresh the site manager view to its initial state
  */
  const handleRefresh = async () => {
    setState({
      ...state,
      nodes: [],
      parentChildMap: new Map<string, string>(),
      expanded: [],
      selected: '',
      isSite: false,
      isCategory: false,
      isCategoryExpanded: false,
      sitesList: [],
      categoryList: [],
      categoryIdMap: {},
      selectedSite: {
        id: '',
        uuid: '',
        name: '',
        amslInMeters: '',
        type: '',
        'area-id': '',
        'item-count': 0,
        address: {
          streetAndNr: '',
          city: '',
          zipCode: '',
          country: '',
        },
        operator: '',
        location: {
          lon: '',
          lat: '',
        },
      },
      siteManagerCategoryItems: [{
        name: '',
        url: '',
        'last-update': '',
      }],
      searchLeafParent: [],
      treeItemName: '',
      selectedCategoryLinkType: '',
      siteId: '',
      isDialogOpen: false,
      openDialog: false,
      dialogMessage: '',
      isFromSearch: false,
      isFocused: false,
      isReady: false,
    });
    await getCountryList().then((countries: any) => {
      const nodes = addTreeItemAreas(countries);
      setState({
        ...state,
        nodes: nodes,
        isFocused: false,
      });
    });
  };

  /**
  * Function to open the Create TSS report dialog on click of the button in Site Actions category
  */
  const onOpenCreateTSSReportOrderDialog = () => {
    setState({
      ...state,
      isDialogOpen: true,
    });
  };
  /**
  * Function to open the Close Create TSS report dialog in Site Actions category
  */
  const onCloseCreateTSSReportOrderDialog = async () => {
    const siteIdItem = state.selected.toString();
    const selectedSiteId = siteIdItem.split('#')[0] + '';
    const trail: string[] = [];
    getTrail(selectedSiteId, trail);
    await appendChildrenToParentObject(state.nodes, trail, true).then((nodes) => {
      setState({ ...state, nodes: nodes });
      state.expanded.push(selectedSiteId);
    });
    setState({
      ...state,
      siteId: '',
      isDialogOpen: false,
    });
  };

  const handleOnCloseOfDialog = (event: React.SyntheticEvent, isFromSearch: boolean) => {
    setOpenDialog(false, '', isFromSearch);
    if (isFromSearch)
      handleRefresh();
  };

  const onError = () => {
    setState({
      ...state,
      siteId: '',
      isDialogOpen: false,
    });
  };

  /**
  * On initial load/mount of site manager application
  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries: any = await getCountryList();
        const nodes = addTreeItemAreas(countries);
        setState(prevState => ({
          ...prevState,
          nodes: nodes,
          isFocused: false,
        }));
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.root}>
        <Paper className={classes.paperTreeView}>
          <div className={classes.searchParentDiv}>
            <div className={classes.emptyDiv}></div>
            {state.isLoadingTreeView && (
              <div className={classes.loadingSpinnerTreeView}>
                <CircularProgress style={{ color: '#2596be' }} />
              </div>
            )}
            <SiteManagerSiteSearch
              handleRefresh={handleRefresh}
              handleSearch={handleSearch}
            />
          </div>
          <div style={{ display: 'contents' }}>
            {state.selected.length > 0 ?
              <TreeView
                ref={treeRef}
                className={classes.tree}
                id="site-manager-treeview"
                aria-label="controlled"
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                defaultExpanded={state.expanded}
                expanded={state.expanded}
              >
                {state.nodes.map((item) => renderChildren(item))}
              </TreeView>
              : <TreeView
                ref={treeRef}
                className={classes.tree}
                id="site-manager-treeview"
                aria-label="controlled"
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                defaultExpanded={state.expanded}
                expanded={state.expanded}
              >
                {state.nodes.map((item) => renderChildren(item))}
              </TreeView>
            }
          </div>
        </Paper>
        <Paper className={classes.paperDisplayView}>
          <div>
            {state.isLoadingDisplayView ? (
              <div className={classes.loadingSpinnerDisplayView}>
                <CircularProgress style={{ color: '#2596be' }} />
              </div>
            ) : (
              <>
                {state.isSite ?
                  <div>
                    <Accordion aria-label="site-details-accordion" defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-label="site-details-panel-header"
                        id="site-detail-panel-header"
                      >
                        <Typography className={classes.accordionTitle} aria-label="site-details-panel-label">Site Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails aria-label="site-details-panel-details">
                        <div className={classes.iconContainer}>
                          <IconButton
                            aria-label={'treeview-show-on-map-button'}
                            onClick={() => {
                              const networkMapBaseUrl = window.location.pathname.split('#')[0];
                              const siteId = state.selectedSite.id + '';
                              const url = `${networkMapBaseUrl}#/network?siteId=${siteId}`;
                              window.open(url);
                            }}
                          >
                            <SiteMap />
                          </IconButton>
                        </div>
                        <SiteDetailsAccordion siteDetails={state.selectedSite} />
                      </AccordionDetails>
                    </Accordion>
                    <Accordion aria-label="site-configuration-accordion">
                      <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-label="site-configuration-panel-header"
                        id="site-detail-panel-header"
                      >
                        <Typography className={classes.accordionTitle} aria-label="site-configuration-panel-label">Site Configuration</Typography>
                      </AccordionSummary>
                      <AccordionDetails aria-label="site-details-panel-details">
                        <SiteConfigurationComponent siteId={state.selectedSite.id} />
                      </AccordionDetails>
                    </Accordion>
                    <Accordion aria-label="site-actions-accordion">
                      <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-label="site-action-panel-header"
                        id="site-detail-panel-header"
                      >
                        <Typography className={classes.accordionTitle} aria-label="site-actions-panel-label">Site Actions</Typography>
                      </AccordionSummary>
                      <AccordionDetails aria-label="site-actions-panel-details">
                        <div>
                          <Button
                            onClick={() => onOpenCreateTSSReportOrderDialog()}
                            aria-label='create-TSS-report-button' variant='contained' color='primary'
                          >
                            Create TSS-report Order
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion aria-label="site-additional-information-accordion">
                      <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-label="site-additional-information-panel-header"
                        id="site-additional-information-panel-header"
                      >
                        <Typography className={classes.accordionTitle} aria-label="site-additional-information-panel-label">Site Additional Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails aria-label="site-additional-information-panel-details">
                        <SiteAdditionalInformation siteId={state.selectedSite.id} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                  : <></>}
                {state.isCategory ?
                  <Accordion aria-label="links-accordion" defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreOutlined />}
                      aria-label="links-panel-header"
                      id="location-panel-header"
                    >
                      <Typography className={classes.accordionTitle} aria-label="links-panel-label">Category Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails aria-label="links-panel-details">
                      <table className={classes.table}>
                        <tbody>
                          <tr>
                            <th colSpan={2}>{state.treeItemName}</th>
                          </tr>
                          <tr className={classes.tableDetails}>
                            <td className={classes.tableDetails}>
                              <>
                                {state.treeItemName.includes('TSS') ?
                                  <TSSReportsView item={state.siteManagerCategoryItems} />
                                  : state.treeItemName.includes('Site Orders') ?
                                    <SiteOrdersView siteOrderItems={state.siteManagerCategoryItems} siteOrderItemDetails={state.siteManagerSiteOrderItems} />
                                    : state.treeItemName.includes('Photos') ?
                                      <PicturesView item={state.siteManagerCategoryItems} />
                                      : state.treeItemName.includes('Links') ?
                                        <LinkTableView preFilterType={{ id: state.selectedSite.id, type: state.selectedCategoryLinkType }} />
                                        : state.treeItemName === 'Nodes' ?
                                          <DeviceTableView preFilterType={{ id: state.selectedSite.id }} />
                                          : <></>
                                }
                              </>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionDetails>
                  </Accordion>
                  : <></>}
              </>
            )}
          </div>
        </Paper>
        {state.isDialogOpen ? (
          <CreateOrderView
            siteId={state.selected}
            onClose={onCloseCreateTSSReportOrderDialog}
            onError={onError}
          />
        ) : <></>}
        <MessageDialog
          openDialog={state.openDialog}
          setOpenDialog={(value: any) => setState({ ...state, openDialog: value })}
          dialogMessage={state.dialogMessage}
          onClose={handleOnCloseOfDialog}
          isFromSearch={state.isFromSearch}
        />
      </div>
    </div>
  );
};

export const SiteManagerTreeView = SiteManagerTreeViewComponent;
export default SiteManagerTreeView;