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

const useStyles = makeStyles({
  root: {
    '&:hover': {
      color: 'blue',
    },
  },
  previewImage: {
    cursor: 'pointer',
    height: 120,
    width: 120,
    marginTop: '10px',
    marginLeft: '10px',
  },
});

const Pictures = MaterialTable as MaterialTableCtorType<any>;

type PicturesComponentProps = {
  item: {
    name: string;
    url: string;
    'last-update': string;
  }[];
};

type SiteManagerPicturesComponentProps = PicturesComponentProps;

const PicturesViewComponent: React.FC<SiteManagerPicturesComponentProps> = (props: SiteManagerPicturesComponentProps) => {
  const [item] = useState(props.item);

  const classes = useStyles();

  const downloadPicture = (url: string) => {
    let fileName = url.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.'),
    );
    fetch(url)
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const reportUrl = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = reportUrl;
          link.setAttribute('download', fileName + '.jpg');
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(() => alert('oh no! something went wrong'));
  };

  return (
    <>
      <Pictures stickyHeader tableId='device-table' columns={[
        {
          property: 'name', title: 'Name', type: ColumnType.custom, customControl: ({ rowData }) => {
            if (rowData.url === '') {
              return (<>{rowData.name} </>);
            } else {
              return (<a href={rowData.url} target='_blank'  > {rowData.name} </a>);
            }
          },
        },
        {
          property: 'preview', title: 'Photo Preview', type: ColumnType.custom, customControl: ({ rowData }) => {
            return <img className={classes.previewImage} src={rowData.url} alt="Preview" />;
          },
        },
        {
          property: 'url', title: 'Action', type: ColumnType.custom, customControl: ({ rowData }) => {
            if (rowData.url === '') {
              return (<IconButton disabled>  <FontAwesomeIcon icon={faDownload} /> </IconButton>);
            } else {
              return (
                <FontAwesomeIcon icon={faDownload} className={classes.root} onClick={(event) => { event.stopPropagation(); downloadPicture(rowData.url); }} />
              );
            }
          },
        },
      ]} idProperty='id' rows={item}  >
      </Pictures>
    </>
  );
};

export const PicturesView = PicturesViewComponent;
export default PicturesView;