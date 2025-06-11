/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import Typography from '@mui/material/Typography';

import { Link, Site, Service, isLink } from '../../model/topologyTypes';
import { SearchResult } from '../../model/searchResult';

type SearchResultElement = Link | Service | Site;

const createSearchDisplay = (elements: SearchResultElement[], title: string, onResultClick: (element: SearchResultElement) => void) => (
   
  elements && elements.length > 0 
    ? (
      <>
        <Typography variant="body1">Found {title}</Typography>
        <div key={title} aria-label={`search-result-for-${title}`}>
          {elements.map((element, i) => {
            // type specific info
            const linkMessage = isLink(element)
              ? element.polarization
              : '';
            return (
              <Typography
                key={`${title}-${i}`}
                onClick={() => onResultClick(element)}
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                variant="body1">
                {element.id} - {element.name ?? ''} {linkMessage} {element.feature?.properties?.layer}
              </Typography>
            );
          })}
        </div>
      </>
    ) : null
);

type SearchResultDisplayProps = {
  searchResult: SearchResult;
  onResultClick: (element: SearchResultElement) => void;
};

const SearchResultDisplay: FC<SearchResultDisplayProps> = (props) => {
  const { searchResult, onResultClick } = props;

  const displays = Object.keys(searchResult).map((el) => {
    const elements = (searchResult as any)[el];
    return createSearchDisplay(elements, el, onResultClick);
  });

  return <>{displays}</>;
};

SearchResultDisplay.displayName = 'SearchResultDisplay';

export default SearchResultDisplay;

