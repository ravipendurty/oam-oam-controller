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

import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { Coordinate } from '../model/coordinates';
import { BoundingBox } from '../model/boundingBox';
import { Link, Site, Service, isLink, isService, isSite } from '../model/topologyTypes';

import { dataService } from '../services/dataService';
import { URL_API } from '../config';
import { updateMapLayers } from '../services/settingsService';
import { calculateMidPoint } from '../utils/mapUtils';

export class HighlightLinkAction extends Action {
  constructor(public link: Link) {
    super();
  }
}

export class HighlightSiteAction extends Action {
  constructor(public site: Site) {
    super();
  }
}

export class HighlightServiceAction extends Action {
  constructor(public service: Service) {
    super();
  }
}

export class RemoveHighlightingAction extends Action {
}

export class ZoomToSearchResultAction extends Action {
  constructor(public center: Coordinate, public start?: Coordinate, public end?: Coordinate, public zoom?: number) {
    super();
  }
}

export class ZoomToFinishedAction extends Action {
}

export class AddAlarmAction extends Action {
  constructor(public site: Site) {
    super();
  }
}

export class RemoveAlarmAction extends Action {
  constructor(public site: Site) {
    super();
  }
}

export class SetCoordinatesAction extends Action {
  constructor(public lat: string, public lon: string, public zoom: string) {
    super();
  }
}

export class SetStatistics extends Action {
  constructor(public siteCount: string, public linkCount: string, public serviceCount: string) {
    super();
  }
}

export class SetIconSwitchAction extends Action {
  constructor(public enable: boolean) {
    super();
  }
}

export class LayerChangedAction extends Action {
  constructor(public layerName: string, public displayed: boolean, public isBaseLayer: boolean) {
    super();
  }
}

export class UpdateLayersVisibilityAction extends Action {
  constructor(public layerVisibility: { [key: string]: boolean }) {
    super();
  }
}

export class LayersLoadedAction extends Action {
  constructor(public layers: string[]) {
    super();
  }
}

export class OpenLayersAction extends Action {
  constructor(public open: boolean) {
    super();
  }
}

export class OpenStatisticsAction extends Action {
  constructor(public open: boolean) {
    super();
  }
}

export const updateLayerAsyncAction = (layerName: string, displayed: boolean, isBaseLayer = true) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  dispatcher(new LayerChangedAction(layerName, displayed, isBaseLayer));
  
  const { network: { map: { layersContainer } } } = getState();
  const newLayerSettings = layersContainer.elements.reduce((acc, layer) => {
    acc[layer.name] = layer.displayed;
    return acc;
  }, {} as { [key: string]: boolean });

  return updateMapLayers(newLayerSettings).then(() => true);
};

export const loadLayers = () => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const currentLayers = getState().network.map.layersContainer.elements;
  return dataService.getLabels().then(res => {
    const data = (res || []).filter(i => i !== 'default');
    const filteredLayers = data.filter(i => !currentLayers.find(el => el.name == i));
    dispatcher(new LayersLoadedAction(filteredLayers));
  }).then(() => true);
};

// Not used as of right now
export const findSiteToAlarm = (alarmedNodeId: string) => (dispatcher: Dispatch) => {

  fetch(URL_API + '/sites/devices/' + alarmedNodeId)
    .then(res => res.json())
    .then(result => {
      dispatcher(new AddAlarmAction(result));
    });
};

export const highlightElementAction = (data: Service | Link | Site, zoomToElement = false) => (dispatcher: Dispatch) => {
  if (isSite(data)) {
    dispatcher(new HighlightSiteAction(data));
    if (zoomToElement) {
      dispatcher(new ZoomToSearchResultAction(data.location));
    }
  } else if (isLink(data)) {
    dispatcher(new HighlightLinkAction(data));
    if (zoomToElement) {
      const midPoint = calculateMidPoint(data.siteA.lat, data.siteA.lon, data.siteB.lat, data.siteB.lon);
      const startPoint = { lat: data.siteA.lat, lon: data.siteA.lon };
      const endPoint = { lat: data.siteB.lat, lon: data.siteB.lon };
      dispatcher(new ZoomToSearchResultAction(midPoint, startPoint, endPoint));
    }
  } else if (isService(data)) {
    dispatcher(new HighlightServiceAction(data));
    if (zoomToElement) {
      const midPoint = calculateMidPoint(data.route[0].lat, data.route[0].lon, data.route[data.route.length - 1].lat, data.route[data.route.length - 1].lon);
      const startPoint = { lat: data.route[0].lat, lon: data.route[0].lon };
      const endPoint = { lat: data.route[data.route.length - 1].lat, lon: data.route[data.route.length - 1].lon };
      dispatcher(new ZoomToSearchResultAction(midPoint, startPoint, endPoint));
    }
  }
};

export const updateZoomAction = (zoom: string) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {
  const { network: { map: { coordinates: { lat, lon } } } } = getState();
  dispatcher(new SetCoordinatesAction(lat, lon, zoom));
};

export const updateStatistics = (boundingBox: BoundingBox) => (dispatcher: Dispatch, getState: () => IApplicationStoreState) => {

  const { network: { map: { statistics: { links, sites, services } } } } = getState();

  dataService.getStatistics(boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north)
    .then(result => {
      if (result) {
        // do not dispatch if data didn't change
        if (result.links !== links || result.sites !== sites || result.services !== services) {
          dispatcher(new SetStatistics(result.sites, result.links, result.services));
        }
      }
    });
};