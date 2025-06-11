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
import  React, { FC, useEffect } from 'react';

import { Loader } from '../../../../../framework/src/components/material-ui/loader';

import { NavigateToApplication } from '../../../../../framework/src/actions/navigationActions';
import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { Link } from '../../lineOfSight/model/lineOfSightLatLon';
import { getLinkDetails } from '../../lineOfSight/service/lineOfSightHeightService';
import { createLinkTableActions, createLinkTableProperties } from '../handlers/linkTableHandler';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';



const LinkTable = MaterialTable as MaterialTableCtorType<any>;


let initialSorted = false;

const LinkTableComponent: FC = (() => {

  const linkTableProperties = createLinkTableProperties(useSelectApplicationState(state => state));
  const loading = linkTableProperties.loading;
  const dispatch = useApplicationDispatch();
  const linkTableActions =  createLinkTableActions(dispatch);
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path));

  useEffect(() => {
    if (!initialSorted) {
      initialSorted = true;
      linkTableActions.onHandleRequestSort('id');
    } else {
      linkTableActions.onRefresh();
    }
  }, []);

  const getContextMenu = (rowData: any) => {
    return [
      <MenuItem aria-label={'calculate-link-button'} onClick={() => {
        navigateToApplication('microwave', `calculateLink/?linkId=${rowData.id}`);
      }}>
        <Typography>Calculate Link</Typography>
      </MenuItem>,
      <MenuItem aria-label={'lineOfSight-link-button'} onClick={async () => {
        await getLinkDetails(rowData.id).then((data: Link) => {
          let heightPart = `&amslA=${data.siteA.amslM}&antennaHeightA=${data.siteA.radioAntenna.operationalParameters.agl}&amslB=${data.siteB.amslM}&antennaHeightB=${data.siteB.radioAntenna.operationalParameters.agl}`;
          navigateToApplication('microwave', `lineOfSightMap/los?lat1=${data.siteA.lat}&lon1=${data.siteA.lon}&lat2=${data.siteB.lat}&lon2=${data.siteB.lon}${heightPart}`);
        });
      }}>
        <Typography>Line Of Sight</Typography>
      </MenuItem>,
    ];
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flex: '1',
          zIndex: 9999,
        }}
      >
        {loading && (
          <div >
            <Loader />
            <h3>Loading...</h3>
          </div>
        )
        }
      </div>
      <LinkTable stickyHeader tableId="link-table" columns={[
        { property: 'id', title: 'Id', type: ColumnType.numeric },
        {
          property: 'siteA', title: 'SiteA', type: ColumnType.custom, customControl: ({ rowData }) => {
            return <>{rowData.siteA.id}</>;
          },
        },
        {
          property: 'siteB', title: 'SiteB', type: ColumnType.custom,
          customControl: ({ rowData }) => {
            return <>{rowData.siteB.id}</>;
          },
        },
        { property: 'operationalState', title: 'operational State', type: ColumnType.text },
        { property: 'operatorId', title: 'Operator Id', type: ColumnType.text },
        { property: 'lifecycleState', title: 'life Cycle State', type: ColumnType.text },
      ]}
        idProperty="id"  {...linkTableActions}  {...linkTableProperties}
        createContextMenu={(rowData) => {
          return getContextMenu(rowData);
        }} />
    </div>
  );
});


export default LinkTableComponent;