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
import { Model } from '../model/topologyTypes';
import { Radio, RadioEverything, RadioOperationalParameters } from '../model/radio';
import { Waveguide } from '../model/waveguide';
import { Antenna } from '../model/antenna';

export const getWaveguideList = (modelTypeList: Model[]) => {
  let waveguides: Waveguide[] = [];

  modelTypeList.forEach(modeltype => {
    if (modeltype.type?.name === 'radio-to-antenna-link') {
      waveguides.push(modeltype);


    }
  });
  return waveguides;
};
export const radioService = async (radioA: string | null, radioB: string | null, radios : Radio []) => {
  let operationalParametersA: RadioOperationalParameters | null = null;
  let operationalParametersB: RadioOperationalParameters | null = null;
  let modulationListA: string[] = [];
  let modulationListB: string[] = [];
  let radioIdSiteA: number | null = null;
  let radioIdSiteB: number | null = null;

  radios.forEach((element: Radio) => {
    if (radioA !== null && radioA === element.modelName) {
      operationalParametersA = element.operationalParameters;

      radioIdSiteA = element.id;
      Object.keys(operationalParametersA?.modulations!).forEach((modulation) => {
        if (modulation.endsWith('QAM') || modulation.endsWith('PSK')) {
          modulationListA.push(modulation);
        }
      });
    }
  });
  radios.forEach((element: Radio) => {
    if (radioB !== null && radioB === element.modelName) {
      operationalParametersB = element.operationalParameters;
      radioIdSiteB = element.id;

      Object.keys(operationalParametersB?.modulations!).forEach((modulation) => {
        if (modulation.endsWith('QAM') || modulation.endsWith('PSK')) {
          modulationListB.push(modulation);
        }
      });
    }
  });
  const transport: RadioEverything = { operationalParametersA, operationalParametersB, modulationListA, modulationListB, radioIdSiteA, radioIdSiteB };
  return transport;
};
export const getRadioList = (modelTypeList: Model[] | undefined | null) => {

  let radios: Radio[] = [];
  modelTypeList!.forEach(modeltype => {
    if (modeltype.type.name === 'radio') {

      radios.push(modeltype);
    } 
  });
  return radios;
};
export const getAntennaList = (modelTypeList: Model[] | undefined | null) => {
  let antennas: Antenna[] = [];

  modelTypeList!.forEach(element => {

    if (element.type.name === 'radio-antenna') {
      antennas.push(element);


    } 
  });

  return antennas;
};
