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

import { IActionHandler } from '../../../../../framework/src/flux/action';
import { AdaptiveModulationTable } from '../model/adaptiveModulationTable';
import { UpdateCalculationResultAction } from '../actions/commonActions';
import { FirstMandatoryCheckAction } from '../actions/errorAction';
import {
  frequencyMandatoryParametersAction, radioBandwidthAction, radioMandatoryParametersAction, ResetAction,
  UpdateDeviceListsOnBandChangeAction, UpdateDevicesOnFirstLoad, UpdateEnabeldAdaptiveModulations,
  UpdateFrequencyAction, UpdateModulationAction, UpdateModulationListAction, UpdateRadioAction, UpdateRadioEverything, UpdateRadioIdAction,
  UpdateRadioListAction, UpdateRadioParametersAction, UpdateModulationParametersAction, UpdateRxPowerAction, UpdateRxSensitivityAction, UpdateSomAction,
  UpdateTxPowerAction,
  UpdateTotalBandwidthAction,
} from '../actions/radioActions';
import { Modulation } from '../model/modulation';
import { Radio } from '../model/radio';
import { ResetFormAction } from '../actions/viewAction';
import { UpdateAdaptiveModulationProcessing, UpdateAdaptiveModulationTableAction } from '../actions/adaptiveModulationAction';

export type radioState = {
  systemOperatingMarginA: number;
  systemOperatingMarginB: number;
  txPowerA: number;
  txPowerB: number;
  thresholdBER3A: number | null;
  thresholdBER6A: number | null;
  thresholdBER3B: number | null;
  thresholdBER6B: number | null;
  rxPowerA: number;
  rxPowerB: number;
  band: {
    frequency: number;
    keyId:string;
  };
  radioNameA: string;
  radioNameB: string;
  radioMandatoryParameters: boolean;
  frequencyMandatoryParameters: boolean;
  radioParameters: Radio[];
  radioBandwidthA: number;
  radioBandwidthB: number;
  modulationListA: string[];
  modulationListB: string[];
  radioNameList: string[];
  modulationA: string;
  modulationB: string;
  radioIdSiteA: number;
  radioIdSiteB: number;
  modulationParametersA: Modulation | null;
  modulationParametersB: Modulation | null;
  adaptiveModulationTableAtoB: AdaptiveModulationTable[] | null | undefined;
  adaptiveModulationTableBtoA: AdaptiveModulationTable[] | null | undefined;
  enabledAdaptiveModulations: string[];
  processing: boolean;
  admStatus: number;
  admMessage: string;
  totalBandwidthMHz: number;
};

const initialState: radioState = {
  systemOperatingMarginA: 0,
  systemOperatingMarginB: 0,
  txPowerA: 0,
  txPowerB: 0,
  thresholdBER3A: 0,
  thresholdBER6A: 0,
  thresholdBER3B: 0,
  thresholdBER6B: 0,
  radioNameList: [],
  rxPowerA: 0,
  rxPowerB: 0,
  band: {
    frequency: 0,
    keyId:'0',
  },
  radioNameA: '',
  radioNameB: '',
  radioMandatoryParameters: true,
  frequencyMandatoryParameters: true,
  radioParameters: [],
  radioBandwidthA: 0,
  radioBandwidthB: 0,
  modulationListA: [],
  modulationListB: [],
  modulationA: '',
  modulationB: '',
  radioIdSiteA: 0,
  radioIdSiteB: 0,
  modulationParametersA: {
    capE1: '',
    dfm56QAM: '',
    fktb: '',
    minDelay: '',
    minSigBw: '',
    minSigHt: '',
    modDsOffset: '',
    netFilterDf: '',
    nonMinDelay: '',
    nonMinSigBw: '',
    nonMinSigHt: '',
    rslDist: '',
    rslMin: '',
    rxMin: '',
    rxThr3BER: 0,
    rxThr6BER: 0,
    throughput: '',
    txMax: '',
    txMin: '',
    xpif: '',
  },
  modulationParametersB: {
    capE1: '',
    dfm56QAM: '',
    fktb: '',
    minDelay: '',
    minSigBw: '',
    minSigHt: '',
    modDsOffset: '',
    netFilterDf: '',
    nonMinDelay: '',
    nonMinSigBw: '',
    nonMinSigHt: '',
    rslDist: '',
    rslMin: '',
    rxMin: '',
    rxThr3BER: 0,
    rxThr6BER: 0,
    throughput: '',
    txMax: '',
    txMin: '',
    xpif: '',
  },
  adaptiveModulationTableAtoB: [],
  adaptiveModulationTableBtoA: [],
  enabledAdaptiveModulations: [],
  processing: true,
  admStatus: 0,
  admMessage: '',
  totalBandwidthMHz: 0,
};


