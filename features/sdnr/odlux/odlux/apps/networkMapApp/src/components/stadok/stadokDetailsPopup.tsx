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

import React, { FC, SyntheticEvent, useEffect, useState } from 'react';

import MuiDialogTitle from '@mui/material/DialogTitle';
import { AppBar, Button, Dialog, DialogContent, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

import StadokSite from '../../model/stadokSite';
import { LatLonToDMS } from '../../utils/mapUtils';
import DenseTable from '../../components/denseTable';
import { requestRest } from '../../../../../framework/src/services/restService';
import { OrderToDisplay, StadokOrder } from '../../model/stadokOrder';
import { SITEDOC_URL } from '../../config';

const stadokImage = (siteId: string, imageName: string, className: string) => {
  const url = `${SITEDOC_URL}/site/${siteId}/files/${imageName}`;
  return <img aria-label="image" className={className} src={url} onClick={() => window.open(url)} />;
};

const styles = (theme: Theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles({
  largeImage:{ cursor:'pointer', width:300 },
  smallImage:{ cursor:'pointer', width: 50, marginTop:'10px', marginLeft:'10px' },
});

const DialogTitle = withStyles(styles)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          style={{ position: 'absolute', top:0, right:0, color: 'black' }}
          onClick={onClose}
          size="large">
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

type StadokDetailsProps = { site: StadokSite; siteId: number; onClose(): void };

const StadokDetailsPopup: FC<StadokDetailsProps> = (props) => {
  
  const [currentTab, setCurrentTab] = useState('devices');
  const [orders, setOrders] = useState<OrderToDisplay[] | null>(null);
  const [displayReport, setDisplayReport] = useState(false);

  // TODO: change and use stadok site report once api is changed
  const reportUrl = `${SITEDOC_URL}/site/${props.site.id}/files/${props.siteId}-report.xml`;
  const ordersUrl = `${SITEDOC_URL}/site/${props.site.id}/orders`;
  
  const classes = useStyles();

  useEffect(() => {
    
    requestRest<StadokOrder[]>(ordersUrl, { method: 'GET' }).then(result =>{
      if (result) {
        const orderList = result.map(order =>{
          return OrderToDisplay.parse(order);
        });
        setOrders(orderList);
  
      } else {
        setOrders([]);
      }
    });

    requestRest(reportUrl).then(res =>{
      if (res) {
        setDisplayReport(true);
      }
    });

  }, []);


  const getContacts = (site: StadokSite) =>{
    const contacts = [];

    if (site.createdBy) {
      contacts.push({ h: 'Site Creator', col1: site.createdBy.firstName, col2: site.createdBy.lastName, col3: site.createdBy.email, col4: site.createdBy.telephoneNumber });
    }
  
    if (site.contacts?.manager) {
      contacts.push({ h: 'Manager', col1: site.contacts.manager.firstName, col2: site.contacts.manager.lastName, col3: site.contacts.manager.email, col4: site.contacts.manager.telephoneNumber });
    }
  
    if (site.contacts?.owner) {
      contacts.push({ h: 'Owner', col1: site.contacts.owner.firstName, col2: site.contacts.owner.lastName, col3: site.contacts.owner.email, col4: site.contacts.owner.telephoneNumber });
    }
    return contacts;
  };

  const onClose = () =>{
    // setOpen(false);
    props.onClose();
  };

  //todo: use a set 'panelId' -> which values are allowed
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };
  const contacts = getContacts(props.site);

  const createOrderInfo = () => {

    if (orders == null) {
      return (<div style={{ height: 300 }}>
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          Loading orders
        </Typography>
      </div>);
    } else if (orders.length === 0) {
      return (<div style={{ height: 300 }}>
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          No orders available
      </Typography>
      </div>);
    } else {
      return <DenseTable data={orders} height={300} headers={['Person', 'State', 'Current Task']} hover={false} ariaLabelRow="activity-log-table" />;
    }
  };

  const displayImages = () => {
    if (props.site.images.length === 1) {
      return stadokImage(props.site.id, props.site.images[0], classes.largeImage);
    } else {
      return <>
        {
          stadokImage(props.site.id, props.site.images[0], classes.largeImage)
        }
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

          {
            props.site.images.length <= 5 ?
              props.site.images.slice(1, props.site.images.length).map(image =>
                stadokImage(props.site.id, image, classes.smallImage),
              )
              :
              <>
                {
                  props.site.images.slice(1, 5).map(image =>
                    stadokImage(props.site.id, image, classes.smallImage),
                  )
                }
              </>
          }
        </div>
      </>;
    }
  };

  return (
    <Dialog aria-label="further-information-popup" onClose={onClose} fullWidth maxWidth="md" aria-labelledby="customized-dialog-title" open={true}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {props.site.id}
      </DialogTitle>
      <DialogContent style={{ minWidth:'900px' }} dividers>
        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
          <div style={{ width: '60%', display:'flex', flexDirection: 'column' }}>
           
          <TextField variant="standard" inputProps={{ 'aria-label': 'updated-on' }} disabled={true} value={props.site.updatedOn} label="Updated on" style={{ marginTop: '5px' }} />
            {
              props.site.type != null && props.site.type.length > 0 &&
              <TextField variant="standard" inputProps={{ 'aria-label': 'type' }} disabled={true} value={props.site.type} label="Type" style={{ marginTop: '5px' }} />
            }

            <TextField
              variant="standard"
              inputProps={{ 'aria-label': 'address' }}
              disabled={true}
              value={`${props.site.address.streetAndNr}, ${props.site.address.zipCode != null ? props.site.address.zipCode : ''} ${props.site.address.city}`}
              label="Address"
              style={{ marginTop: '5px' }}
            />

            <TextField variant="standard" inputProps={{ 'aria-label': 'latitude' }} style={{ marginTop: '5px' }} disabled={true} value={LatLonToDMS(props.site.location.lat)} label="Latitude" />
            <TextField variant="standard" inputProps={{ 'aria-label': 'longitude' }} style={{ marginTop: '5px' }} disabled={true} value={LatLonToDMS(props.site.location.lon, true)} label="Longitude" />
            <AppBar enableColorOnDark position="static" style={{ marginTop: '5px', background: '#2E3B55' }}>
              <Tabs indicatorColor="secondary" textColor="inherit"
                id="site-tabs"
                variant="scrollable"
                scrollButtons
                value={currentTab}
                onChange={handleTabChange}
                aria-label="information-tabs"
                allowScrollButtonsMobile>
                  <Tab label="Devices" value="devices" />
                  <Tab label="Contacts" value="contacts" />
                  <Tab label="Safety" value="safetyInfo" />
                  <Tab label="Logs" value="logs" />
                  <Tab label="Orders" value="orders" />
              </Tabs>
          </AppBar>
          {
            currentTab == 'devices' && (props.site.devices?.length > 0 ?
          <DenseTable data={props.site.devices} height={300} headers={['Device', 'Antenna']} hover={false} ariaLabelRow="devices-table" />
              :
          <div style={{ height:300 }}>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            No devices available
          </Typography>
          </div>)
          }
          {
             currentTab == 'contacts' && (contacts.length > 0 ?
              <DenseTable data={contacts} height={300} headers={['Person', 'Firstname', 'Lastname', 'Email', 'Phone No.']} hover={false} ariaLabelRow="contacts-table" ariaLabelColumn={['person', 'firstname', 'lastname', 'email', 'phoneno']} />
               :
              <div style={{ height:300 }}>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                  No contacts available
                </Typography>
              </div>)
          }
          {
              currentTab == 'safetyInfo' && (props.site?.safetyNotices?.length > 0
                ? (
                  <DenseTable data={props.site.safetyNotices} height={300} headers={['Note']} hover={false} ariaLabelRow="safety-info-table" />
                )
                : (
                  <div style={{ height:300 }}>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      No safety notices applicable
                    </Typography>
                  </div>
                ))
          }
          {
              currentTab == 'logs' && (props.site?.logs?.length > 0
                ? (
                  <DenseTable data={props.site.logs} height={300} headers={['Date', 'Person', 'Activity']} hover={false} ariaLabelRow="activity-log-table" />
                )
                : (
                  <div style={{ height:300 }}>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      No activity log available
                    </Typography>
                  </div>
                )
              )
          }

          {
            currentTab === 'orders' && createOrderInfo()
          }
        </div>
        <div style={{ padding: '10px', display: 'flex', alignItems:'center', flexDirection:'column', justifyContent: 'start', width:'40%' }}>
          {
              props.site?.images?.length > 0
                ? displayImages()
                : ( 
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    No images available
                  </Typography>
                )
          }
          {
            displayReport && 
            <div style={{ marginTop:25 }}>
              <Button onClick={() => window.open(reportUrl)} aria-label="download-report-button">
                <FontAwesomeIcon color="black" icon={faFileAlt} size="3x" />
              </Button>
              <Typography variant="body1">TSS Report</Typography>
          </div>
          }
        
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );

};

export default StadokDetailsPopup;