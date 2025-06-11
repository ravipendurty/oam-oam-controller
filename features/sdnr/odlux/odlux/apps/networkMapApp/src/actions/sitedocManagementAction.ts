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

import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';

import { SitedocOrderTask, UserListItem } from '../model/siteDocTypes';
import { sitedocDataService } from '../services/sitedocDataService';

export class SetAllUsersAction extends Action {
  constructor(public users: UserListItem[]) {
    super();
  }
}

export class SetTSSRAction extends Action {
  constructor(public isTSSR: boolean) {
    super();
  }
}

export class UpdateNoteAction extends Action {
  constructor(public note: string) {
    super();
  }
}

export class UpdateStateAction extends Action {
  constructor(public state: string) {
    super();
  }
}

export class UpdateTasks extends Action {
  constructor(public tasks: SitedocOrderTask[]) {
    super();
  }
}

export class ResetAction extends Action {

}

export class SelectUserAction extends Action {
  constructor(public user: string) {
    super();
  }
}

export class SetSiteExists extends Action {
  constructor(public exists: boolean) {
    super();
  }
}

export const getUsersAction = () => async (dispatcher: Dispatch) => {
  const users = await sitedocDataService.getAllUsers();
  dispatcher(new SetAllUsersAction(users));
};