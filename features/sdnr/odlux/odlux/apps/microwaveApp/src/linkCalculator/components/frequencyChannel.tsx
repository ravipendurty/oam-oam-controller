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

import React, { useEffect, FC, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

import {  useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import { UpdateFrequencyPlanAction } from '../actions/linkAction';
import { frequencyMandatoryParametersAction, ResetAction, updateFrequencyBand, UpdateTotalBandwidthAction } from '../actions/radioActions';
import OutlinedDiv from './outlinedDiv';
import { getAllBands, UpdateChannelQuery, UpdateChannelListLoadingAction, UpdateRegionRegulatorAction, UpdateChannelListAction } from '../actions/bandPlanAction';
import { ChannelTable, RegionRegulator } from '../model/bandPlan';
import ChannelListDialog from './channelListDialog';
import ConnectionInfo from './connectionInfo';
import { TextFieldwithAdornment } from './textFieldwithAdornment';

const styles = makeStyles({
  fitContent: {
    width: 'fit-content',
  },
  column: {
    width: '220px',
  },
  container: {
    display: 'flex', flexDirection: 'column', width: 'column',
  },
  component: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  centerColumn: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '5',
  },
  channelRow: {
    flexDirection: 'row', justifyContent: 'space-evenly',
  },
  loading: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999,

  },
  closeIcon: {
    marginTop: 20, top: '-75px', right: '-40px',
  },
});

