/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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
import React, { useEffect, useState } from 'react';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';

import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';

import { SiteManagerCategoryItems, SiteManagerSiteOrderItemsDetails } from '../models/siteManager';

const styles = makeStyles({
  root: {
    '&:hover': {
      color: 'blue',
    },
  },
});

const SiteOrders = MaterialTable as MaterialTableCtorType<any>;

type joinSiteOrdersDetailsResult = {
  name: string | undefined;
  url: string;
  assignedUser: string;
  state: string;
  note: string;
  type: string;
  description: string;
  completed: boolean;
};

type SiteOrdersComponentProps = {
  siteOrderItems: SiteManagerCategoryItems;
  siteOrderItemDetails: SiteManagerSiteOrderItemsDetails;
};

const SiteOrdersViewComponent: React.FC<SiteOrdersComponentProps> = (props) => {
  const [siteOrdersTableData, setSiteOrdersTableData] = useState<joinSiteOrdersDetailsResult[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const classes = styles();

  const downloadSiteOrdersReport = (url: string) => {
    let fileName = url.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.'),
    );
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
        const reportUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = reportUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(reportUrl);
        alert('Report has downloaded!');
      })
      .catch(() => alert('oh no! something went wrong'));
  };

  const joinColumns = () => {
    let siteOrdersItemList = props.siteOrderItems;
    let siteOrdersDetailsList = props.siteOrderItemDetails;
    let updatedSiteOrdersTableData: joinSiteOrdersDetailsResult[] = [];

    siteOrdersItemList.forEach(siteOrder => {
      const name = siteOrder.name;
      const userName = name.substring(name.lastIndexOf('-') + 1);
      let indexDetails = 0;
      for (; indexDetails < siteOrdersDetailsList.length; indexDetails++) {
        const detail = siteOrdersDetailsList[indexDetails];
        if (userName === detail.assignedUser) {
          updatedSiteOrdersTableData.push({
            name: name,
            url: siteOrder.url,
            assignedUser: userName,
            state: detail.state,
            note: detail.note,
            type: detail.tasks[0]?.type,
            description: detail.tasks[0]?.description,
            completed: detail.tasks[0]?.completed,
          });
          break;
        }
      }
      siteOrdersDetailsList.splice(indexDetails, 1);
    });
    siteOrdersItemList.splice(0, siteOrdersItemList.length);
    setSiteOrdersTableData(updatedSiteOrdersTableData);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!isLoaded) {
      joinColumns();
    }
  }, [props.siteOrderItems, props.siteOrderItemDetails, isLoaded]);

  return (
    <>
      {isLoaded ? (
        <SiteOrders stickyHeader tableId='device-table' columns={[
          {
            property: 'name', title: 'Name', type: ColumnType.custom, customControl: ({ rowData }) => {
              if (rowData.url === '') {
                return (<>{rowData.name}</>);
              } else {
                return (<a href={rowData.url} target='_blank'  > {rowData.name} </a>);
              }
            },
          },
          { property: 'state', title: 'State', type: ColumnType.text },
          { property: 'description', title: 'Current Task', type: ColumnType.text },
          {
            property: 'url', title: 'Action', type: ColumnType.custom, customControl: ({ rowData }) => {
              if (rowData.url === '') {
                return (<IconButton disabled> <FontAwesomeIcon icon={faDownload} /> </IconButton>);
              } else {
                return (
                  <FontAwesomeIcon icon={faDownload} className={classes.root} onClick={(event) => { event.stopPropagation(); downloadSiteOrdersReport(rowData.url); }} />
                );
              }
            },
          },
        ]} idProperty='id' rows={siteOrdersTableData}  >
        </SiteOrders>) : (
        <div>Loading...</div>
      )}
    </>
  );
};


export const SiteOrdersView = SiteOrdersViewComponent;
export default SiteOrdersView;