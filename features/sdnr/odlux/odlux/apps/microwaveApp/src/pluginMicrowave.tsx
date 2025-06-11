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

// app configuration and main entry point for the app

import React, { FC } from 'react';
import applicationManager from '../../../framework/src/services/applicationManager';
import { requestRest } from '../../../framework/src/services/restService';

import { Antenna } from './linkCalculator/model/antenna';
import { Link } from './linkCalculator/model/link';
import { Radio } from './linkCalculator/model/radio';
import { ModelType } from './linkCalculator/model/topologyTypes';
import { Waveguide } from './linkCalculator/model/waveguide';

import { Redirect, Route, RouteComponentProps, Switch, useLocation, withRouter } from 'react-router-dom';
import { useApplicationDispatch } from '../../../framework/src/flux/connect';
import { SetPassedInValues, SetReachableAction } from './lineOfSight/actions/lineOfSightCommonActions';
import { TERRAIN_URL, TILE_URL } from './lineOfSight/config';
import { isNumber } from './lineOfSight/utils/lineOfSightMath';
import { FirstMandatoryCheckAction } from './linkCalculator/actions/errorAction';
import { UpdateModelTypesAction, UpdateRegionRegulatorListAction } from './linkCalculator/actions/queryActions';
import { UpdateDevicesOnFirstLoad } from './linkCalculator/actions/radioActions';
import { PluginDoneLoadingAction, ResetFormAction } from './linkCalculator/actions/viewAction';
import RootHandler from './linkCalculator/handlers/rootHandler';
import  dataService from './linkCalculator/service/dataService';
import MainView from './linkCalculator/views/mainView';
import { Channel, RegionRegulator } from './linkCalculator/model/bandPlan';
import { getAllBands, getFrequencyplans, updateSavedChannels } from './linkCalculator/actions/bandPlanAction';
import { SaveChannel } from './linkCalculator/model/updateLink';

const appIcon = require('./linkCalculator/assets/icons/microwaveAppIcon.svg');  // select app icon

export const BASE_URL = '/topology/linkcalculator';





const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MicrowaveRouteAdapter = ((props: RouteComponentProps<{ mountId?: string }>) => {
  const dispatch = useApplicationDispatch();

  const resetForm = () => dispatch(new ResetFormAction());
  const updateRegulatorList = (regionRegulatorList: RegionRegulator[]) => dispatch(new UpdateRegionRegulatorListAction(regionRegulatorList));
  const updateModelTypes = (modelTypes: ModelType[]) => dispatch(new UpdateModelTypesAction(modelTypes));
  const updateDevicesOnFirstLoad = async (antennas: Antenna[], radios: Radio[], waveguides: Waveguide[], linkAttributes: Link) => {
    dispatch(await new UpdateDevicesOnFirstLoad(antennas, radios, waveguides, linkAttributes));
    dispatch(new FirstMandatoryCheckAction());
    dispatch(new PluginDoneLoadingAction(true));
    dispatch(getAllBands(linkAttributes.operationalParameters.bandplanKeyId));
    dispatch(getFrequencyplans(linkAttributes.siteA.id, linkAttributes.siteB.id, linkAttributes.operationalParameters.bandKeyId));

  };
  const getSavedChannels = async (savedChannels: SaveChannel[], allChannels: Channel[]) => dispatch(updateSavedChannels(savedChannels, allChannels));
  let query = useQuery();
  // called when component finished mounting

  const extractLinkIDFromURL = (queryParam: URLSearchParams) => {
    return queryParam.get('linkId');
  };

  React.useEffect(() => {
    const linkId = extractLinkIDFromURL(query);
    const linkAttributes = requestRest<Link>(`${BASE_URL}/link/${linkId}`);
    const regulators = dataService.bandPlanRegulators();


    const modelTypeListQuery = dataService.modelTypeListQuery();
    const queryArray = [regulators, modelTypeListQuery, linkAttributes];
    if (linkId) {
      Promise.all(queryArray).then(async values => {

        let radios: Radio[] = [];
        let antennas: Antenna[] = [];
        let waveguides: Waveguide[] = [];
        await dataService.getModels(values[2].operationalParameters.bandKeyId, 'radio')!.then((x: Radio[]) => {
          radios = x;
        });
        await dataService.getModels(values[2].operationalParameters.bandKeyId, 'radio-antenna')!.then((x: Antenna[]) => {
          antennas = x;
        });
        await dataService.getModels(values[2].operationalParameters.bandKeyId, 'radio-to-antenna-link')!.then((x: Waveguide[]) => {
          waveguides = x;
        });
        updateRegulatorList(values[0]);
        updateModelTypes(values[1]);

        if (values[2].operationalParameters.selectedChannelList && values[2].operationalParameters.selectedChannelList.length > 0) {
          const channelQueryPromise = await dataService.channelQuery(values[2].operationalParameters.bandplanKeyId, values[2].operationalParameters.bandKeyId);
          if (channelQueryPromise.data) {
            getSavedChannels(values[2].operationalParameters.selectedChannelList, channelQueryPromise.data);
          }
        }

        updateDevicesOnFirstLoad(antennas, radios, waveguides, values[2]);

      });
    } else {
      resetForm();
    }
  }, []);


  React.useEffect(() => {
    if (props.location.pathname === '/microwave' && props.location.search.length == 0) {
      resetForm();
    }
  }, [props.location.pathname, props.location.search]);

  return (
    <MainView activePanel="linkCalculation" />
  );
});

