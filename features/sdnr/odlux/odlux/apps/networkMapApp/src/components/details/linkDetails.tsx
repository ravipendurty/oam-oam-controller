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

import React from 'react';

import { AppBar, Button, Tab, Tabs, TextField, Typography } from '@mui/material';

import { useApplicationDispatch } from '../../../../../framework/src/flux/connect';
import { AddErrorInfoAction } from '../../../../../framework/src/actions/errorActions';

import { Link } from '../../model/topologyTypes';
import { LatLonToDMS } from '../../utils/mapUtils';
import DenseTable from '../denseTable';

type MandatoryParametersLOS = { lat: number | null; lon: number | null; amsl: number | null; antennaHeight: number | null };

type LinkProps = { link: Link };

const LinkDetails: React.FC<LinkProps> = (props) => {

  const dispatch = useApplicationDispatch();
  const showErrorMessage = (message: string) => dispatch(new AddErrorInfoAction({ title: 'Problem', message: message }));

  const [height, setHeight] = React.useState(330);

  const handleResize = () => {

    // table does not adhere to flex-box dimensions, so set height explicit

    const el = document.getElementById('link-details-panel')?.getBoundingClientRect();
    const el2 = document.getElementById('link-site-details')?.getBoundingClientRect();

    if (el && el2) {
      if (props.link?.feature?.properties?.subType === 'microwave')
        setHeight(el!.height - el2!.y - 80);
      else
        setHeight(el!.height - el2!.y + 20);
    }
  };

  //on mount
  React.useEffect(() => {
    handleResize();

    //window.addEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    handleResize();
  }, [props.link]);

  const getEmptyProperties = (hint:string, data: any) => {
    const entries = Object.entries(data);
    const emptyProperties: string[] = entries.filter(propery => propery[1] === null || propery[1] === undefined).map(properties => hint + properties[0]);
    return emptyProperties;
  };

  const checkLOSMandatoryParameters = (checkObject: { siteA: MandatoryParametersLOS; siteB: MandatoryParametersLOS }) => {

    const emptyA = getEmptyProperties('SiteA:', checkObject.siteA);
    const emptyB = getEmptyProperties('SiteB:', checkObject.siteB);
    const emptyValues = [...new Set([...emptyA, ...emptyB])];
    return emptyValues;
  };

  const handleCalculateLinkClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const linkId = props.link.id;
    const baseUrl = window.location.pathname.split('#')[0];
    window.open(`${baseUrl}#/microwave/calculateLink/?linkId=${linkId}`);
  };

  const handleLineOfSightClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const siteA = props.link.siteA;
    const siteB = props.link.siteB;

    const checkObject = {
      siteA: { lat: siteA.lat, lon: siteA.lon, amsl: siteA.amsl, antennaHeight: siteA.antenna?.height },
      siteB: { lat: siteB.lat, lon: siteB.lon, amsl: siteB.amsl, antennaHeight: siteB.antenna?.height },
    };

    var emptyValues = checkLOSMandatoryParameters(checkObject);

    if (emptyValues.length === 0) {

      let heightPart = `&amslA=${siteA.amsl}&antennaHeightA=${siteA.antenna.height}&amslB=${siteB.amsl}&antennaHeightB=${siteB.antenna.height}`;
      const baseUrl = window.location.pathname.split('#')[0];
      window.open(`${baseUrl}#/microwave/lineofsightMap/los?lat1=${siteA.lat}&lon1=${siteA.lon}&lat2=${siteB.lat}&lon2=${siteB.lon}${heightPart}`);
    } else {
      showErrorMessage('Line of Sight App cannot be opened. Data is missing: ' + emptyValues);
    }
  };

  const amslAvailable = props.link.siteA.amsl && props.link.siteB.amsl;

  const data = [
    { name: 'Site Id', val1: props.link.siteA.siteId, val2: props.link.siteB.siteId },
    { name: 'Site Name', val1: props.link.siteA.siteName, val2: props.link.siteB.siteName },
    { name: 'Latitude', val1: LatLonToDMS(props.link.siteA.lat), val2: LatLonToDMS(props.link.siteB.lat) },
    { name: 'Longitude', val1: LatLonToDMS(props.link.siteA.lon, true), val2: LatLonToDMS(props.link.siteB.lon, true) },
    props.link?.feature?.properties?.subType == 'microwave' && amslAvailable !== null && { name: 'Amsl in m', val1: props.link.siteA.amsl, val2: props.link.siteB.amsl },
    props.link?.feature?.properties?.subType == 'microwave' && amslAvailable !== null && props.link.siteA.antenna !== null && { name: 'Antenna height in m', val1: props.link.siteA.antenna.height, val2: props.link.siteB.antenna.height },
    props.link.siteA.azimuth != null && props.link.siteB.azimuth != null && { name: 'Azimuth in °', val1: props.link.siteA.azimuth.toFixed(2), val2: props.link.siteB.azimuth.toFixed(2) },
  ];

  return (<div style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '0px', display: 'flex', flexDirection: 'column' }}>

    <Typography style={{ marginTop: 35, marginBottom: 15 }} variant="h5" fontWeight={'bold'} aria-label="link-id">{props.link.id}</Typography>
    {
      props.link.name !== null ?
        <TextField variant="standard" inputProps={{ 'aria-label': 'name' }} disabled style={{ marginTop: '5px' }} value={props.link.name} label="Name" />
        : null
    }
    <TextField variant="standard" inputProps={{ 'aria-label': 'operator' }} disabled style={{ marginTop: '5px' }} value={props.link.operator.length > 0 ? props.link.operator : 'unknown'} label="Operator" />
    <TextField variant="standard" inputProps={{ 'aria-label': 'type' }} disabled style={{ marginTop: '5px' }} value={props.link?.feature?.properties?.layer} label="Layer" />
    <TextField variant="standard" inputProps={{ 'aria-label': 'distance-in-km' }} disabled style={{ marginTop: '5px' }} value={props.link.length.toFixed(2)} label="Distance in km" />
    {props.link.polarization ? <TextField variant="standard" inputProps={{ 'aria-label': 'polarization' }} disabled style={{ marginTop: '5px' }} value={props.link.polarization} label="Polarization" /> : null}

    <AppBar position="static" id="link-site-details" style={{ marginTop: '5px', background: '#f5f7fa' }}>
      <Tabs indicatorColor="secondary" textColor="inherit" value="links" aria-label="link-tabs">
        <Tab label="Site Details" aria-label="details-of-link-sites" value="links" />
      </Tabs>
    </AppBar>
    <DenseTable ariaLabelRow="site-information-table-entry" ariaLabelColumn={['site-name', 'latitude', 'longitude', 'azimuth']} verticalTable height={height} hover={false} headers={['', 'Site A', 'Site B']} data={data} />
    {
      props.link?.feature?.properties?.subType === 'microwave' && <>
        <Button style={{ marginTop: 20 }} aria-label="open-link-calculator-button" fullWidth variant="contained" color="primary" onClick={handleCalculateLinkClick}>Calculate link</Button>
        <Button style={{ marginTop: 20 }} aria-label="open-line-of-sight-app-button" fullWidth variant="contained" color="primary" onClick={handleLineOfSightClick}>Line of Sight</Button>
      </>
    }
  </div>);
};

export default LinkDetails;