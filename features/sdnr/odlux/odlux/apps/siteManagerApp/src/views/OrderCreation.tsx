/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { SelectElementAction } from '../actions/detailsAction';
import { getUsersAction } from '../actions/sitedocManagementAction';
import CreateNewOrder from '../components/createNewOrder';
import { Site } from '../models/site';
import sitedocDataService from '../services/sitedocDataService';

type orderProps = RouteComponentProps & {
  siteId: string;
  onClose: (siteId: string) => void;
  onError: () => void;
};

const OrderCreation = (props: orderProps) => {
  const dispatch = useApplicationDispatch();
  const getUsersActions = () => dispatch(getUsersAction);
  const selectSite = (site: Site) => dispatch(new SelectElementAction(site));

  const [showForm, setShowForm] = React.useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [siteInfo, setSiteInfo] = React.useState('');
  //on mount
  React.useEffect(() => {
    getUsersActions();
    if (props.siteId) {
      setShowForm(true);
    } else {
      setShowForm(false);
      sitedocDataService.getSiteIfExists(props.siteId).then(res => {
        if (res) {
          selectSite(res);
          setShowForm(true);
        } else {
          setSiteInfo('Site not found.');
        }
      });
    }
  }, []);

  const onCancel = (siteId: string) => {
    props.onClose && props.onClose(siteId);
  };

  const onError = () => {
    props.onError && props.onError();
  };

  return <>
    {
      (props.siteId === null) ?
        <div>Check if site exists...</div>
        :
        !showForm
          ? <div>
            <div>Site does not exist</div>
          </div>
          : <CreateNewOrder siteId={props.siteId} onClose={onCancel} onError={onError} />
    }
  </>;
};

const CreateOrderView = withRouter(OrderCreation);

export default CreateOrderView;