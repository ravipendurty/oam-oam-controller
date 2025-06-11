/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2021 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

import React, { useEffect, useRef, useState, ChangeEvent, MouseEvent } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography/Typography';
import TextField from '@mui/material/TextField/TextField';
import Grid from '@mui/material/Grid/Grid';
import Slider from '@mui/material/Slider/Slider';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Button from '@mui/material/Button/Button';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select from '@mui/material/Select/Select';
import Switch from '@mui/material/Switch/Switch';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { requestRest } from '../../../../../framework/src/services/restService';
import { IApplicationStoreState } from '../../../../../framework/src/store/applicationStore';
import { SettingsComponentProps } from '../../../../../framework/src/models/settings';

import { OSM_STYLE } from '../../config';
import { updateSettings } from '../../actions/settingsAction';
import { NetworkMapSettings } from '../../model/settings';
import mapLayerService from '../../utils/mapLayers';

import { ThemeEntry } from './themeElement';

const defaultBoundingBox = '12.882544785787754,52.21421979821472,13.775455214211949,52.80406241672602';

const useStyles = makeStyles({
  sectionMargin: {
    marginTop: '30px',
    marginBottom: '15px',
  },
  elementMargin: {
    marginLeft: '10px',
  },
  settingsTable: {
    display: 'flex', flexDirection: 'row', flexGrow: 1, height: '100%', position: 'relative',
  },
  settingsRow: {
    width: '60%', flexDirection: 'column', position: 'relative', marginRight: '15px',
  },
});

type NetworkMapSetupProps = SettingsComponentProps;

