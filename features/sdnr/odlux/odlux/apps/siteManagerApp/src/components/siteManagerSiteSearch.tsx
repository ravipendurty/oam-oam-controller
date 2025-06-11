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

import React, { useRef } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { NavigateToApplication } from '../../../../framework/src/actions/navigationActions';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { SearchValueAction } from '../actions/siteManagerSiteSearchAction';

const styles = makeStyles({
  root: {
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    zIndex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 5,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});
interface SearchProps {
  handleRefresh: (event: React.SyntheticEvent) => void;
  handleSearch: (event: React.SyntheticEvent, searchValue: string, searchCategoryName?: string) => void;
}

type SiteManagerSiteSearchProps = SearchProps;

const SiteManagerSiteSearch: React.FunctionComponent<SiteManagerSiteSearchProps> = (props) => {
  const classes = styles();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchTerm = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.searchSite.siteId);
  const searchCategoryName = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.searchSite.categoryName);

  const dispatch = useApplicationDispatch();
  const setSearchTerm = (siteId: string, categoryName?: string) => dispatch(new SearchValueAction(siteId, categoryName));
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path));


  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }, []);


  const handleClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (searchCategoryName && searchCategoryName.length > 0) {
      navigateToApplication('siteManager', 'treeview/' + searchTerm + '/' + searchCategoryName);
      if (searchTerm.length > 0) {
        await props.handleSearch(event, searchTerm, searchCategoryName);
      }
    } else {
      navigateToApplication('siteManager', 'treeview/' + searchTerm);
      if (searchTerm.length > 0) {
        await props.handleSearch(event, searchTerm);
      }
    }
  };

  const handleRefresh = async (event: React.SyntheticEvent) => {
    setSearchTerm('');
    await props.handleRefresh(event);
    event.preventDefault();
  };

  return <>
    <Paper component='form' className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder='Find sites by ID or Name'
        inputProps={{ 'aria-label': 'site-manager-searchBar' }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.currentTarget.value)}
      />
      <Divider className={classes.divider} orientation='vertical' />
      <IconButton ref={buttonRef}
        type='submit'
        className={classes.iconButton}
        aria-label='site-manager-siteSearch-button'
        onClick={handleClick}
        size='large'>
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation='vertical' />
      <IconButton
        type='submit'
        className={classes.iconButton}
        aria-label='site-manager-restore-button'
        onClick={handleRefresh}
        size='large'>
        <SettingsBackupRestoreIcon />
      </IconButton>
    </Paper>
  </>;
};

export default SiteManagerSiteSearch;