type AppProps = RouteComponentProps;
const LineOfSightApplicationRouteAdapter: FC<AppProps> = () => {
  const dispatch = useApplicationDispatch();
  const setPassedInValues = (values: (string | null)[]) => dispatch(SetPassedInValues(values));
  const setReachable = (reachable: boolean) => dispatch(new SetReachableAction(reachable));
  let query = useQuery();

  /***
   * 
   * Checks if lat1, lon1, lat2, lon2 were passed in as url parameters
   */
  const areMandatoryParamsPresent = (queryParams: URLSearchParams) => {
    return isNumber(queryParams.get('lat1')) && isNumber(queryParams.get('lon1')) && isNumber(queryParams.get('lat2')) && isNumber(queryParams.get('lon2'));
  };

  const extractValuesFromURL = (queryParams: URLSearchParams) => {
    return [queryParams.get('lat1'), queryParams.get('lon1'), queryParams.get('lat2'), queryParams.get('lon2'), queryParams.get('amslA'), queryParams.get('antennaHeightA'), query.get('amslB'), queryParams.get('antennaHeightB')];
  };

  const extractAndDispatchUrlValues = () => {
    //if mandatory values aren't there, do nothing
    if (areMandatoryParamsPresent(query)) {
      const values = extractValuesFromURL(query);
      setPassedInValues(values);
    }
  };

  const tryCheckConnection = () => {
    const terrain = fetch(`${TERRAIN_URL}/`);
    const tiles = fetch(`${TILE_URL}/10/0/0.png`);

    Promise.all([terrain, tiles])
      .then((result) => {
        setReachable(result[0].ok && result[1].ok);
      })
      .catch(error => {
        console.error('services not reachable.');
        console.error(error);
        setReachable(false);
      });
  };

  // called when component finshed mounting
  React.useEffect(() => {
    extractAndDispatchUrlValues();
    //check tiles/terrain connectivity
    tryCheckConnection();

  }, []);

  return (
    <MainView activePanel='lineOfSight' />
  );
};

const App = withRouter((props: RouteComponentProps) => {
  props.history.action = 'POP';
  return (
    <Switch>
      <Route path={`${props.match.path}/calculateLink/:linkId`} component={MicrowaveRouteAdapter} />
      <Route path={`${props.match.path}/calculateLink`} component={MicrowaveRouteAdapter} />
      <Route path={`${props.match.path}/lineOfSightMap`} component={LineOfSightApplicationRouteAdapter} />
      <Route path={`${props.match.path}`} component={MainView} />
      <Redirect to={`${props.match.path}`} />
    </Switch>
  );
});

export function register() {
  applicationManager.registerApplication({
    name: 'microwave',
    icon: appIcon,
    rootActionHandler: RootHandler,
    rootComponent: App,
    menuEntry: 'Microwave',
  });
}



