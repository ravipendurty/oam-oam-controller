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

import { createHashHistory } from 'history';
import { Dispatch } from '../../../../framework/src/flux/store';
import { MiddlewareArg } from '../../../../framework/src/flux/middleware';
import { Action, IActionHandler } from '../../../../framework/src/flux/action';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { SelectElementAction } from '../actions/detailsAction';

import {
  HighlightLinkAction,
  HighlightSiteAction,
  ZoomToSearchResultAction,
  AddAlarmAction,
  SetCoordinatesAction,
  SetStatistics,
  SetIconSwitchAction,
  RemoveHighlightingAction,
  ZoomToFinishedAction,
  LayerChangedAction,
  LayersLoadedAction,
  HighlightServiceAction,
  OpenLayersAction,
  OpenStatisticsAction,
  UpdateLayersVisibilityAction,
} from '../actions/mapActions';

import { Coordinate } from '../model/coordinates';
import { Site, Link, Service, Feature, DetailsTypes, isService, isSite } from '../model/topologyTypes';

import { URL_BASEPATH, OSM_STYLE } from '../config';

const LogLevel = +(localStorage.getItem('log.odlux.networkMap.mapHandler') || 0);

export type LayerItem = { name: string; displayed: boolean; base?: true };

export type MapState = {
  selectedLink: Feature | null;
  selectedSite: Feature | null;
  selectedService: Feature | null;
  zoomToElement: {
    center: Coordinate | null;
    start: Coordinate | undefined;
    end: Coordinate | undefined;
    zoom: number | undefined;
  } | null;
  alarmElement: Feature | null;
  coordinates: {
    lat: string;
    lon: string;
    zoom: string;
  };
  statistics: {
    links: string;
    sites: string;
    services: string;
    isOpen: boolean;
  };
  allowIconSwitch: boolean;
  layersContainer: {
    isOpen: boolean;
    areFurtherLayersAvailable: boolean;
    elements: LayerItem[];

  };
};

const initialState: MapState = {
  selectedLink: null,
  selectedSite: null,
  selectedService: null,
  zoomToElement: null,
  alarmElement: null,
  coordinates: {
    lat: '52.5095',
    lon: '13.3290',
    zoom: '10',
  },
  statistics: {
    links: 'Not counted yet.',
    sites: 'Not counted yet.',
    services: 'Not counted yet.',
    isOpen: true,
  },
  allowIconSwitch: true,
  layersContainer: {
    isOpen: false,
    areFurtherLayersAvailable: false,
    elements: [
      ...OSM_STYLE.layers.map(layer => ({ name: layer.id, displayed:  !layer?.layout?.visibility ||  layer?.layout?.visibility !== 'none', base: true }) as LayerItem),
      { name: 'Sites', displayed: true, base: true },
      { name: 'Links', displayed: true, base: true },
      { name: 'Services', displayed: true, base: true },
    ],
  },
};

