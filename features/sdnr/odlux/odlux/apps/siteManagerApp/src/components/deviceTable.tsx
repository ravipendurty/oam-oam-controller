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
import React, { useEffect } from 'react';
import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { createDeviceTableActions, createDeviceTablePreActions, createDeviceTableProperties } from '../handlers/deviceTableHandler';

const DeviceTable = MaterialTable as MaterialTableCtorType<any>;

type DeviceTableComponentProps = {
  preFilterType: {
    id: string;
  };
};

const DeviceTableComponent: React.FC<DeviceTableComponentProps> = (props) => {

  const deviceTableProperties = useSelectApplicationState((state: IApplicationStoreState) => createDeviceTableProperties(state));

  const dispatch = useApplicationDispatch();
  const deviceTableActions = createDeviceTableActions(dispatch);
  const deviceTablePreActions = createDeviceTablePreActions(dispatch);

  useEffect(() => {
    const tablePreFilter = {
      'siteId': props.preFilterType.id,
    };
    deviceTableActions.onClearFilters();
    deviceTablePreActions.onPreFilterChanged(tablePreFilter);
  }, [props.preFilterType.id]);


  return (
    <>
      <DeviceTable stickyHeader tableId='device-table' columns={[
        { property: 'nodeId', title: 'Node ID', type: ColumnType.text },
        { property: 'id', title: 'Id', type: ColumnType.numeric },
        { property: 'areaId', title: 'Area Id', type: ColumnType.text },
        { property: 'areaName', title: 'Area Name', type: ColumnType.text },
        { property: 'siteId', title: 'Site ID', type: ColumnType.text },
        { property: 'siteName', title: 'Site Name', type: ColumnType.text },
      ]} idProperty='id' {...deviceTableActions} {...deviceTableProperties}  >
      </DeviceTable>
    </>
  );
};

export const DeviceTableView = DeviceTableComponent;
export default DeviceTableView;