const FrequencyChannelView: FC = (() => {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const band = useSelectApplicationState(state => state.microwave.radio.band);
  const frequencyPlanA = useSelectApplicationState(state =>  state.microwave.bandPlan.frequencyPlanA);
  const frequencyPlanB = useSelectApplicationState(state =>  state.microwave.bandPlan.frequencyPlanB);
  const bandList = useSelectApplicationState(state =>  state.microwave.bandPlan.bandList);
  const regionRegulatorList = useSelectApplicationState(state =>  state.microwave.bandPlan.regionRegulatorList);
  const regulator = useSelectApplicationState(state =>  state.microwave.bandPlan.region);
  const processing = useSelectApplicationState(state =>  state.microwave.bandPlan.channelListLoading);
  const linkId = useSelectApplicationState(state =>  state.microwave.link.linkId);
  const channelListQuery = useSelectApplicationState(state =>  state.microwave.bandPlan.channelListQuery);
  const allChannels = useSelectApplicationState(state =>  state.microwave.bandPlan.allChannels);
  const totalBandwidthMHz = useSelectApplicationState(state =>  state.microwave.radio.totalBandwidthMHz);
  const frequencyPlanProcessing = useSelectApplicationState(state =>  state.microwave.bandPlan.frequencyPlanProcessing);
  const savedChannels = useSelectApplicationState(state =>  state.microwave.bandPlan.savedChannels);
  const dispatch = useApplicationDispatch();

  const updateFrequency = (bandKeyId: string) => dispatch(updateFrequencyBand(bandKeyId));
  const updateFrequencyPlan = (planA: 'HIGH' | 'LOW', planB: 'HIGH' | 'LOW') => dispatch(new UpdateFrequencyPlanAction(planA, planB));
  const updateMandatoryParameters = (mandatoryParameters: boolean) => dispatch(new frequencyMandatoryParametersAction(mandatoryParameters));
  const updateRegion = (region: RegionRegulator) => {
    dispatch(new UpdateRegionRegulatorAction(region));
    dispatch(new ResetAction());
  };
  const getBandList = (bandplanKeyId: string) => dispatch(getAllBands(bandplanKeyId));
  const channelList = async (regionId: string, bandKeyId: string) => dispatch(UpdateChannelQuery(regionId, bandKeyId));
  const updatechannelsAndBandwidth = (channels: ChannelTable[], bandwidthMHz: number) => {
    dispatch(new UpdateChannelListAction(channels));
    dispatch(new UpdateTotalBandwidthAction(bandwidthMHz));
  };
  const updateChannelListLoading = (proccessing: boolean) => dispatch(new UpdateChannelListLoadingAction(proccessing));
  
  const classes = styles();

  const frequencyChange = async (frequency: number) => {
    if (frequency !== band.frequency) {
      bandList.forEach(x => {
        if (x.name === frequency.toString()) {
          updateFrequency(x.keyId);
        }
      });
      
    }

  };
  const regionChange = async (regionAsString: string) => {
    if (regionAsString !== regulator.name) {
      regionRegulatorList.forEach(async region => {
        if (regionAsString === region.name) {
          await updateRegion(region);
          getBandList(region.keyId);
        }
      });
    }

  };
  const onRadioSelect = (e: any) => {
    if (e.target.name === 'site-a-frequency-plan') {
      if (e.target.value === 'HIGH') {
        updateFrequencyPlan(e.target.value, 'LOW');
      } else {
        updateFrequencyPlan(e.target.value, 'HIGH');
      }
    } else if (e.target.name === 'site-b-frequency-plan') {
      if (e.target.value === 'HIGH') {
        updateFrequencyPlan('LOW', e.target.value);
      } else {
        updateFrequencyPlan('HIGH', e.target.value);
      }
    }
  };


  const checkMandatoryParameters = () => {
    if (band.frequency !== 0) {
      updateMandatoryParameters(true);
    } else {
      updateMandatoryParameters(false);
    }
  };
  const handleClickOpen = (show: boolean) => {
    setOpenDialog(show);
  };
  const getChannelList = async () => {
    
    bandList.forEach(x => {
      if (x.keyId === band.keyId) {
        channelList(regulator.keyId, band.keyId);
      }
    });
    handleClickOpen(true);
  };
  const handleDialogClose = () => {
    updateChannelListLoading(true);
    setOpenDialog(false);

  };
  const updatechannels = (selectedChannels: ChannelTable[], bandwidthMHz: number) => {
    updatechannelsAndBandwidth(selectedChannels, bandwidthMHz);

  };
  useEffect(() => {
    checkMandatoryParameters();
  }, [band.frequency]);

  return (
		<div>
			{frequencyPlanProcessing ?
				<Paper>
					<div className={classes.loading}>
						<CircularProgress style={{ color: '#2596be' }} />
					</div>
				</Paper>
			  :
				<div className={classes.container}>
					<Stack className={classes.centerColumn}>
						<FormControl variant="standard" className={classes.column} >
							<InputLabel>--Region--</InputLabel>
							<Select variant="standard"
								id="region"
								aria-label="region-select"
								value={regulator.name}
								onChange={async (e) => {
								  regionChange(e.target.value as string);
								}}
								error={band.frequency == 0}
							>
								<MenuItem value={''} disabled>--Select Region--</MenuItem>
								{regionRegulatorList.map(region => (<MenuItem value={region.name} aria-label='region-regulator'>{region.name}</MenuItem>))}
							</Select>
							{band.frequency == 0 && <FormHelperText error>  *Required </FormHelperText>}
						</FormControl>
					</Stack>
					<Stack className={classes.centerColumn}>
						<FormControl variant="standard" className={classes.column} >
							<InputLabel>--Band (GHz) --</InputLabel>
							<Select variant="standard"
								id="frequencyKey"
								aria-label="frequency-select"
								value={band.frequency}
								onChange={async (e) => {
								  await frequencyChange(e.target.value as number);
								}}
								error={band.frequency == 0}
							>
								<MenuItem value={'0'} disabled>--Select band--</MenuItem>
								{bandList.map(x => Number.parseFloat(x.name)).sort(function (a, b) { return Number(a) - Number(b); }).map(frequencyBand =>
								  (<MenuItem value={frequencyBand} aria-label="frequency-band">{frequencyBand}</MenuItem>))}
							</Select>
							{band.frequency == 0 && <FormHelperText error>  *Required </FormHelperText>}
						</FormControl>
					</Stack>
					<Stack className={classes.centerColumn}>
						<TextFieldwithAdornment
							aria-label="total-bandwidth"
							label="Total Bandwidth"
							errorText=" "
							andornmentUnit="MHz"
							error={false}
							disabled
							value={totalBandwidthMHz}
						/>
					</Stack>
					<Stack className={classes.component}>
						<OutlinedDiv className={classes.fitContent} label="Frequency Plan" aria-label="site-a-frequency-plan" >
							<Grid container justifyContent="center" alignItems="center" >
								<RadioGroup row aria-label="site-a-frequency-plan-label" name="site-a-frequency-plan" value={frequencyPlanA}
								>
									<FormControlLabel value='HIGH' control={<Radio color="secondary" aria-label="site-a-frequency-plan-high" />} label="High" onChange={onRadioSelect} />
									<FormControlLabel value='LOW' control={<Radio color="secondary" aria-label="site-a-frequency-plan-low" />} label="Low" onChange={onRadioSelect} />
								</RadioGroup>
							</Grid>
						</OutlinedDiv>
						<OutlinedDiv className={classes.fitContent} label="Frequency Plan" aria-label="site-b-frequency-plan">
							<Grid container justifyContent="center" alignItems="center" >
								<RadioGroup row aria-label="site-b-frequency-plan-label" name="site-b-frequency-plan" value={frequencyPlanB}
								>
									<FormControlLabel value='HIGH' control={<Radio color="secondary" aria-label="site-b-frequency-plan-high" />} label="High" onChange={onRadioSelect} />
									<FormControlLabel value='LOW' control={<Radio color="secondary" aria-label="site-b-frequency-plan-low" />} label="Low" onChange={onRadioSelect} />
								</RadioGroup>
							</Grid>
						</OutlinedDiv>
					</Stack>
					<Stack className={classes.channelRow}>
						<TextField
							variant="standard"
							className={classes.fitContent}
							aria-label="site-a-channel"
							label="Channel"
							error={false}
							disabled
							value={savedChannels.map(x => x.polarization === 'XPOL' ? x.name + '[xpol]' : x.name)}
						/>
						<Stack className={classes.centerColumn}>
							<Box textAlign='center' className={classes.fitContent}>
								<Button aria-label="select-channel-button" variant="contained"
									color="primary"
									name="selectChannel"
									onClick={getChannelList}
								>
									Select Channel
								</Button >
							</Box>
						</Stack>
						<TextField
							variant="standard"
							className={classes.fitContent}
							aria-label="site-b-channel"
							label="Channel"
							error={false}
							disabled
							value={savedChannels.map(x => x.polarization === 'XPOL' ? x.name + '[xpol]' : x.name)}
						/>
					</Stack>
					<div>
						{isOpenDialog &&
							<>
								{processing ?
									<Stack className={classes.loading}>
										<Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'} >
											<DialogContent>
												<DialogContentText>
													Channel Select
												</DialogContentText>
												<DialogActions>
													<IconButton
														aria-label="close"
														className={classes.closeIcon}
														onClick={handleDialogClose}
														size="large">
														<CloseIcon />
													</IconButton>
												</DialogActions>
												<Paper>
													<div className={classes.loading}>
														<CircularProgress style={{ color: '#2596be' }} />
														<h3>Processing ...</h3>
													</div>
												</Paper>
											</DialogContent>
										</Dialog>
									</Stack>
								  :
									<>
										{channelListQuery.length > 0 ?
											<Stack>
												<ChannelListDialog
													close={handleDialogClose}
													open={isOpenDialog}
													band={band.frequency}
													linkId={linkId}
													frequencyPlanSiteA={frequencyPlanA!}
													frequencyPlanSiteB={frequencyPlanB!}
													row={allChannels}
													selectedElementProp={savedChannels}
													updatechannels={updatechannels}
												/>
											</Stack>
										  :
											<div>
												<Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'} >
													<DialogContent>
														<DialogContentText>
															Channel
														</DialogContentText>
														<DialogActions>
															<IconButton
																aria-label="close"
																className={classes.closeIcon}
																onClick={handleDialogClose}
																size="large">
																<CloseIcon />
															</IconButton>
														</DialogActions>
														<Paper>
															<ConnectionInfo
																message={''}
																messageType={'Calculation Error'}
																reachable={channelListQuery.length === 0 }
															/>
														</Paper>
													</DialogContent>
												</Dialog>
											</div>

										}
									</>
								}
							</>
						}

					</div >
				</div >
			}
		</div>
  );

});
FrequencyChannelView.displayName = 'Frequency';
export default FrequencyChannelView;