export const MapHandler: IActionHandler<MapState> = (state = initialState, action: any) => {
  if (action instanceof HighlightLinkAction) {
    state = {
      ...state,
      selectedSite: null,
      selectedService: null,
      selectedLink: action.link.feature,
    };
  } else if (action instanceof HighlightSiteAction) {
    state = {
      ...state,
      selectedLink: null,
      selectedService: null,
      selectedSite: action.site.feature,
    };
  } else if (action instanceof HighlightServiceAction) {
    state = {
      ...state,
      selectedLink: null,
      selectedSite: null,
      selectedService: action.service.feature,
    };
  } else if (action instanceof ZoomToSearchResultAction) {
    state = {
      ...state,
      zoomToElement: {
        center: action.center,
        start: action.start,
        end: action.end,
        zoom: action.zoom,
      },
    };
  } else if (action instanceof ZoomToFinishedAction) {
    state = {
      ...state,
      zoomToElement: null,
    };
  } else if (action instanceof AddAlarmAction) {
    state = {
      ...state,
      alarmElement: action.site.feature,
    };
  } else if (action instanceof SetCoordinatesAction) {
    state = {
      ...state,
      coordinates: {
        lat: action.lat,
        lon: action.lon,
        zoom: action.zoom,
      },
    };
  } else if (action instanceof SetStatistics) {
    state = {
      ...state,
      statistics: {
        sites: action.siteCount,
        links: action.linkCount,
        services: action.serviceCount,
        isOpen: state.statistics.isOpen,
      },
    };
  } else if (action instanceof SetIconSwitchAction) {
    state = {
      ...state,
      allowIconSwitch: action.enable,
    };
  } else if (action instanceof RemoveHighlightingAction) {
    state = {
      ...state,
      selectedLink: null,
      selectedSite: null,
      selectedService: null,
    };
  } else if (action instanceof UpdateLayersVisibilityAction) {
    const newData = state.layersContainer.elements.map(el => (el.name in action.layerVisibility ? { ...el, displayed: action.layerVisibility[el.name] } : el));
    state = {
      ...state,
      layersContainer: {
        ...state.layersContainer,
        elements: newData,
      },
    };
  } else if (action instanceof LayerChangedAction) {
    const newData = state.layersContainer.elements.map(el => (el.name === action.layerName ? { ...el, displayed: action.displayed } : el));
    state = {
      ...state,
      layersContainer: {
        ...state.layersContainer,
        elements: newData,
      },
    };
  } else if (action instanceof LayersLoadedAction) {
    const data = state.layersContainer;
    const els: LayerItem[] = action.layers.map((e) => { return { name: e, displayed: false }; });
    data.elements.push(...els);
    if (els.length > 0) {
      data.areFurtherLayersAvailable = true;
    }
    state = {
      ...state,
      layersContainer: data,
    };
  } else if (action instanceof OpenLayersAction) {
    const data = state.layersContainer;
    data.isOpen = action.open;
    state = {
      ...state,
      layersContainer: data,
    };
  } else if (action instanceof OpenStatisticsAction) {
    const data = state.statistics;
    data.isOpen = action.open;
    state = {
      ...state,
      statistics: data,
    };
  }

  return state;
};

const history = createHashHistory();

const getDetailIdentifier = (data: Link | Site | Service) => {

  if (isService(data)) {
    return DetailsTypes.service;
  } else if (isSite(data)) {
    return DetailsTypes.site;
  } else {
    return DetailsTypes.link;
  }
};

const getDetailsParameter = (data: Link | Site | Service | null) => {
  let details = '';
  if (data) {
    switch (getDetailIdentifier(data)) {
      case DetailsTypes.link:
        details = `linkId=${data.id}`;
        break;
      case DetailsTypes.site:
        details = `siteId=${data.id}`;
        break;
      case DetailsTypes.service:
        details = `serviceId=${data.id}`;
        break;
    }
  }
  return details;
};

const getCoordinatesParameter = (lat: string, lon: string, zoom: string) => {
  const centerParam = lat && lat ? `center=${lat},${lon}` : '';
  const zoomParam = zoom ? `zoom=${zoom}` : '';
  return [centerParam, zoomParam].filter(e => e).join('&');
};

export const MapMiddleware = (store: MiddlewareArg<IApplicationStoreState>) => (next: Dispatch) => <A extends Action>(action: A) => {
  if (action instanceof SetCoordinatesAction) {
    
    const {
      framework: {
        navigationState,
      },
      network: {
        details: {
          data,
        },
      },
    } = store.getState();
    
    const detailsParam = getDetailsParameter(data);
    const coordinatesParam = getCoordinatesParameter(action.lat, action.lon, action.zoom);
    const url = `/${URL_BASEPATH}?${[coordinatesParam, detailsParam].filter(e => e).join('&')}`;
    if (navigationState.pathname !== url) {
      history.replace(url);
    }

    if (LogLevel > 3) {
      console.log(`MapMiddleware::SetCoordinatesAction - lat: ${action.lat} lon: ${action.lon} zoom: ${action.zoom} data: ${data}`);
    }
    
  } else if (action instanceof SelectElementAction) {
    const {
      framework: {
        navigationState,
      },
      network: {
        map: {
          coordinates,
        },
      },
    } = store.getState();
    
    
    const detailsParam = getDetailsParameter(action.data);
    const coordinatesParam = getCoordinatesParameter(coordinates.lat, coordinates.lon, coordinates.zoom);
    const url = `/${URL_BASEPATH}?${[coordinatesParam, detailsParam].filter(e => e).join('&')}`;

    if (navigationState.pathname !== url) {
      window.setTimeout(() => history.replace(url));
    }

    if (LogLevel > 3) {
      console.log(`MapMiddleware::SelectElementAction - ne: ${action.data?.feature?.properties?.layer || 'side'} id: ${action.data.id} name: ${action.data.name} coordinates: ${coordinates.lat} ${coordinates.lon} ${coordinates.zoom}`);
    }
  }
  // let all actions pass
  return next(action);
};


