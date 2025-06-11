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

import { AppBar, Tab, Tabs, Typography } from '@mui/material';

import StadokSite from '../models/stadokSite';
import DenseTable from './denseTable';

type StadokDetailsProps = { siteId: string };

const SiteAdditionalInformation: FC<StadokDetailsProps> = (props) => {

  const [currentTab, setCurrentTab] = useState('contacts');
  const [data, setData] = useState<StadokSite | null>(null);

  useEffect(() => {
    const fetchData = async (siteId: string) => {
      const response = await fetch('/sitedoc/site/' + siteId);
      const result = await response.json();
      setData(result);
    };

    fetchData(props.siteId);
  }, [props.siteId]);


  const getContacts = (site: StadokSite | null) => {
    const contacts = [];
    if (site?.createdBy) {
      contacts.push({
        h: 'Site Creator', col1: site?.createdBy.firstName, col2: site?.createdBy.lastName,
        col3: site?.createdBy.email, col4: site?.createdBy.telephoneNumber,
      });
    }
    if (site?.contacts?.manager) {
      contacts.push({
        h: 'Manager', col1: site?.contacts.manager.firstName, col2: site?.contacts.manager.lastName,
        col3: site?.contacts.manager.email, col4: site?.contacts.manager.telephoneNumber,
      });
    }
    if (site?.contacts?.owner) {
      contacts.push({
        h: 'Owner', col1: site?.contacts.owner.firstName, col2: site?.contacts.owner.lastName,
        col3: site?.contacts.owner.email, col4: site?.contacts.owner.telephoneNumber,
      });
    }
    return contacts;
  };

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };
  const contacts = getContacts(data);


  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <AppBar enableColorOnDark position="static" style={{ marginTop: '5px', background: 'white' }}>
          <Tabs indicatorColor="secondary" textColor="inherit"
            id="site-tabs"
            variant="scrollable"
            scrollButtons
            value={currentTab}
            onChange={handleTabChange}
            aria-label="information-tabs"
            allowScrollButtonsMobile>
            <Tab label="Contacts" value="contacts" />
            <Tab label="Safety" value="safetyInfo" />
            <Tab label="Logs" value="logs" />
          </Tabs>
        </AppBar>
        {
          currentTab == 'contacts' && (contacts.length > 0 ?
            <DenseTable data={contacts} height={300} headers={['Person', 'FirstName', 'LastName', 'Email', 'Phone No.']} hover={false}
              ariaLabelRow="contacts-table" ariaLabelColumn={['person', 'firstName', 'lastName', 'email', 'phoneNo']} />
            :
            <div style={{ height: 300 }}>
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                No contacts available
              </Typography>
            </div>)
        }
        {
          currentTab == 'safetyInfo' && (data && data?.safetyNotices?.length > 0
            ? (
              <DenseTable data={data?.safetyNotices} height={300} headers={['Note']} hover={false} ariaLabelRow="safety-info-table" />
            )
            : (
              <div style={{ height: 300 }}>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                  No safety notices applicable
                </Typography>
              </div>
            ))
        }
        {
          currentTab == 'logs' && (data && data?.logs?.length > 0
            ? (
              <DenseTable data={data?.logs} height={300} headers={['Date', 'Person', 'Activity']} hover={false} ariaLabelRow="activity-log-table" />
            )
            : (
              <div style={{ height: 300 }}>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                  No activity log available
                </Typography>
              </div>
            )
          )
        }
      </div>
    </div>


  );

};

export default SiteAdditionalInformation;