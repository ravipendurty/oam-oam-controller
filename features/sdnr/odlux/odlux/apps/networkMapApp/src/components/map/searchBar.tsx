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

import React, { FC } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider/Divider';
import IconButton from '@mui/material/IconButton/IconButton';
import Paper from '@mui/material/Paper/Paper';
import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { Coordinate } from '../../model/coordinates';
import { Link, Site, Service, isLink, isService, isSite  } from '../../model/topologyTypes';
import { SearchResult } from '../../model/searchResult';

import { SelectElementAction } from '../../actions/detailsAction';
import { highlightElementAction, ZoomToSearchResultAction } from '../../actions/mapActions';
import { SetSearchValueAction } from '../../actions/searchAction';

import { dataService } from '../../services/dataService';
import { calculateMidPoint } from '../../utils/mapUtils';

import SearchResultDisplay from './searchResultDisplay';
import InputBase from '@mui/material/InputBase/InputBase';
import Popover from '@mui/material/Popover/Popover';
import Typography from '@mui/material/Typography/Typography';

const useStyles = makeStyles({
  searchBar: {
    padding: '2px 4px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    top: 15,
    marginLeft: 5,
    width: 400,
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


const SearchBar: FC = () => {

  const defaultSearchResult = { links: [], sites: [], services: [] };

  const searchTerm = useSelectApplicationState(state => state.network.search.value);
  const isTopoServerReachable = useSelectApplicationState(state => state.network.connectivity.isTopologyServerAvailable);
  const isTileServerReachable = useSelectApplicationState(state => state.network.connectivity.isTileServerAvailable);

  const dispatch = useApplicationDispatch();
  const selectElement = (site: Site | Link | Service) => dispatch(new SelectElementAction(site));
  const highlightElement = (data: Link | Site | Service) => dispatch(highlightElementAction(data));
  const setSearchTerm = (value: string) => dispatch(new SetSearchValueAction(value));
  const zoomToSearchResult = (center: Coordinate, start?: Coordinate, end?: Coordinate) => dispatch(new ZoomToSearchResultAction(center, start, end));

  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [searchResult, setSearchResults] = React.useState<SearchResult>(defaultSearchResult);

  const divRef: any = React.useRef();

  const handleSearchButtonClick = (e: any) => {

    setAnchorEl(null);
    if (searchTerm.length > 0) {

      const result = dataService.search(searchTerm);
      result.then((data: SearchResult) => {

        if ((data.links == null || data.links.length == 0) && (data.sites == null || data.sites.length == 0) && (data.services == null || data.services.length == 0)) {
          setAnchorEl(divRef.current);
          setSearchResults(defaultSearchResult);
          setErrorMessage('No element found.');
          // hide message after 3 sec
          window.setTimeout(() => { setAnchorEl(null); }, 3000);
        } else {
          setAnchorEl(divRef.current);
          setErrorMessage('');
          setSearchResults(data);
        }
      });

      e.preventDefault();
    }
  };

  const onSearchResultClick = (result: Site | Link | Service) => {

    selectElement(result);
    highlightElement(result);

    if (isSite(result)) {

      const center = { lat: result.location.lat, lon: result.location.lon };
      zoomToSearchResult(center);

    } else if (isLink(result)) {

      const midPoint = calculateMidPoint(result.siteA.lat, result.siteA.lon, result.siteB.lat, result.siteB.lon);
      const startPoint = { lat: result.siteA.lat, lon: result.siteA.lon };
      const endPoint = { lat: result.siteB.lat, lon: result.siteB.lon };

      zoomToSearchResult(midPoint, startPoint, endPoint);
    } else if (isService(result)) {

      const midPoint = calculateMidPoint(result.route[0].lat, result.route[0].lon, result.route[result.route.length - 1].lat, result.route[result.route.length - 1].lon);
      const startPoint = { lat: result.route[0].lat, lon: result.route[0].lon };
      const endPoint = { lat: result.route[result.route.length - 1].lat, lon: result.route[result.route.length - 1].lon };

      zoomToSearchResult(midPoint, startPoint, endPoint);
    }
    setAnchorEl(null);
  };

  const dataFound = searchResult.links && searchResult.links.length > 0 || searchResult.sites && searchResult.sites.length > 0 || searchResult.services && searchResult.services.length > 0;
  const reachable = isTopoServerReachable && isTileServerReachable;
  const open = Boolean(anchorEl);

  const styles = useStyles();
  return (
    <>
      <Paper ref={divRef} component="form" className={styles.searchBar}>
        <InputBase
          disabled={!reachable}
          className={styles.input}
          placeholder="Find sites, links or services by id or name"
          inputProps={{ 'aria-label': 'networkmap-searchbar' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.currentTarget.value)}
        />
        <Divider className={styles.divider} orientation="vertical" />
        <IconButton
          type="submit"
          className={styles.iconButton}
          aria-label="search-button"
          onClick={handleSearchButtonClick}
          size="large">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Popover open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
        <Paper style={{ width: 380, padding: 10 }}>
          {
            errorMessage
              ? <Typography variant="body1">{errorMessage}</Typography>
              : null
          }
          {
            dataFound
              ? < SearchResultDisplay searchResult={searchResult} onResultClick={onSearchResultClick} />
              : null
          }
        </Paper>
      </Popover>
    </>
  );
};

SearchBar.displayName = 'SearchBar';

export default SearchBar;