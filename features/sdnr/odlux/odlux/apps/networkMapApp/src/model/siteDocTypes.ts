/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2022 highstreet technologies GmbH Intellectual Property. All rights reserved.
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

export type UserListItem = {
  userName: string;
  firstName: string;
  lastName: string;
};

export type RegisterUser = {

  firstName: string;
  familyName: string;
  email: string;
  username: string;
  password: string;
  telephoneNr: string;
  role: 'ANDROID';
};

export type SitedocOrder = {
  siteId: string;
  assignedUser: string;
  date: string; //in UTC
  state: SitedocOrderTypes;
  tasks: SitedocOrderTask[];
  note: string;
  isTssr: boolean;
};

export type SitedocOrderTypes = 'OPEN' | 'UPDATE' | 'DELETE';

export type SitedocOrderTask = {
  type: string;
  description: string;
  status: false;
};