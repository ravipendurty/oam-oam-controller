/*
 * ============LICENSE_START=======================================================
 * ONAP : ccsdk features
 * ================================================================================
 * Copyright (C) 2020 highstreet technologies GmbH Intellectual Property.
 * All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 *
 */
package org.onap.ccsdk.features.sdnr.wt.dataprovider.setup.releases;

import org.onap.ccsdk.features.sdnr.wt.dataprovider.database.sqldb.SqlDBClient;
import org.onap.ccsdk.features.sdnr.wt.dataprovider.setup.ReleaseInformation;
import org.onap.ccsdk.features.sdnr.wt.dataprovider.setup.data.Release;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GuilinReleaseInformation extends ReleaseInformation {

    private final Logger LOG = LoggerFactory.getLogger(GuilinReleaseInformation.class);
    public GuilinReleaseInformation() {
        super(Release.GUILIN_R1, FrankfurtReleaseInformationR2.createDBMap());

    }

    @Override
    public boolean runPreInitCommands(SqlDBClient dbClient) {
        return false;
    }

    @Override
    public boolean runPostInitCommands(SqlDBClient dbClient) {
        return false;
    }

}
