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

import dataService  from '../service/dataService';
import { Action } from '../../../../../framework/src/flux/action';
import { Dispatch } from '../../../../../framework/src/flux/store';
import { Radio, RadioEverything } from '../model/radio';
import { Modulation } from '../model/modulation';

import { Antenna } from '../model/antenna';
import { Waveguide  } from '../model/waveguide';
import { FirstMandatoryCheckAction } from './errorAction';
import { Link } from '../model/link';
import { radioService } from '../service/processingService';

export class UpdateFrequencyAction extends Action {
  constructor(public frequency: number) {
    super();

  }
}
export class UpdateTxPowerAction extends Action {
  constructor(public txPowerA: number | null, public txPowerB: number | null) {
    super();
  }
}
export class UpdateRxSensitivityAction extends Action {
  constructor(public thresholdBER3A: number | null, public thresholdBER6A: number | null, public thresholdBER3B: number | null, public thresholdBER6B: number | null) {
    super();
  }
}
export class UpdateRxPowerAction extends Action {
  constructor(public rxPowerA: number, public rxPowerB: number) {
    super();
  }
}
export class UpdateSomAction extends Action {
  constructor(public somA: number, public somB: number) {
    super();
  }
}
export class UpdateRadioListAction extends Action {
  constructor(public radioNameList: string[]) {
    super();
  }
}

export class UpdateRadioAction extends Action {
  constructor(public radioNameA: string | null, public radioNameB: string | null) {
    super();
  }
}
export class radioMandatoryParametersAction extends Action {
  constructor(public radioMandatoryParameters: boolean) {
    super();
  }
}
export class frequencyMandatoryParametersAction extends Action {
  constructor(public frequencyMandatoryParameters: boolean) {
    super();
  }
}

export class UpdateRadioParametersAction extends Action {
  constructor(public radioParameters: Radio[]) {
    super();
  }
}
export class radioBandwidthAction extends Action {
  constructor(public radioBandwidthA: number | null, public radioBandwidthB: number | null) {
    super();
  }
}
export class UpdateRadioIdAction extends Action {
  constructor(public radioIdSiteA: number | null, public radioIdSiteB: number | null) {
    super();
  }
}

export class UpdateModulationListAction extends Action {
  constructor(public modulationListA: string[] | null, public modulationListB: string[] | null) {
    super();
  }
}
export class UpdateModulationAction extends Action {
  constructor(public modulationA: string | null, public modulationB: string | null) {
    super();
  }
}

export class UpdateModulationParametersAction extends Action {
  constructor(public modulationParametersA: Modulation | null, public modulationParametersB: Modulation | null) {
    super();
  }
}

export class ResetAction extends Action {
}
export class UpdateDeviceListsOnBandChangeAction extends Action {
  constructor(
    public antennas: Antenna[],
    public radioList: Radio[],
    public waveguideList: Waveguide[]) {
    super();
  }
}
export class UpdateDevicesOnFirstLoad extends UpdateDeviceListsOnBandChangeAction {
  constructor(
    public antennas: Antenna[],
    public radioList: Radio[],
    public waveguideList: Waveguide[],
    public linkAttributes: Link ) {
    super(antennas, radioList, waveguideList);
  }
}

export class UpdateRadioEverything extends Action {
  constructor(public transport: RadioEverything) {
    super();
  }
}
export class UpdateTotalBandwidthAction extends Action {
  constructor(public totalBandwidthMHz: number) {
    super();
  }
}

export class UpdateEnabeldAdaptiveModulations extends Action {
  constructor(public enabledAdaptiveModulations: string[]) {
    super();
  }
}
export const updateFrequencyBand = (bandKeyId: string) => async (dispatcher: Dispatch) => {
  dispatcher( new ResetAction());
  dispatcher(new UpdateFrequencyAction(Number(bandKeyId.replace('$', ''))));
  dispatcher(new FirstMandatoryCheckAction());


  let radios: Radio[] = [];
  let antennas: Antenna[] = [];
  let waveguides: Waveguide[] = [];
  await dataService.getModels(bandKeyId, 'radio')!.then((x: Radio[]) => {
    radios = x;
  });
  await dataService.getModels(bandKeyId, 'radio-antenna')!.then((x: Antenna[]) => {
    antennas = x;
  });
  await dataService.getModels(bandKeyId, 'radio-to-antenna-link')!.then((x: Waveguide[]) => {
    waveguides = x;
  });
  dispatcher(new UpdateDeviceListsOnBandChangeAction(antennas, radios, waveguides));
};
export const revertAntennaRadioWaveguideattributes = () => async (dispatcher: Dispatch) => {
  dispatcher(new ResetAction());
};
export const updateRadioAttributes = (radioA: string | null, radioB: string | null, radioParameters: Radio[]) => async (dispatcher: Dispatch) => {
  dispatcher(new UpdateRadioAction(radioA, radioB));
  const radios: RadioEverything = await radioService(radioA, radioB, radioParameters); 
  dispatcher(new UpdateRadioEverything(radios));
};


