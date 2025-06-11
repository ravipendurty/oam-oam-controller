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

import  dataService  from '../service/dataService';
import { Dispatch } from '../../../../../framework/src/flux/store';
import { IApplicationStoreState } from '../../../../../framework/src/store/applicationStore';
import { UpdateDistanceAction } from './linkAction';
import { CalculationResult } from '../model/calculationResult';
import { UpdateCalculationResultAction } from './commonActions';

export const calculateButtonAction = () => async (dispatch: Dispatch, getState: () => IApplicationStoreState) => {

  const {
    microwave: {
      site: { lat1, lon1, lat2, lon2 },
      link: { polarization, distance },
      radio: { band, txPowerA, txPowerB, thresholdBER3A, thresholdBER3B, radioMandatoryParameters, frequencyMandatoryParameters },
      atmosphere: { worstMonth, rainVal, attenuationMethod, rainMethod, attenuationMandatoryParameters },
      antenna: { antennaGainA, antennaGainB, antennaMandatoryParameters },
      waveguide: { waveguideMandatoryParameters, waveguideIdSiteA, waveguideIdSiteB,  waveguideLengthACalculate, waveguideLengthBCalculate },
    },
  } = getState();

  let distanceInKm;
  // const autoDistance = await dataServices.updateAutoDistance(lat1, lon1, lat2, lon2);

  if (distance !== 0) {
    distanceInKm = distance;
  } else {
    distanceInKm = (await dataService.updateAutoDistance(lat1, lon1, lat2, lon2))!.distanceInKm;
    dispatch(new UpdateDistanceAction(distanceInKm));
  }

  let rainLoss;
  if (rainMethod === 'ITURP8377') {
    rainLoss = await dataService.rainAttenuation(lat1, lon1, lat2, lon2, band.keyId, polarization!, worstMonth);
  } else if (rainMethod === 'MANUAL') {
    if (rainVal !== 0) {
      rainLoss = await dataService.manualRain(rainVal, band.keyId, distanceInKm, polarization!);
    }
  }
  let linkBudget;
  let waveguideLoss;
  const freeSpaceLoss = await dataService.FSL(distanceInKm, band.keyId);
  const absorptionLoss = await dataService.AbsorptionAtt(lat1, lon1, lat2, lon2, band.keyId, worstMonth, attenuationMethod);

  waveguideLoss = await dataService.waveguideLoss(waveguideIdSiteA, waveguideIdSiteB, waveguideLengthACalculate, waveguideLengthBCalculate);

  if (antennaMandatoryParameters && radioMandatoryParameters && frequencyMandatoryParameters && attenuationMandatoryParameters && waveguideMandatoryParameters && waveguideLoss) {
    linkBudget = await dataService.linkBudget(lat1, lon1, lat2, lon2, band.keyId, attenuationMethod, polarization!, antennaGainA, antennaGainB, waveguideLoss.waveguideLossA, waveguideLoss.waveguideLossB, txPowerA!, txPowerB!, thresholdBER3A!, thresholdBER3B!);
  }
  let result = new CalculationResult();
  if (rainLoss && rainLoss.rainAttenuation) result.rainLoss = rainLoss;
  if (freeSpaceLoss) result.freeSpaceLoss = freeSpaceLoss;
  if (absorptionLoss && absorptionLoss.oxygenLoss && absorptionLoss.waterLoss) result.absorptionLoss = absorptionLoss;
  if (waveguideLoss) result.waveguideLoss = waveguideLoss;
  if (linkBudget && linkBudget.receivedPowerA && linkBudget.receivedPowerB ) result.linkBudget = linkBudget;
  if (result) dispatch(new UpdateCalculationResultAction(result));
};

