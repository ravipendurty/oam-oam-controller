/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
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
import React, { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { NavigateToApplication } from '../../../../framework/src/actions/navigationActions';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

const scrollbar = { overflow: 'auto', paddingRight: '20px' };

let connectionStatusInitialLoad = true;
let connectionStatusInitialStateChanged = false;
let connectionStatusDataLoad: number[] = [0, 0, 0, 0];
let connectionTotalCount = 0;

let alarmStatusInitialLoad = true;
let alarmStatusInitialStateChanged = false;
let alarmStatusDataLoad: number[] = [0, 0, 0, 0];
let alarmTotalCount = 0;


type HomeComponentProps = RouteComponentProps;

const DashboardHome: FC<HomeComponentProps> = () => {
  const alarmStatus = useSelectApplicationState((state: IApplicationStoreState) => state.fault.faultStatus);
  const dispatch = useApplicationDispatch();
  const navigateToApplication = (applicationName: string, path?: string) => dispatch(new NavigateToApplication(applicationName, path));
  if (!alarmStatus.isLoadingConnectionStatusChart) {
    connectionStatusDataLoad = [
      alarmStatus.Connected,
      alarmStatus.Connecting,
      alarmStatus.Disconnected,
      alarmStatus.UnableToConnect,
      alarmStatus.Undefined,
    ];
    connectionTotalCount = alarmStatus.Connected + alarmStatus.Connecting
      + alarmStatus.Disconnected + alarmStatus.UnableToConnect + alarmStatus.Undefined;

  }

  if (!alarmStatus.isLoadingAlarmStatusChart) {
    alarmStatusDataLoad = [
      alarmStatus.critical,
      alarmStatus.major,
      alarmStatus.minor,
      alarmStatus.warning,
    ];
    alarmTotalCount = alarmStatus.critical + alarmStatus.major
      + alarmStatus.minor + alarmStatus.warning;
  }

  /** Available Network Connection Status chart data */
  const connectionStatusData = {
    labels: [
      'Connected: ' + alarmStatus.Connected,
      'Connecting: ' + alarmStatus.Connecting,
      'Disconnected: ' + alarmStatus.Disconnected,
      'UnableToConnect: ' + alarmStatus.UnableToConnect,
      'Undefined: ' + alarmStatus.Undefined,
    ],
    datasets: [{
      labels: ['Connected', 'Connecting', 'Disconnected', 'UnableToConnect', 'Undefined'],
      data: connectionStatusDataLoad,
      backgroundColor: [
        'rgb(0, 153, 51)',
        'rgb(255, 102, 0)',
        'rgb(191, 191, 191)',
        'rgb(191, 191, 191)',
        'rgb(242, 240, 240)',
      ],
    }],
  };

  /** No Devices available */
  const connectionStatusUnavailableData = {
    labels: ['No Devices available'],
    datasets: [{
      data: [1],
      backgroundColor: [
        'rgb(255, 255, 255)',
      ],
    }],
  };

  /** Loading Connection Status chart */
  const connectionStatusIsLoading = {
    labels: ['Loading chart...'],
    datasets: [{
      data: [1],
      backgroundColor: [
        'rgb(255, 255, 255)',
      ],
    }],
  };

  /** Loading Alarm Status chart */
  const alarmStatusIsLoading = {
    labels: ['Loading chart...'],
    datasets: [{
      data: [1],
      backgroundColor: [
        'rgb(255, 255, 255)',
      ],
    }],
  };

  /** Connection status options */
  let labels: String[] = ['Connected', 'Connecting', 'Disconnected', 'UnableToConnect', 'Undefined'];
  const connectionStatusOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          let label =
            (data.datasets[tooltipItem.datasetIndex].labels &&
              data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index]) ||
            data.labels[tooltipItem.index] ||
            '';
          if (label) {
            label += ': ';
          }
          label +=
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] +
            (data.datasets[tooltipItem.datasetIndex].labelSuffix || '');

          return label;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    onClick: (event: MouseEvent, item: any) => {
      setTimeout(() => {
        if (item[0]) {
          let connectionStatus = labels[item[0]._index] + '';
          navigateToApplication('connect', '/connectionStatus/' + connectionStatus);
        }
      }, 0);
    },
  };

  /** Connection status unavailable options */
  const connectionStatusUnavailableOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  /** Add text inside the doughnut chart for Connection Status */
  const connectionStatusPlugins = [{
    beforeDraw: function (chart: any) {
      var width = chart.width,
        height = chart.height,
        ctx = chart.ctx;
      ctx.restore();
      var fontSize = (height / 480).toFixed(2);
      ctx.font = fontSize + 'em sans-serif';
      ctx.textBaseline = 'top';
      var text = 'Network Connection Status',
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  }];

  /** Alarm status Data */
  const alarmStatusData = {
    labels: [
      'Critical : ' + alarmStatus.critical,
      'Major : ' + alarmStatus.major,
      'Minor : ' + alarmStatus.minor,
      'Warning : ' + alarmStatus.warning,
    ],
    datasets: [{
      labels: ['Critical', 'Major', 'Minor', 'Warning'],
      data: alarmStatusDataLoad,
      backgroundColor: [
        'rgb(240, 25, 10)',
        'rgb(240, 133, 10)',
        'rgb(240, 240, 10)',
        'rgb(46, 115, 176)',
      ],
    }],
  };

  /** No Alarm status available */
  const alarmStatusUnavailableData = {
    labels: ['No Alarms available'],
    datasets: [{
      data: [1],
      backgroundColor: [
        'rgb(0, 153, 51)',
      ],
    }],
  };

  /** Alarm status Options */
  let alarmLabels: String[] = ['Critical', 'Major', 'Minor', 'Warning'];
  const alarmStatusOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          let label =
            (data.datasets[tooltipItem.datasetIndex].labels &&
              data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index]) ||
            data.labels[tooltipItem.index] ||
            '';
          if (label) {
            label += ': ';
          }
          label +=
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] +
            (data.datasets[tooltipItem.datasetIndex].labelSuffix || '');

          return label;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    onClick: (event: MouseEvent, item: any) => {
      setTimeout(() => {
        if (item[0]) {
          let severity = alarmLabels[item[0]._index] + '';
          navigateToApplication('fault', '/alarmStatus/' + severity);
        }
      }, 0);
    },
  };

  /** Alarm status unavailable options */
  const alarmStatusUnavailableOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  /** Add text inside the doughnut chart for Alarm Status */
  const alarmStatusPlugins = [{
    beforeDraw: function (chart: any) {
      var width = chart.width,
        height = chart.height,
        ctx = chart.ctx;
      ctx.restore();
      var fontSize = (height / 480).toFixed(2);
      ctx.font = fontSize + 'em sans-serif';
      ctx.textBaseline = 'top';
      var text = 'Network Alarm Status',
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  }];

  /** Check if connection status data available */
  const checkConnectionStatus = () => {
    let statusCount = alarmStatus;
    if (statusCount.isLoadingConnectionStatusChart) {
      return true;
    }
    if (statusCount.Connected == 0 && statusCount.Connecting == 0 && statusCount.Disconnected == 0
      && statusCount.UnableToConnect == 0 && statusCount.Undefined == 0) {
      return false;
    } else {
      return true;
    }
  };

  /** Check if connection status chart data is loaded */
  const checkElementsAreLoaded = () => {
    let isLoadingCheck = alarmStatus;
    if (connectionStatusInitialLoad && !isLoadingCheck.isLoadingConnectionStatusChart) {
      if (checkConnectionStatus()) {
        connectionStatusInitialLoad = false;
        return true;
      }
      return false;
    } else if (connectionStatusInitialLoad && isLoadingCheck.isLoadingConnectionStatusChart) {
      connectionStatusInitialLoad = false;
      connectionStatusInitialStateChanged = true;
      return !isLoadingCheck.isLoadingConnectionStatusChart;
    } else if (connectionStatusInitialStateChanged) {
      if (!isLoadingCheck.isLoadingConnectionStatusChart) {
        connectionStatusInitialStateChanged = false;
      }
      return !isLoadingCheck.isLoadingConnectionStatusChart;
    }
    return true;
  };

  /** Check if alarms data available */
  const checkAlarmStatus = () => {
    let alarmCount = alarmStatus;
    if (alarmCount.isLoadingAlarmStatusChart) {
      return true;
    }
    if (alarmCount.critical == 0 && alarmCount.major == 0 && alarmCount.minor == 0 && alarmCount.warning == 0) {
      return false;
    } else {
      return true;
    }
  };

  /** Check if alarm status chart data is loaded */
  const checkAlarmsAreLoaded = () => {
    let isLoadingCheck = alarmStatus;
    if (alarmStatusInitialLoad && !isLoadingCheck.isLoadingAlarmStatusChart) {
      if (checkAlarmStatus()) {
        alarmStatusInitialLoad = false;
        return true;
      }
      return false;
    } else if (alarmStatusInitialLoad && isLoadingCheck.isLoadingAlarmStatusChart) {
      alarmStatusInitialLoad = false;
      alarmStatusInitialStateChanged = true;
      return !isLoadingCheck.isLoadingAlarmStatusChart;
    } else if (alarmStatusInitialStateChanged) {
      if (!isLoadingCheck.isLoadingAlarmStatusChart) {
        alarmStatusInitialStateChanged = false;
      }
      return !isLoadingCheck.isLoadingAlarmStatusChart;
    }
    return true;
  };

  return (
    <>
      <div style={scrollbar} >
        <h1 aria-label="welcome-to-odlux">Welcome to ODLUX</h1>
        <div style={{ width: '50%', float: 'left' }}>
          {checkElementsAreLoaded() ?
            checkConnectionStatus() && connectionTotalCount != 0 ?
              <Doughnut
                data={connectionStatusData}
                type={Doughnut}
                width={500}
                height={500}
                options={connectionStatusOptions}
                plugins={connectionStatusPlugins}
              />
              : <Doughnut
                data={connectionStatusUnavailableData}
                type={Doughnut}
                width={500}
                height={500}
                options={connectionStatusUnavailableOptions}
                plugins={connectionStatusPlugins} />
            : <Doughnut
              data={connectionStatusIsLoading}
              type={Doughnut}
              width={500}
              height={500}
              options={connectionStatusUnavailableOptions}
              plugins={connectionStatusPlugins}
            />
          }
        </div>
        <div style={{ width: '50%', float: 'left' }}>
          {checkAlarmsAreLoaded() ?
            checkAlarmStatus() && alarmTotalCount != 0 ?
              <Doughnut
                data={alarmStatusData}
                type={Doughnut}
                width={500}
                height={500}
                options={alarmStatusOptions}
                plugins={alarmStatusPlugins}
              />
              : <Doughnut
                data={alarmStatusUnavailableData}
                type={Doughnut}
                width={500}
                height={500}
                options={alarmStatusUnavailableOptions}
                plugins={alarmStatusPlugins}
              />
            : <Doughnut
              data={alarmStatusIsLoading}
              type={Doughnut}
              width={500}
              height={500}
              options={alarmStatusUnavailableOptions}
              plugins={alarmStatusPlugins}
            />
          }
        </div>
      </div>
    </>
  );
};

export default (withRouter(DashboardHome));