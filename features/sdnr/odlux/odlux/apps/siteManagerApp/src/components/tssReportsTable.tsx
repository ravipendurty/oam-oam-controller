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

import React, { useState } from 'react';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';

import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';

const styles = makeStyles({
  root: {
    '&:hover': {
      color: 'blue',
    },
  },
});

const TSSReports = MaterialTable as MaterialTableCtorType<any>;

type TSSReportsComponentProps = {
  item: {
    name: string;
    url: string;
    'last-update': string;
  }[];
};

const TSSReportsComponent: React.FC<TSSReportsComponentProps> = (props) => {
  const [item] = useState(props.item);

  const classes = styles();

  const downloadTSSReport = (url: string) => {
    let fileName = url.substring(
      url.lastIndexOf('/') + 1,
    );
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
        const reportUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = reportUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(reportUrl);
        alert('Report has downloaded!');
      })
      .catch(() => alert('oh no! something went wrong'));
  };

  return (
    <>
      <TSSReports stickyHeader tableId='device-table' columns={[
        {
          property: 'name', title: 'Name', type: ColumnType.custom, customControl: ({ rowData }) => {
            if (rowData.url === '') {
              return (<>{rowData.name}</>);
            } else {
              return (<a href={rowData.url} target='_blank'  > {rowData.name} </a>);
            }
          },
        },
        {
          property: 'url', title: 'Action', type: ColumnType.custom, customControl: ({ rowData }) => {
            if (rowData.url === '') {
              return (<IconButton disabled>  <FontAwesomeIcon icon={faDownload} /> </IconButton>);
            } else {
              return (
                <FontAwesomeIcon icon={faDownload} className={classes.root} onClick={(event) => { event.stopPropagation(); downloadTSSReport(rowData.url); }} />
              );
            }
          },
        },
      ]} idProperty='id' rows={item} >
      </TSSReports>
    </>
  );
};

export const TSSReportsView = TSSReportsComponent;
export default TSSReportsView;
