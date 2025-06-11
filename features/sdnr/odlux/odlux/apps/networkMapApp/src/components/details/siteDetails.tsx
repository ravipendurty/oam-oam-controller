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

import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import { AppBar, Button, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { NavigateToApplication } from '../../../../../framework/src/actions/navigationActions';
import { requestRest } from '../../../../../framework/src/services/restService';

import { CheckDeviceList, InitializeLoadedDevicesAction } from '../../actions/detailsAction';
import { Address, Device, Site } from '../../model/topologyTypes';
import StadokSite from '../../model/stadokSite';
import { LatLonToDMS } from '../../utils/mapUtils';

import DenseTable from '../denseTable';
import StadokDetailsPopup from '../stadok/stadokDetailsPopup';

const buildAddress = (address: Address) => {
  switch (address.country) {
    case 'de':
      return `${address.streetAndNr}, ${address.zipCode !== null ? address.zipCode : ''} ${address.city}`;

    case 'us':
      return `${address.streetAndNr}, ${address.city} ${address.zipCode !== null ? address.zipCode : ''}`;

    default:
      console.log('address formatting for country {' + address.country + '} not recognized, defaulting.');
      return `${address.streetAndNr}, ${address.zipCode !== null ? address.zipCode : ''} ${address.city}`;
  }
};

type PanelId = 'links' | 'nodes';
type LinkRow = { name: string; azimuth?: string };
type DeviceRow = { id: string; type: string; name: string; manufacturer: string; owner: string; status?: string; port: number[] };

type SiteDetailProps = {
  site: Site;
  onLinkClick(id: string): void;
};

const SiteDetails: React.FC<SiteDetailProps> = (props) => {

  const updatedDevices = useSelectApplicationState(state => state.network.details.checkedDevices);
  const isSitedocReachable = useSelectApplicationState(state => state.network.details.isSitedocReachable);

  const dispatch = useApplicationDispatch();
  const initializeDevices = (devices: Device[]) => dispatch(new InitializeLoadedDevicesAction(devices));
  const loadDevices = async (networkElements: Device[]) =>  dispatch(CheckDeviceList(networkElements));
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path, ''));

  const [value, setValue] = React.useState<PanelId>('links');
  const [height, setHeight] = React.useState(330);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [staSite, setStaSite] = React.useState<StadokSite | null>(null);

  const hasFurtherInfo = props.site.furtherInformation !== null && props.site.furtherInformation.length > 0;

  const handleResize = () => {
    //table currently likes to overflow the available area -> force set a height to the container
    const el = document.getElementById('site-details-panel')?.getBoundingClientRect();
    const el2 = document.getElementById('site-tabs')?.getBoundingClientRect();

    if (el && el2) {
      if (!hasFurtherInfo) {
        setHeight(el!.height - el2!.y - 10);
      } else {
        setHeight(el!.height - el2!.y - 65);
      }
    }
  };

  //on mount
  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', () => { handleResize(); });

    return () => {
      window.removeEventListener('resize', () => { handleResize(); });
    };
  }, []);

  // on update
  React.useEffect(() => {

    if (props.site.devices !== null && props.site.devices.length > 0) {
      
      //TODO: why two?
      initializeDevices(props.site.devices);
      loadDevices(props.site.devices);
    }
    handleResize();

  }, [props.site]);

  const onHandleTabChange = (event: React.SyntheticEvent, newValue: PanelId) => {
    setValue(newValue);
  };

  const getFurtherInformation = (url: string) => {

    const request = requestRest<StadokSite>(url, { method: 'GET' });
    request.then(result => {
      if (result) {
        setStaSite(result);
        setOpenPopup(true);
      } else {
        console.error(result);
      }
    });
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  //prepare link table

  let hasAzimuth = false;
  const linkRows: LinkRow[] = props.site.links?.map(link => {
    if (link.azimuth !== null) {
      hasAzimuth = true;
      return { name: link.name, azimuth: link.azimuth.toFixed(2) };
    } else {
      return { name: link.name ? link.name : link.id.toString() };
    }
  });

  const linkTableHeader = hasAzimuth ? ['Link Name', 'Azimuth in °'] : ['Link Name'];

  //prepare device table
  const deviceRows: DeviceRow[] = updatedDevices?.map(device => {
    return {
      id: device.id,
      name: device.name,
      type: device.type ? device.type : 'unknown',
      status: (device.status?.length == 0 || device.status === undefined || device.status === null) ? 'Not Connected' : device.status,
      manufacturer: device.manufacturer,
      owner: device.owner,
      port: device.port,
    };
  });

  const addressString = props.site.address == null ? null : buildAddress(props.site.address);

  return (<div style={{ padding: '15px', display: 'flex', flexDirection: 'column', paddingTop: '0px', minWidth: 0, minHeight: 0 }}>

    <Typography style={{ marginTop: 35, marginBottom: 15 }} variant="h5" fontWeight={'bold'} aria-label="site-id">{props.site.id}</Typography>
    <div style={{ position: 'absolute', marginLeft: '100px', marginTop: '30px', right: '20', display: 'flex', zIndex: 1 }} >
      <IconButton aria-label={'site-manager-treeview-button'}
        onClick={() => {
          const baseUrl = window.location.pathname.split('#')[0];
          const siteId = props.site.id + '';
          const url = `${baseUrl}#/siteManager/treeview/${siteId}`;
          window.open(url);
        }}>
        <LanOutlinedIcon />
      </IconButton>
    </div>
    <TextField variant="standard" inputProps={{ 'aria-label': 'name' }} disabled={true} value={props.site.name !== null ? props.site.name : ' '} label="Name" />
    {
      props.site.operator !== '' && props.site.operator !== null ?
        <TextField variant="standard" inputProps={{ 'aria-label': 'operator' }} disabled={true} value={props.site.operator} label="Operator" /> :
        <TextField variant="standard" inputProps={{ 'aria-label': 'operator' }} disabled={true} value="Unknown" label="Operator" style={{ marginTop: '5px' }} />
    }
    {
      props.site?.feature?.properties?.layer !== undefined && props.site?.feature?.properties?.layer.length > 0 &&
      <TextField variant="standard" inputProps={{ 'aria-label': 'layer' }} disabled={true} value={props.site?.feature?.properties?.layer} label="Layer" style={{ marginTop: '5px' }} />
    }
    {
      addressString !== null &&
      <TextField variant="standard" inputProps={{ 'aria-label': 'address' }} disabled={true} value={addressString} label="Address" style={{ marginTop: '5px' }} />
    }
    {
      props.site.heightAmslInMeters !== undefined && props.site.heightAmslInMeters > 0 &&
      <TextField variant="standard" inputProps={{ 'aria-label': 'amsl-in-meters' }} disabled={true} value={props.site.heightAmslInMeters} label="AMSL in meters" style={{ marginTop: '5px' }} />
    }
    {
      props.site.antennaHeightAmslInMeters !== undefined && props.site.antennaHeightAmslInMeters > 0 &&
      <TextField variant="standard" inputProps={{ 'aria-label': 'antenna-above-ground-in-meters' }} disabled={true} value={props.site.antennaHeightAmslInMeters} label="Antenna above ground in meters" style={{ marginTop: '5px' }} />
    }
    <TextField variant="standard" inputProps={{ 'aria-label': 'latitude' }} style={{ marginTop: '5px' }} disabled={true} value={LatLonToDMS(props.site.location.lat)} label="Latitude" />
    <TextField variant="standard" inputProps={{ 'aria-label': 'longitude' }} style={{ marginTop: '5px' }} disabled={true} value={LatLonToDMS(props.site.location.lon, true)} label="Longitude" />
    <AppBar enableColorOnDark position="static" style={{ marginTop: '5px', background: '#f5f7fa' }}>
      <Tabs indicatorColor="secondary" textColor="inherit" id="site-tabs" value={value} onChange={onHandleTabChange} aria-label="tabs">
        <Tab label="Links" aria-label="site-links" value="links" />
        <Tab label="Nodes" aria-label="site-nodes" value="nodes" />
      </Tabs>
    </AppBar>
    {
      value === 'links' &&
      <>
        {
          props.site.links == null &&
          <Typography aria-label="no-links-available" variant="body1" style={{ marginTop: '10px' }}>No links available.</Typography>
        }
        {
          props.site.links?.length > 0 &&
          <DenseTable ariaLabelRow="available-links-table" ariaLabelColumn={['link-name', 'azimuth']} height={height} hover={true} headers={linkTableHeader} data={linkRows} onClick={props.onLinkClick}  ></DenseTable>
        }
      </>
    }
    {
      value === 'nodes' &&
      <>
        {
          props.site.devices === null &&
          <Typography aria-label="no-nodes-avilable" variant="body1" style={{ marginTop: '10px' }}>No nodes available.</Typography>
        }
        {
          props.site.devices?.length > 0 && updatedDevices !== null &&
          <DenseTable
            ariaLabelRow="available-nodes-table"
            ariaLabelColumn={['id', 'name', 'type', 'status', 'manufacturer', 'owner', 'ports', 'actions']}
            navigate={navigateToApplication}
            height={height}
            hover={false}
            headers={['ID', 'Name', 'Type', 'Status', 'Manufacturer', 'Owner', 'Ports', 'Actions']}
            actions={true} data={deviceRows!} />
        }
      </>
    }
    {
      isSitedocReachable &&
      <>
        {
          hasFurtherInfo &&
          <Button style={{ marginTop: 20 }} aria-label="further-information-button" fullWidth variant="contained" color="primary" onClick={() => getFurtherInformation(props.site.furtherInformation)}>Further information available</Button>
        }
      </>
    }
    {
      staSite !== null && openPopup && <StadokDetailsPopup site={staSite} siteId={props.site.id} onClose={closePopup} />
    }
  </div>
  );
};



export default SiteDetails;