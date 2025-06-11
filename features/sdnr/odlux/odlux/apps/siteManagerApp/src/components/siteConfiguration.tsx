/**
 * ============LICENSE_START========================================================================
 * ONAP : ccsdk feature sdnr wt odlux
 * =================================================================================================
 * Copyright (C) 2019 highstreet technologies GmbH Intellectual Property. All rights reserved.
 * =================================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http:www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 * ============LICENSE_END==========================================================================
 */
import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { ColumnType, MaterialTable, MaterialTableCtorType } from '../../../../framework/src/components/material-table';
import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { loadAllAvailableBandsAsync, loadAllFrequencyPlanBySiteIdAsync } from '../actions/siteManagerTreeActions';
import { addEditSiteConfig } from '../models/siteManager';
import siteManagerService from '../services/siteManagerService';

const SiteConfiguration = MaterialTable as MaterialTableCtorType<any>;


type SiteConfigurationProps = {
  siteId: string;
};

interface SiteConfigTableData {
  band: string;
  bandId: number;
  status: string;
  configuration: string;
  comment: string;
}

interface AvailableBands {
  keyId: number;
  name: string;
  duplexSpacingMhz: number;
}

const SiteConfigurationComponent: React.FC<SiteConfigurationProps> = (props: SiteConfigurationProps) => {

  const dispatch = useApplicationDispatch();
  const getSiteFrequencyPlan = async (siteId: string) => dispatch(loadAllFrequencyPlanBySiteIdAsync(siteId));
  const getAllAvailableBands = async () => dispatch(loadAllAvailableBandsAsync());

  const [siteConfigTableData, setSiteConfigTableData] = useState<SiteConfigTableData[]>([]);
  const [bandsTableData, setBandsTableData] = useState<AvailableBands[]>([]);
  const [openEditConfigDialog, setOpenEditConfigDialog] = useState(false);
  const [config, setConfig] = useState('HIGH');
  const [comment, setComment] = useState('');
  const [rowData, setRowData] = useState<SiteConfigTableData>();
  const [refreshTable, setRefreshTable] = useState(false);
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);
  const [saveInfoMessage, setSaveInfoMessage] = useState<{ message: string; error: boolean }>({ message: '', error: false });
  const [isDialogClosed, setIsDialogClosed] = useState(false);
  const [openAddConfigDialog, setOpenAddConfigDialog] = useState(false);
  const [bandId, setBandId] = useState<string | undefined>(undefined);
  const [openDeleteConfigDialog, setOpenDeleteConfigDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSiteFrequencyPlan = async () => {
    setIsLoading(true);
    try {
      const data: any = await getSiteFrequencyPlan(props.siteId);
      const tableData: SiteConfigTableData[] = data.map((row: any) => ({
        band: row.band.name,
        bandId: row.band.keyId,
        status: row.status,
        configuration: row.configuration,
        comment: row.comment || '',
      }));
      setSiteConfigTableData(tableData);
    } catch (error) {
      console.error('Error fetching site frequency plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAvailableBands = async () => {
    try {
      const data: any = await getAllAvailableBands();
      const tableData: AvailableBands[] = data.map((row: any) => ({
        keyId: row.keyId,
        name: row.name,
        duplexSpacingMhz: row.duplexSpacingMhz,
      }));
      setBandsTableData(tableData);
    } catch (error) {
      console.error('Error fetching available bands:', error);
    }
  };

  useEffect(() => {
    fetchSiteFrequencyPlan();
    fetchAllAvailableBands();
    setSaveInfoMessage({ message: '', error: false });
    if (shouldRefreshTable) {
      setShouldRefreshTable(false);
      setRefreshTable((prevValue) => !prevValue);
    }
  }, [props.siteId, shouldRefreshTable]);

  const onOpenAddSiteConfigDialog = () => {
    setOpenAddConfigDialog(true);
    setBandId(undefined);
    setComment('');
  };

  const onOpenEditSiteConfigDialog = (event: React.MouseEvent<HTMLElement>, element: SiteConfigTableData) => {
    if (!openEditConfigDialog) {
      setOpenEditConfigDialog(true);
      setComment('');
      setConfig(element.configuration);
      setRowData(element);
    }
  };
  const onOpenDeleteSiteConfigDialog = (event: React.MouseEvent<HTMLElement>, element: SiteConfigTableData) => {
    if (!openDeleteConfigDialog) {
      setOpenDeleteConfigDialog(true);
      setRowData(element);
    }
  };

  const saveEditConfig = (bandid: string, siteId: string) => {
    let modifiedConfig: addEditSiteConfig = {
      configuration: config,
      comment: comment,
    };
    siteManagerService.saveSiteConfiguration(modifiedConfig, bandid, siteId).then((result) => {
      if (!result.error) {
        setOpenEditConfigDialog(false);
        setIsDialogClosed(true);
      } else {
        setSaveInfoMessage(result);
      }
    });
  };

  const addConfig = (bandid: string, siteId: string) => {
    let addedConfig: addEditSiteConfig = {
      configuration: config,
      comment: comment,
    };
    if (bandId !== undefined) {
      siteManagerService.createSiteConfiguration(addedConfig, bandid, siteId).then((result) => {
        if (!result.error) {
          setOpenAddConfigDialog(false);
          setIsDialogClosed(true);
        } else {
          setSaveInfoMessage(result);
        }
      });
    }
  };
  const deleteConfig = (bandid: string, siteId: string) => {
    siteManagerService.deleteSiteConfiguration(bandid, siteId).then((result) => {
      if (!result.error) {
        setOpenDeleteConfigDialog(false);
        setIsDialogClosed(true);
      } else {
        setSaveInfoMessage(result);
      }
    });
  };

  const handleCloseEditDialog = () => {
    setOpenEditConfigDialog(false);
    setSaveInfoMessage({ message: '', error: false });
  };

  const handleCloseAddDialog = () => {
    setOpenAddConfigDialog(false);
    setSaveInfoMessage({ message: '', error: false });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteConfigDialog(false);
    setSaveInfoMessage({ message: '', error: false });
  };

  const addSiteConfigurationAction = {
    icon: AddIcon,
    tooltip: 'Add Site Configuration',
    ariaLabel: 'add-site-configuration',
    onClick: onOpenAddSiteConfigDialog,
  };

  const getContextMenu = (row: SiteConfigTableData) => {
    return [
      <>
        <MenuItem aria-label={'edit-site-config'} onClick={(event) => onOpenEditSiteConfigDialog(event, row)}>
          <Typography>Edit Config</Typography>
        </MenuItem>,
        <MenuItem aria-label={'edit-site-config'} onClick={(event) => onOpenDeleteSiteConfigDialog(event, row)}>
          <Typography>Delete Config</Typography>
        </MenuItem></>,
    ];
  };

  useEffect(() => {
    if (isDialogClosed) {
      setShouldRefreshTable(true);
      setIsDialogClosed(false);
    }
  }, [isDialogClosed]);

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999,
        }}>
          <CircularProgress style={{ color: '#2596be' }} />
        </div>
      )}
      <SiteConfiguration key={refreshTable.toString()} stickyHeader tableId='device-table' customActionButtons={[addSiteConfigurationAction]}
        columns={[
          { property: 'band', title: 'Band', type: ColumnType.text },
          { property: 'status', title: 'Status', type: ColumnType.text },
          { property: 'configuration', title: 'High/Low Config', type: ColumnType.text },
          { property: 'comment', title: 'Comments', type: ColumnType.text },
        ]}
        idProperty='id' rows={siteConfigTableData} asynchronus
        createContextMenu={(selectedRowData) => {
          return getContextMenu(selectedRowData);
        }}
      />
      <Dialog fullWidth open={openEditConfigDialog}>
        <DialogContent>
          <DialogContentText>
            {'Edit Configuration for the band ' + rowData?.band}
          </DialogContentText>
          <FormControl variant='standard' fullWidth>
            <InputLabel htmlFor='active'>Configuration</InputLabel>
            <Select disabled={rowData?.status != 'VACANT'} style={{ marginTop: '30px' }} variant='standard' aria-label='site-config-selection' value={config}
              onChange={(event) => { setConfig(event.target.value as string); }} inputProps={{ name: 'config', id: 'config' }} fullWidth >
              <MenuItem value={'HIGH'} aria-label='true'> HIGH </MenuItem>
              <MenuItem value={'LOW'} aria-label='false'> LOW </MenuItem>
            </Select>
            <TextField style={{ marginTop: '30px' }} variant='standard' spellCheck={false} margin='dense' value={comment}
              onChange={(event) => { setComment(event.target.value); }} id='edit-comment' label='Comment' aria-label='edit-comment'
              type='text' fullWidth />
          </FormControl>
        </DialogContent>
        <DialogActions style={{ marginTop: '30px' }}>
          <Button aria-label='save-site-config-button' color='secondary'
            onClick={(e) => { e.preventDefault(); saveEditConfig(rowData?.bandId + '', props.siteId); }} > SAVE </Button>
          <Button aria-label='close-site-config-button' color='secondary'
            onClick={(e) => { e.preventDefault(); handleCloseEditDialog(); }} > CLOSE </Button>
        </DialogActions>

        <div style={{ marginTop: '10px' }}>
          {saveInfoMessage.message.length > 0 && !saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'green'} variant='body1' > {saveInfoMessage.message} </Typography>
          )}
          {saveInfoMessage.message.length > 0 && saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'red'} variant='body1'> {'Save Failed - ' + saveInfoMessage.message} </Typography>
          )}
        </div>
      </Dialog>
      <Dialog fullWidth open={openAddConfigDialog}>
        <DialogContent>
          <DialogContentText>{'Add Configuration for the Site'}</DialogContentText>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="band">Band</InputLabel>
            <Select style={{ marginTop: '30px' }} variant="standard" aria-label="site-band-selection" value={bandId || ''}
              onChange={(event) => {
                const selectedBandId = event.target.value;
                setBandId(selectedBandId);
              }}
              inputProps={{ name: 'band', keyId: 'bandKeyId' }} fullWidth >
              {bandsTableData.map((band) => (
                <MenuItem key={band.keyId} value={band.keyId}>
                  {band.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="active">Configuration</InputLabel>
            <Select style={{ marginTop: '30px' }} variant="standard" aria-label="site-config-selection" value={config}
              onChange={(event) => {
                setConfig(event.target.value as string);
              }}
              inputProps={{ name: 'config', id: 'config' }} >
              <MenuItem value="HIGH">HIGH</MenuItem>
              <MenuItem value="LOW">LOW</MenuItem>
            </Select>
            <TextField style={{ marginTop: '30px' }} variant='standard' spellCheck={false} margin='dense' value={comment}
              onChange={(event) => { setComment(event.target.value); }} id='addConfig-comment' label='Comment' aria-label='addConfig-comment'
              type='text' fullWidth />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary"
            onClick={() => {
              const selectedBand = bandsTableData.find((band) => band.keyId + '' === bandId);
              if (selectedBand) {
                addConfig(selectedBand.keyId.toString(), props.siteId);
              }
            }} > Save </Button>
          <Button variant="outlined" color="secondary" onClick={handleCloseAddDialog} > CLOSE </Button>
        </DialogActions>
        <div style={{ marginTop: '10px' }}>
          {saveInfoMessage.message.length > 0 && !saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'green'} variant='body1' > {saveInfoMessage.message} </Typography>
          )}
          {saveInfoMessage.message.length > 0 && saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'red'} variant='body1'> {'Save Failed - ' + saveInfoMessage.message} </Typography>
          )}
        </div>
      </Dialog>
      <Dialog fullWidth open={openDeleteConfigDialog}>
        <DialogContent>
          <DialogContentText>{'Delete Frequency Plan from the Site'}</DialogContentText>
          {'Do you really want to remove this configuration for band:' + rowData?.band}
        </DialogContent>
        <DialogActions style={{ marginTop: '30px' }}>
          <Button aria-label='delete-site-config-button' color='secondary'
            onClick={(e) => { e.preventDefault(); deleteConfig(rowData?.bandId + '', props.siteId); }} > DELETE </Button>
          <Button aria-label='close-delete-config-button' color='secondary'
            onClick={(e) => { e.preventDefault(); handleCloseDeleteDialog(); }} > CLOSE </Button>
        </DialogActions>
        <div style={{ marginTop: '10px' }}>
          {saveInfoMessage.message.length > 0 && !saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'green'} variant='body1' > {saveInfoMessage.message} </Typography>
          )}
          {saveInfoMessage.message.length > 0 && saveInfoMessage.error && (
            <Typography aria-label='site-manager-order-creation-message' style={{ marginLeft: 10, marginBottom: 10 }}
              color={'red'} variant='body1'> {'Save Failed - ' + saveInfoMessage.message} </Typography>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default SiteConfigurationComponent;
