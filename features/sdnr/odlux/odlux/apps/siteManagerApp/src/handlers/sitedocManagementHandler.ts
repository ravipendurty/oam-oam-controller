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

import { IActionHandler } from '../../../../framework/src/flux/action';

import { ResetAction, SelectUserAction, SetAllUsersAction, SetTSSRAction, UpdateNoteAction, UpdateStateAction, UpdateTasks } from '../actions/sitedocManagementAction';
import { SitedocOrderTask, UserListItem } from '../models/siteDocTypes';

const emptyTask: SitedocOrderTask = { type: '', description: '', completed: false };


export type ManagementState = {
  users: UserListItem[];
  selectedUser: string;
  note: string;
  tasks: SitedocOrderTask[];
  isTSSR: boolean;
  state: string;
};

const initialState: ManagementState = {
  users: [],
  selectedUser: '',
  state: 'OPEN',
  note: '',
  tasks: [emptyTask],
  isTSSR: false,
};

export const ManagementHandler: IActionHandler<ManagementState> = (state = initialState, action) => {
  if (action instanceof SetAllUsersAction) {
    state = { ...state, users: action.users };
  } else if (action instanceof SelectUserAction) {
    state = { ...state, selectedUser: action.user };
  } else if (action instanceof SetTSSRAction) {
    state = { ...state, isTSSR: action.isTSSR };
  } else if (action instanceof UpdateNoteAction) {
    state = { ...state, note: action.note };
  } else if (action instanceof UpdateStateAction) {
    state = { ...state, state: action.state };
  } else if (action instanceof UpdateTasks) {
    state = { ...state, tasks: action.tasks };
  } else if (action instanceof ResetAction) {
    state = { ...state, tasks: [emptyTask], selectedUser: '', note: '', isTSSR: false };
  }
  return state;
};