const NetworkMapSetup = (props: NetworkMapSetupProps) => {

  const mapRef = useRef<maplibregl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapSettings = useSelectApplicationState((state: IApplicationStoreState) => state.network.settings.mapSettings);
  const mapThemes = useSelectApplicationState((state: IApplicationStoreState) => state.network.settings.themes);

  const dispatch = useApplicationDispatch();
  const updateMapSettings = (newMapSettings: NetworkMapSettings) => dispatch(updateSettings(newMapSettings));

  const [opacity, setOpacity] = useState(Number(mapSettings?.tileOpacity) || 100);
  const [theme, setTheme] = useState(mapSettings?.styling?.theme || '');
  const [latitude, setLatitude] = useState<number>(Number(mapSettings?.startupPosition?.latitude) || 52.5);
  const [longitude, setLongitude] = useState<number>(Number(mapSettings?.startupPosition?.longitude) || 13.35);
  const [zoom, setZoom] = useState<number>(Number(mapSettings?.startupPosition?.zoom) || 10);
  const [areIconsEnabled, setEnableIcons] = useState<boolean>(mapSettings?.areIconsEnabled || true);

  // used to make opacity available within the map event-listeners
  // (hook state values are snapshotted at initialization and not updated afterwards / only updated inside other hooks, thus use a ref here)
  const myOpacityRef = useRef(opacity);
  const setOpacityState = (data: any) => {
    myOpacityRef.current = data;
    setOpacity(data);
  };

  const updateSampleData = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    // get data of bounding box from networkmap

    const links = requestRest<any>('/topology/network/links/geojson/' + defaultBoundingBox);
    const sites = requestRest<any>('/topology/network/sites/geojson/' + defaultBoundingBox);

    Promise.all([links, sites]).then(results => {
      if (map.getSource('lines')) {
        (map.getSource('lines') as maplibregl.GeoJSONSource).setData(results[0]);
      }

      if (map.getSource('points')) {
        (map.getSource('points') as maplibregl.GeoJSONSource).setData(results[1]);
      }

      if (map.getSource('selectedPoints')) {
        (map.getSource('selectedPoints') as maplibregl.GeoJSONSource).setData(results[1].features[0]);
      }
    });
  };

  const recenterMap = () => {
    const map = mapRef.current;
    if (map && !isNaN(latitude) && !isNaN(longitude) && !isNaN(zoom))
      map.flyTo({
        center: [
          longitude,
          latitude,
        ], zoom: zoom,
        essential: false,
      });
  };

  const setState = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (mapSettings?.styling) {
      setTheme(mapSettings.styling.theme);
      mapLayerService.changeTheme(map, mapSettings.styling.theme);
    }

    if (mapSettings?.areIconsEnabled !== undefined) {
      setEnableIcons(mapSettings!.areIconsEnabled);
    }

    const propOpacity = mapSettings?.tileOpacity;
    if (propOpacity) {
      setOpacityState(propOpacity);
    }
  };

  const styles = useStyles();
  const currentTheme = mapThemes.find(el => el.key === theme);

  useEffect(() => {
    mapLayerService.availableThemes = mapThemes;
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: OSM_STYLE as any,
      center: [longitude, latitude],
      zoom: zoom,
    });

    mapRef.current.on('load', () => {
      mapLayerService.addBaseSources(mapRef.current!, null, null, null);
      if (mapSettings?.styling?.theme !== theme) {
        mapLayerService.addBaseLayers(mapRef.current!);
      } else {
        mapLayerService.addBaseLayers(mapRef.current!);
      }
      mapLayerService.changeMapOpacity(mapRef.current!, myOpacityRef.current);
      updateSampleData();
    });

    mapRef.current.on('moveend', () => {
      const center = mapRef.current!.getCenter();
      setZoom(Number(mapRef.current!.getZoom().toFixed(4)));
      setLatitude(Number(center.lat.toFixed(4)));
      setLongitude(Number(center.lng.toFixed(4)));
    });

  }, []);

  useEffect(() => {
    recenterMap();
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    setState();
  }, [mapSettings]);

  const handleOpacityChange = (event: Event, newValue: number) => {
    setOpacity(newValue);
    mapLayerService.changeMapOpacity(mapRef.current!, newValue);
  };

  const handleShowIconsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: boolean) => {
    setEnableIcons(newValue);
  };

  const handleChangeTheme = (e: any) => {

    const newTheme = e.target.value;
    setTheme(newTheme);
    mapLayerService.changeTheme(mapRef.current!, newTheme);
  };

  const handleCancel = (e: MouseEvent) => {
    e.preventDefault();
    props.onClose();
  };

  const handleSaveSettings = async (e: MouseEvent) => {
    e.preventDefault();

    const updatedSettings: NetworkMapSettings = {
      tileOpacity: opacity.toString(),
      styling: { theme: theme },
      areIconsEnabled: areIconsEnabled,
      startupPosition: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        zoom: zoom.toString(),
      },
    };

    await updateMapSettings(updatedSettings);
    props.onClose();
  };

  /**
   * Style property names to readable text
   * @param text property name
   * @returns readable text
   */
  const styleText = (text: string) => {
    const textParts = text.split(/(?=[A-Z])/); //split on uppercase character
    const newText = textParts.join(' ');
    return newText.charAt(0).toUpperCase() + newText.slice(1);
  };

  return (
    <>
      <h3>Settings</h3>
      <div className={styles.settingsTable}>
        <div className={styles.settingsRow}>
          <Typography variant="body1" style={{ fontWeight: 'bold' }} gutterBottom>Startup Position</Typography>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextField variant="standard" type="number" value={latitude} onChange={(e) => setLatitude(e.target.value as any)} style={{ marginLeft: 10 }} label="Latitude" />
            <TextField variant="standard" type="number" value={longitude} onChange={(e) => setLongitude(e.target.value as any)} style={{ marginLeft: 5 }} label="Longitude" />
            <TextField variant="standard" type="number" value={zoom} onChange={(e) => setZoom(e.target.value as any)} style={{ marginLeft: 5 }} label="Zoom" />
          </div>

          <Typography className={styles.sectionMargin} variant="body1" style={{ fontWeight: 'bold' }} gutterBottom>
            Tile Opacity
          </Typography>
          <Grid className={styles.elementMargin} container spacing={2} style={{ width: '50%' }}>
            <Grid item>0</Grid>
            <Grid item xs>
              <Slider color="secondary" min={0} max={100} value={opacity} onChange={handleOpacityChange} aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>100</Grid>
          </Grid>

          <Typography className={styles.sectionMargin} variant="body1" style={{ fontWeight: 'bold' }} gutterBottom>
            Display icons
          </Typography>
          <FormControlLabel style={{ padding: 5 }}
            value="end"
            control={<Switch color="secondary" checked={areIconsEnabled} onChange={handleShowIconsChange} />}
            label="Show icons"
            labelPlacement="end"
          />
          <Typography className={styles.sectionMargin} variant="body1" style={{ fontWeight: 'bold' }} gutterBottom>
            Style of properties
          </Typography>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select variant="standard"
            className={styles.elementMargin}
            value={theme}
            onChange={handleChangeTheme}
            labelId="theme-select-label"
            style={{ marginLeft: 10 }}>
            {
              mapThemes.map(el => (<MenuItem value={el.key}>{el.key}</MenuItem>))
            }
          </Select>
          {currentTheme &&
            <div style={{ marginLeft: 60 }}>
              {
                ['site', 'selectedSite', 'fiberLink', 'microwaveLink'].map(el => (
                  <ThemeEntry key={el} text={styleText(el)} color={(currentTheme as any)[el]} />
                ))
              }
            </div>
          }
          <div className={styles.sectionMargin} style={{ position: 'absolute', right: 0, top: '60%' }}>
            <Button className={styles.elementMargin} variant="contained" color="inherit" onClick={handleCancel}>Cancel</Button>
            <Button className={styles.elementMargin} variant="contained" color="secondary" onClick={handleSaveSettings}>Save</Button>
          </div>
        </div>
        <div id="map" ref={mapContainerRef} style={{ width: '35%', height: '50%' }} />
      </div>
    </>
  );
};

NetworkMapSetup.displayName = 'NetworkMapSetup';

export { NetworkMapSetup };
