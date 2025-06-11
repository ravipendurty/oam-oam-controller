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

import { MaterialTable, MaterialTableCtorType, ColumnType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { createLinkTableActions, createLinkTablePreActions, createLinkTableProperties } from '../handlers/linkTableHandler';

const LinkTable = MaterialTable as MaterialTableCtorType<any>;

type LinkTableComponentProps = {
  preFilterType: {
    id: string;
    type: string;
  };
};

const LinkTableView: React.FC<LinkTableComponentProps> = (props) => {
  const linkTableProperties = useSelectApplicationState((state: IApplicationStoreState) => createLinkTableProperties(state));

  const dispatch = useApplicationDispatch();
  const linkTableActions = createLinkTableActions(dispatch);
  const linkTablePreActions = createLinkTablePreActions(dispatch);

  useEffect(() => {
    const tablePreFilter = {
      'siteId': props.preFilterType.id,
      type: props.preFilterType.type,
    };
    linkTableActions.onClearFilters();
    linkTablePreActions.onPreFilterChanged(tablePreFilter);
  }, [props.preFilterType.id, props.preFilterType.type]);

  return (
    <>
      <LinkTable stickyHeader tableId='link-table' columns={[
        { property: 'id', title: 'Id', type: ColumnType.numeric },
        { property: 'type', title: 'Link Type', type: ColumnType.text },
        {
          property: 'siteA', title: 'SiteA', type: ColumnType.custom, customControl: ({ rowData }) => {
            return (
              <div>
                {rowData.siteA.id}
              </div>
            );
          },
        },
        {
          property: 'siteB', title: 'SiteB', type: ColumnType.custom, customControl: ({ rowData }) => {
            return (
              <div>
                {rowData.siteB.id}
              </div>
            );
          },
        },
        { property: 'operationalState', title: 'operational State', type: ColumnType.text },
        { property: 'operatorId', title: 'Operator Id', type: ColumnType.text },
        { property: 'lifecycleState', title: 'life Cycle State', type: ColumnType.text },
      ]} idProperty='id' {...linkTableActions} {...linkTableProperties}  >
      </LinkTable>
    </>
  );
};

export default LinkTableView;
