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

export type Address = {
  streetAndNr: string;
  city: string;
  zipCode: string | null;
  country: string;
};

type StadokSite = {
  id: string;
  createdBy: Contact;
  updatedOn: Date;
  location: { lat: number; lon: number };
  address: Address;
  contacts: { manager: Contact; owner: Contact };
  safetyNotices: string[];
  images: string[];
  type: string;
  devices: Device[];
  logs: Log[];
};

type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  telephoneNumber: string;
};
type Log = {
  date: Date; //string?
  person: string;
  entry: string;
};

type Device = {
  'device': string;
  'antenna': string;
};

export default StadokSite;