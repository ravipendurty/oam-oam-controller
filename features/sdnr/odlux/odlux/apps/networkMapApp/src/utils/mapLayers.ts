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

import { Feature } from '../model/topologyTypes';
import { ThemeElement } from '../model/settings';
import { CirclePaintProps, LinePaintProps } from './mapUtils';

class MapLayerService {

  availableThemes: ThemeElement[];

  selectedTheme: string | null = null;

  iconLayersActive = false;

  public addBaseSources = (map: maplibregl.Map, selectedPoint: Feature | null, selectedLine: Feature | null, selectedService: Feature | null) => {

    // make sure the sources don't already exist
    // (if the networkmap app gets opened quickly within short time periods, the prior sources might not be fully removed)

    if (!map.getSource('lines')) {
      map.addSource('lines', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }

    if (!map.getSource('services')) {

      map.addSource('services', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }

    if (!map.getSource('selectedLine')) {

      const selectedElement = selectedLine || selectedService;
      const features = selectedElement !== null ? [selectedElement] : [];
      map.addSource('selectedLine', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features },
      });
    }

    if (!map.getSource('points')) {
      map.addSource('points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }

    if (!map.getSource('selectedPoints')) {
      const selectedPointFeature = selectedPoint !== null ? [selectedPoint] : [];
      map.addSource('selectedPoints', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: selectedPointFeature },

      });
    }
  };

  public addCircleLayer = (map: maplibregl.Map, id: string, source: string, paint: CirclePaintProps, filter: any) => {

    map.addLayer({
      id: id,
      source,
      type: 'circle',
      paint,
      filter,
    });
  };

  public addLineLayer = (map: maplibregl.Map, id: string, source: string, paint: LinePaintProps, filter: any, isDashed?: boolean) => {

    const layer: any = {
      id: id,
      type: 'line',
      source,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint, 
      filter,
    };

    if (isDashed) {
      layer.paint['line-dasharray'] = [2, 1];
    }

    map.addLayer(layer);
  };

  public addBaseLayers = (map: maplibregl.Map) => {

    this.addCommonLayers(map);
  };

  public addIconLayers = (map: maplibregl.Map) => {

    this.iconLayersActive = true;
    this.addCommonLayers(map);
    this.createIconLayers(map);
  };

  public removeBaseLayers = (map: maplibregl.Map) => {

    map.removeLayer('points');
    map.removeLayer('lines');
    map.removeLayer('services');
    map.removeLayer('selectedPoints');
    map.removeLayer('selectedLine');
    map.removeLayer('selectedServices');
  };

  public showIconLayers = (map: maplibregl.Map, show: boolean) => {

    const zoom = map.getZoom();
    if (show) {
      if (zoom > 11) {
        if (!this.iconLayersActive) {
          this.iconLayersActive = true;
          if (map.getLayer('points') !== undefined && map.getLayer('point-lamps') === undefined) {
            this.createIconLayers(map);
          }
        }
      } else {
        if (this.iconLayersActive)
          this.swapLayersBack(map);
      }
    } else {
      if (this.iconLayersActive)
        this.swapLayersBack(map);
    }
  };

  public swapLayersBack = (map: maplibregl.Map) => {
    this.iconLayersActive = false;
    this.removeIconLayers(map);

    if (map.getLayer('selectedPoints')) {
      map.setFilter('selectedPoints', null);
    }

    if (map.getLayer('points')) {
      map.setFilter('points', null);
    }
  };

  public changeMapOpacity = (map: maplibregl.Map, newValue: number) => {
    const newOpacity = newValue / 100;
    if (map) {
      const tiles = map.getStyle().layers?.filter(el => el.id.includes('tiles'));
      tiles?.forEach(layer => {
        if (layer.type === 'symbol') {
          map.setPaintProperty(layer.id, 'icon-opacity', newOpacity);
          map.setPaintProperty(layer.id, 'text-opacity', newOpacity);
        } else {
          map.setPaintProperty(layer.id, `${layer.type}-opacity`, newOpacity);
        }
      });
    }
  };

  public changeTheme = (map: maplibregl.Map, themeName: string) => {
    this.selectedTheme = themeName;
    const theme = this.pickTheme();
    if (theme && map.loaded()) {
      map.setPaintProperty('points', 'circle-color', theme.site);
      map.setPaintProperty('selectedPoints', 'circle-color', theme.selectedSite);
      map.setPaintProperty('microwave-lines', 'line-color', theme.microwaveLink);
      map.setPaintProperty('fibre-lines', 'line-color', theme.fiberLink);

    }
  };

