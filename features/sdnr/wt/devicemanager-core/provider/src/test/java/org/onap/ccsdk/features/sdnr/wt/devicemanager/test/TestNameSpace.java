/*
 * ============LICENSE_START=======================================================
 * ONAP : ccsdk feature sdnr wt
 *  ================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property.
 * All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */
package org.onap.ccsdk.features.sdnr.wt.devicemanager.test;

import static org.junit.Assert.assertEquals;

import java.net.URISyntaxException;
import org.junit.Test;
import org.opendaylight.yangtools.yang.common.QName;

public class TestNameSpace {

    private static final String QNAME_COREMODEL_NAMESPACE = "urn:onf:params:xml:ns:yang:core-model";
    private static final QName QNAME_COREMODEL =
            QName.create(QNAME_COREMODEL_NAMESPACE, "2017-03-20", "core-model").intern();

    @Test
    public void test() throws URISyntaxException {

        QName qname = QName.create("(urn:o-ran:hardware:1.0?revision=2019-03-28)o-ran-hardware");

        System.out.println("QName getNamespace" + qname.getNamespace());
        assertEquals(qname.getNamespace().toString(), "urn:o-ran:hardware:1.0");

        System.out.println("QName getRevision" + qname.getRevision());
        assertEquals(qname.getRevision().get().toString(), "2019-03-28");

        System.out.println(QNAME_COREMODEL.getNamespace().toString());
        assertEquals(QNAME_COREMODEL.getNamespace().toString(), QNAME_COREMODEL_NAMESPACE);

    }


}
