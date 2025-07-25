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

import static org.junit.Assert.fail;

import com.google.common.io.Files;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.onap.ccsdk.features.sdnr.wt.common.configuration.ConfigurationFileRepresentation;
import org.onap.ccsdk.features.sdnr.wt.devicemanager.dcaeconnector.impl.DcaeProviderClient;
import org.onap.ccsdk.features.sdnr.wt.devicemanager.impl.util.InternalDateAndTime;
import org.onap.ccsdk.features.sdnr.wt.devicemanager.impl.util.InternalSeverity;
import org.onap.ccsdk.features.sdnr.wt.devicemanager.impl.xml.ProblemNotificationXml;
import org.onap.ccsdk.features.sdnr.wt.devicemanager.types.InventoryInformationDcae;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;

@SuppressWarnings("restriction")
public class TestDcae {

    private static final String ENABLEDDCAE_TESTCONFIG_FILENAME = "test2.properties";
    private static final File ENABLEDDCAE_TESTCONFIG_FILE = new File(ENABLEDDCAE_TESTCONFIG_FILENAME);
    private static final int DCAE_SERVER_PORT = 45452;
    private static final String URI = "/abc";
    private static final String TESTCONFIG_CONTENT = "[dcae]\n" + "dcaeUserCredentials=admin:admin\n"
            + "dcaeUrl=http://localhost:" + DCAE_SERVER_PORT + URI + "\n" + "dcaeHeartbeatPeriodSeconds=120\n"
            + "dcaeTestCollector=no\n" + "\n" + "[aots]\n" + "userPassword=passwd\n" + "soapurladd=off\n"
            + "soapaddtimeout=10\n" + "soapinqtimeout=20\n" + "userName=user\n" + "inqtemplate=inqreq.tmpl.xml\n"
            + "assignedto=userid\n" + "addtemplate=addreq.tmpl.xml\n"
            + "severitypassthrough=critical,major,minor,warning\n" + "systemuser=user\n" + "prt-offset=1200\n"
            + "soapurlinq=off\n" + "#smtpHost=\n" + "#smtpPort=\n" + "#smtpUsername=\n" + "#smtpPassword=\n"
            + "#smtpSender=\n" + "#smtpReceivers=\n" + "\n" + "[es]\n" + "esCluster=sendateodl5\n" + "\n" + "[aai]\n"
            + "#keep comment\n" + "aaiHeaders=[\"X-TransactionId: 9999\"]\n" + "aaiUrl=off\n"
            + "aaiUserCredentials=AAI:AAI\n" + "aaiDeleteOnMountpointRemove=true\n" + "aaiTrustAllCerts=false\n"
            + "aaiApiVersion=aai/v13\n" + "aaiPropertiesFile=aaiclient.properties\n" + "aaiApplicationId=SDNR\n"
            + "aaiPcks12ClientCertFile=/opt/logs/externals/data/stores/keystore.client.p12\n"
            + "aaiPcks12ClientCertPassphrase=adminadmin\n" + "aaiClientConnectionTimeout=30000\n" + "\n" + "[pm]\n"
            + "pmCluster=sendateodl5\n" + "pmEnabled=true\n" + "\n" + "";
    private HttpServer server;
    private ExecutorService httpThreadPool;
    private ConfigurationFileRepresentation cfg;

    @Test
    public void test2() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        DcaeProviderClient provider = new DcaeProviderClient(cfg, "mountpoint", null);

        String mountPointName = "testDevice 01";
        String type = "Unit";
        String model = "Horizon Compact+";
        String vendor = "DragonWave-X";
        String ipv4 = "127.0.0.1";
        String ipv6 = "::1";
        List<String> ifInfos = new ArrayList<>();
        ifInfos.add("LP-MWPS-RADIO");
        new InventoryInformationDcae(type, model, vendor, ipv4, ipv6, ifInfos);
        System.out.println("registering device");
        boolean neDeviceAlarm = false;
        ProblemNotificationXml notification = new ProblemNotificationXml(mountPointName, "network-element",
                "problemName", InternalSeverity.Critical, 123, InternalDateAndTime.getTestpattern());
        provider.sendProblemNotification(new NodeId(mountPointName), notification, neDeviceAlarm);

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            System.out.println("Break sleep : " + e.getMessage());
            Thread.currentThread().interrupt();
        }
        try {
            provider.close();
        } catch (Exception e) {
            System.out.println("Close provider error : " + e.getMessage());
        }
    }

    @Before
    public void initDcaeTestWebserver() throws IOException {
        try {
            Files.asCharSink(ENABLEDDCAE_TESTCONFIG_FILE, StandardCharsets.UTF_8).write(TESTCONFIG_CONTENT);
        } catch (IOException e1) {
            fail(e1.getMessage());
        }
        cfg = new ConfigurationFileRepresentation(ENABLEDDCAE_TESTCONFIG_FILENAME);
        // cfg.reload(ENABLEDDCAE_TESTCONFIG_FILENAME);
        /*
         * cfg = new HtDevicemanagerConfiguration(ENABLEDDCAE_TESTCONFIG_FILENAME);
         * DcaeConfig.reload();
         */
        try {
            this.server = HttpServer.create(new InetSocketAddress(DCAE_SERVER_PORT), 0);
        } catch (Exception e) {
            fail(e.getMessage());
        }
        this.httpThreadPool = Executors.newFixedThreadPool(5);
        this.server.setExecutor(this.httpThreadPool);
        this.server.createContext(URI, new MyHandler());
        // server.createContext("/", new MyRootHandler());
        this.server.setExecutor(null); // creates a default executor
        this.server.start();
        System.out.println("http server started");
    }

    @After
    public void stopTestWebserver() {
        if (this.server != null) {
            this.server.stop(0);
            this.httpThreadPool.shutdownNow();
            System.out.println("http server stopped");
        }
        if (ENABLEDDCAE_TESTCONFIG_FILE.exists()) {
            ENABLEDDCAE_TESTCONFIG_FILE.delete();
        }
    }

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String method = t.getRequestMethod();
            System.out.println("req method: " + method);
            OutputStream os = null;
            try {
                String res = "";
                if (method.equals("POST")) {
                    t.sendResponseHeaders(200, res.length());
                    os = t.getResponseBody();
                    os.write(res.getBytes());
                } else {
                    t.sendResponseHeaders(404, 0);
                }
                System.out.println("req handled successful");

            } catch (Exception e) {
                System.out.println(e.getMessage());
            } finally {
                if (os != null) {
                    os.close();
                }
            }
        }
    }
}