  public addLayersToMap(pMap: maplibregl.Map, furtherLayerNames: string[]) {
    const theme = this.pickTheme();
    const furtherLayersTheme = theme?.furtherLayers || {};
    furtherLayerNames.forEach(el => {
      const layerTheme = furtherLayersTheme[el] ;
      const sitePaint: CirclePaintProps = {
        'circle-color': '#8F00FF',
        'circle-radius': 6,
        ...layerTheme?.site ?? {},
      };

      const linksPaint: LinePaintProps = {
        'line-color': '#8F00FF',
        'line-width': 2,
        ...layerTheme?.link ?? {},
      };

      const servicesPaint: LinePaintProps = {
        'line-color': '#8F00FF',
        'line-width': 2,
        ...layerTheme?.service ?? {},
      };

      this.addCircleLayer(pMap, el, 'points', sitePaint, ['in', el, ['get', 'labels']]);
      this.addLineLayer(pMap, `${el}-links`, 'lines', linksPaint, ['in', el, ['get', 'labels']]);
      this.addLineLayer(pMap, `${el}-services`, 'services', servicesPaint, ['in', el, ['get', 'labels']]);
    });
  }

  private createIconLayers = (map: maplibregl.Map) => {
    //set filter to it!
    map.setFilter('points');
    map.setFilter('selectedPoints');
  };

  private addCommonLayers = (map: maplibregl.Map, themeSettings?: ThemeElement) => {

    const theme = !themeSettings ? this.pickTheme() : themeSettings;
    this.addLineLayer(map, 'microwave-lines', 'lines',  { 'line-color':  theme.microwaveLink, 'line-width': 2 }, ['all', ['==', 'layer', 'link'], ['==', 'subType', 'microwave']]);
    this.addLineLayer(map, 'fibre-lines', 'lines', { 'line-color': theme.fiberLink, 'line-width': 2 }, ['all', ['==', 'layer', 'link'], ['==', 'subType', 'fibre']]);

    this.addLineLayer(map, 'services', 'services', { 'line-color': '#FF0000', 'line-width': 2 }, ['all', ['==', 'layer', 'service'], ['==', 'isBackup', false ]]);
    this.addLineLayer(map, 'backup-services', 'services', { 'line-color': '#FF0000', 'line-width': 2 }, ['all', ['==', 'layer', 'service'], ['==', 'isBackup', true ]], true);

    this.addLineLayer(map, 'selectedLineMicrowave', 'selectedLine', { 'line-color': theme.microwaveLink, 'line-width': 4 }, ['all', ['==', 'layer', 'link'], ['==', 'subType', 'microwave']]);
    this.addLineLayer(map, 'selectedLineFibre', 'selectedLine', { 'line-color': theme.fiberLink, 'line-width': 4 }, ['all', ['==', 'layer', 'link'], ['==', 'subType', 'fibre']]);
    this.addLineLayer(map, 'selectedServices', 'selectedLine', { 'line-color': '#FF0000', 'line-width': 4 }, ['==', 'layer', 'service']);

    // this.addCircleLayer(map, 'points', 'points', { 'circle-color': theme.site, 'circle-radius': [ 'match', ['get', 'xPonder'], 'true',  9,  7 ], 'circle-stroke-width': 1, 'circle-stroke-color':'#fff' }, ['==', 'layer', 'site']);
    this.addCircleLayer(map, 'points', 'points', { 'circle-color': theme.site, 'circle-radius': 7, 'circle-stroke-width': 1, 'circle-stroke-color':'#fff' }, ['==', 'layer', 'site']);
    this.addCircleLayer(map, 'selectedPoints', 'selectedPoints', { 'circle-color': theme.selectedSite, 'circle-radius': 9, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }, ['==', 'layer', 'size']);
  };

  /**
   * Pick the correct theme based on user selection
   */
  private pickTheme = () => {
    if (this.selectedTheme !== null) {
      const result = this.availableThemes.find(el => el.key === this.selectedTheme);
      if (result)
        return result;
    }

    return this.availableThemes[0];
  };

  private removeIconLayers = (map: maplibregl.Map) => {

    map.removeLayer('point-building');
    map.removeLayer('point-lamps');
    map.removeLayer('point-data-center');
    map.removeLayer('point-factory');
    map.removeLayer('select-point-data-center');
    map.removeLayer('select-point-buildings');
    map.removeLayer('select-point-lamps');
    map.removeLayer('select-point-factory');
  };

}

const mapLayerService = new MapLayerService();
export default mapLayerService;