export const RadioHandler: IActionHandler<radioState> = (state = initialState, action) => {
  if (action instanceof UpdateFrequencyAction) {
    state = Object.assign({}, state, { band:{ frequency: action.frequency, keyId: '$' + action.frequency.toString() } });

  } else if (action instanceof UpdateTxPowerAction) {
    state = Object.assign({}, state, { txPowerA: action.txPowerA || state.txPowerA, txPowerB: action.txPowerB || state.txPowerB });
  } else if (action instanceof UpdateRxSensitivityAction) {
    state = Object.assign({}, state, {
      thresholdBER3A: action.thresholdBER3A == null ? state.thresholdBER3A : action.thresholdBER3A,
      thresholdBER6A: action.thresholdBER6A == null ? state.thresholdBER6A : action.thresholdBER6A,
      thresholdBER3B: action.thresholdBER3B == null ? state.thresholdBER3B : action.thresholdBER3B,
      thresholdBER6B: action.thresholdBER6B == null ? state.thresholdBER6B : action.thresholdBER6B,
    });
  } else if (action instanceof UpdateRxPowerAction) {
    state = Object.assign({}, state, { rxPowerA: action.rxPowerA, rxPowerB: action.rxPowerB });
  } else if (action instanceof UpdateSomAction) {
    state = Object.assign({}, state, { systemOperatingMarginA: action.somA, systemOperatingMarginB: action.somB });
  } else if (action instanceof ResetFormAction) {
    state = Object.assign({}, initialState, { radioMandatoryParameters: false, frequencyMandatoryParameters: false });
  } else if (action instanceof UpdateRadioListAction) {
    state = Object.assign({}, state, { radioNameList: action.radioNameList });
  } else if (action instanceof UpdateRadioAction) {
    state = Object.assign({}, state, { radioNameA: action.radioNameA == null ? state.radioNameA : action.radioNameA, radioNameB: action.radioNameB == null ? state.radioNameB : action.radioNameB });
  } else if (action instanceof radioMandatoryParametersAction) {
    state = Object.assign({}, state, { radioMandatoryParameters: action.radioMandatoryParameters });
  } else if (action instanceof frequencyMandatoryParametersAction) {
    state = Object.assign({}, state, { frequencyMandatoryParameters: action.frequencyMandatoryParameters });
  } else if (action instanceof UpdateRadioParametersAction) {
    state = Object.assign({}, state, { radioParameters: action.radioParameters });
  } else if (action instanceof radioBandwidthAction) {
    state = Object.assign({}, state, { radioBandwidthA: action.radioBandwidthA == null ? state.radioBandwidthA : action.radioBandwidthA, radioBandwidthB: action.radioBandwidthB == null ? state.radioBandwidthB : action.radioBandwidthB });
  } else if (action instanceof UpdateModulationListAction) {
    state = Object.assign({}, state, { modulationListA: action.modulationListA == null ? state.modulationListA : action.modulationListA, modulationListB: action.modulationListB == null ? state.modulationListB : action.modulationListB });
  } else if (action instanceof UpdateModulationAction) {
    state = Object.assign({}, state, {
      modulationA: action.modulationA == null ? state.modulationA : action.modulationA,
      modulationB: action.modulationB == null ? state.modulationB : action.modulationB,
      enabledAdaptiveModulations: [action.modulationA],
    });
  } else if (action instanceof UpdateModulationParametersAction) {
    state = Object.assign({}, state, {
      modulationParametersA: action.modulationParametersA == null ? state.modulationParametersA : action.modulationParametersA,
      modulationParametersB: action.modulationParametersB == null ? state.modulationParametersB : action.modulationParametersB,
      txPowerA: action.modulationParametersA?.txMax || state.txPowerA, txPowerB: action.modulationParametersB?.txMax || state.txPowerB,
      thresholdBER3A: action.modulationParametersA?.rxThr3BER || state.thresholdBER3A, thresholdBER6A: action.modulationParametersA?.rxThr6BER || state.thresholdBER6A,
      thresholdBER3B: action.modulationParametersB?.rxThr3BER || state.thresholdBER3B, thresholdBER6B: action.modulationParametersB?.rxThr6BER || state.thresholdBER6B,
    });
  } else if (action instanceof UpdateRadioIdAction) {
    state = Object.assign({}, state, { radioIdSiteA: action.radioIdSiteA == null ? state.radioIdSiteA : action.radioIdSiteA, radioIdSiteB: action.radioIdSiteB == null ? state.radioIdSiteB : action.radioIdSiteB });
  } else if (action instanceof UpdateAdaptiveModulationTableAction) {
    state = Object.assign({}, state, { adaptiveModulationTableAtoB: action.adaptiveModulationTableAtoB, adaptiveModulationTableBtoA: action.adaptiveModulationTableBtoA, admMessage: action.message, admStatus: action.status, processing: false });
  } else if (action instanceof ResetAction) {
    state = {
      ...state, radioIdSiteA: 0, radioIdSiteB: 0, radioNameA: '', radioNameB: '', radioBandwidthA: 0,
      radioBandwidthB: 0, modulationA: '', modulationB: '', rxPowerA: 0, rxPowerB: 0, txPowerA: 0, txPowerB: 0, thresholdBER3A: 0,
      thresholdBER3B: 0, thresholdBER6A: 0, thresholdBER6B: 0, modulationListA: [], modulationListB: [], totalBandwidthMHz : 0,
    };
  } else if (action instanceof UpdateDevicesOnFirstLoad) {
    state = {
      ...state, band:{ frequency: Number(action.linkAttributes.operationalParameters.bandKeyId.replace('$', '')), keyId: action.linkAttributes.operationalParameters.bandKeyId },
      radioNameList: action.radioList.map(e => e.modelName),
      radioParameters: action.radioList,
      enabledAdaptiveModulations:  action.linkAttributes.siteA.radio?.operationalParameters.enabledAdmModulations!,
    };
    action.radioList.map(radio => {
      if (radio.modelName === action.linkAttributes.siteA.radio?.modelName) {
        state = {
          ...state, radioNameA: radio.modelName,
          modulationListA: Object.keys(radio.operationalParameters?.modulations!),
          radioIdSiteA: radio.id,
          radioBandwidthA: Number(radio.operationalParameters?.bandwith),
        };
        if (action.linkAttributes.siteA.radio?.operationalParameters.modulationType) {
          Object.entries(radio.operationalParameters?.modulations!).map(modulationParameters => {
            if (modulationParameters[0] === action.linkAttributes.siteA.radio?.operationalParameters.modulationType) {
              const modulationParametersA: any = modulationParameters[1];
              state = {
                ...state,
                thresholdBER3A: modulationParametersA.rxThr3BER,
                thresholdBER6A: modulationParametersA.rxThr6BER,
              };
            }
          });
        }
      }
      if (radio.modelName === action.linkAttributes.siteB.radio?.modelName) {
        state = {
          ...state, radioNameB: radio.modelName,
          modulationListB: Object.keys(radio.operationalParameters?.modulations!),
          radioIdSiteB: radio.id,
          radioBandwidthB: Number(radio.operationalParameters?.bandwith),
        };
        if (action.linkAttributes.siteB.radio?.operationalParameters.modulationType) {
          Object.entries(radio.operationalParameters?.modulations!).map(modulationParameters => {
            if (modulationParameters[0] === action.linkAttributes.siteB.radio?.operationalParameters.modulationType) {
              const modulationParametersB: any = modulationParameters[1];
              state = {
                ...state,
                thresholdBER3B: modulationParametersB.rxThr3BER,
                thresholdBER6B: modulationParametersB.rxThr6BER,
              };
            }
          });
        }
      }
    });
    if (action.linkAttributes.siteA.radio?.operationalParameters?.modulationType) {
      state = {
        ...state,
        modulationA: action.linkAttributes.siteA.radio?.operationalParameters?.modulationType,
        txPowerA: action.linkAttributes.siteA.radio.operationalParameters.transmissionPower!,
      };
    }
    if (action.linkAttributes.siteB.radio?.operationalParameters?.modulationType) {
      state = {
        ...state,
        modulationB: action.linkAttributes.siteB.radio?.operationalParameters?.modulationType,
        txPowerB: action.linkAttributes.siteB.radio.operationalParameters.transmissionPower!,
      };
    }
  } else if (action instanceof UpdateCalculationResultAction) {
    if (action.result.linkBudget) {
      state = Object.assign({}, state, {
        systemOperatingMarginA: action.result.linkBudget.systemOperatingMarginA, systemOperatingMarginB: action.result.linkBudget.systemOperatingMarginB,
        rxPowerA: action.result.linkBudget.receivedPowerA, rxPowerB: action.result.linkBudget.receivedPowerB,
      });
    }
  } else if (action instanceof FirstMandatoryCheckAction) {
    if (state.band.frequency !== 0) {
      state = { ...state, frequencyMandatoryParameters: true };
    } else state = Object.assign({}, state, { frequencyMandatoryParameters: false });
    if (state.radioNameA !== '' && state.radioNameB !== '' && state.modulationA !== '' && state.modulationB !== '' && state.txPowerA !== null && state.txPowerB !== null) {
      state = { ...state, radioMandatoryParameters: true };
    } else state = Object.assign({}, state, { radioMandatoryParameters: false });
  } else if (action instanceof UpdateRadioEverything) {
    if (action.transport.operationalParametersA) {
      state = {
        ...state, radioBandwidthA: Number(action.transport.operationalParametersA?.bandwith),
        modulationListA: action.transport.modulationListA!,
        radioIdSiteA: action.transport.radioIdSiteA!,
        modulationA: initialState.modulationA,
        txPowerA: initialState.txPowerA,
        thresholdBER3A: initialState.thresholdBER3A,
        thresholdBER6A: initialState.thresholdBER6A,
      };
    }
    if (action.transport.operationalParametersB) {
      state = {
        ...state, radioBandwidthB: Number(action.transport.operationalParametersB?.bandwith),
        modulationListB: action.transport.modulationListB!,
        radioIdSiteB: action.transport.radioIdSiteB!,
        modulationB: initialState.modulationB,
        txPowerB: initialState.txPowerB,
        thresholdBER3B: initialState.thresholdBER3B,
        thresholdBER6B: initialState.thresholdBER6B,
      };
    }
  } else if (action instanceof UpdateDeviceListsOnBandChangeAction) {
    state = { ...state, radioNameList: action.radioList.map(e => e.modelName), radioParameters: action.radioList, txPowerA: 0, txPowerB: 0 };
  } else if (action instanceof UpdateEnabeldAdaptiveModulations) {
    state = { ...state, enabledAdaptiveModulations: action.enabledAdaptiveModulations };
  } else if (action instanceof UpdateAdaptiveModulationProcessing) {
    state = { ...state, processing: action.processing };
  } else if (action instanceof UpdateTotalBandwidthAction) {
    state = { ...state, totalBandwidthMHz: action.totalBandwidthMHz };
  }

  return state;
};
