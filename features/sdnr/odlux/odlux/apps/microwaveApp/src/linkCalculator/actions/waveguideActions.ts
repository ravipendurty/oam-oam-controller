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

import { Waveguide } from '../model/waveguide';
import { Action } from '../../../../../framework/src/flux/action';

export class UpdateWaveguideLossAction extends Action {
  constructor(public waveguideLossA: number, public waveguideLossB: number) {
    super();
  }
}
export class UpdatewaveguideListAction extends Action {
  constructor(public waveguideListName: string[]) {
    super();
  }
}

export class updateWaveguideNameAction extends Action {
  constructor(public waveguideNameA: string | null, public waveguideNameB: string | null) {
    super();
  }
}
export class waveguideMandatoryAction extends Action {
  constructor(public waveguideMandatoryParameters: boolean) {
    super();
  }
}
export class UpdateWaveguideIdAction extends Action {
  constructor(public waveguideIdSiteA: number | null, public waveguideIdSiteB: number | null) {
    super();
  }
}
export class updateWaveguideTypeAction extends Action {
  constructor(public waveguideTypeA: string | null, public waveguideTypeB: string | null) {
    super();
  }
}
export class UpdateWaveguideParametersAction extends Action {
  constructor(public waveguide: Waveguide[]) {
    super();
  }
}
export class UpdateNewWaveguideParametersAction extends Action {
  constructor(public waveguideParametersA: Waveguide | null, public waveguideParametersB: Waveguide | null) {
    super();
  }
}



