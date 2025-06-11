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
import React, { FC, useState } from 'react';

import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormHelperText from '@mui/material/FormHelperText';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ExpandMoreOutlined } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';
import { saveLinkCallAsync } from '../actions/saveLinkAction';
import { isCalculationServerReachableAction } from '../actions/viewAction';
import ConnectionInfo from '../components/connectionInfo';
import AntennaView from '../components/antenna';
import AttenuationView from '../components/attenuations';
import FrequencyChannelView from '../components/frequencyChannel';
import LocationView from '../components/location';
import RadioView from '../components/radio';
import WaveguideView from '../components/waveguide';
import MissingInformation from '../components/missingInformation';
import { BASE_URL } from '../../pluginMicrowave';
import { check } from '../utils/checkLink';
import { calculateButtonAction } from '../actions/handleButtonAction';



const styles = makeStyles({
  sectionMargin: {
    position: 'relative', background: 'rgb(187, 189, 191)', padding: '20px', overflow: 'auto',
  },
  loading: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999,
  },
  outerDiv: {
    paddingLeft: '15px', paddingRight: '15px', paddingTop: '0px', display: 'flex', flexDirection: 'column', flex: 1,
  },
  accordionTitle: {
    width: '33%', flexShrink: 0,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  calculateButton: {
    marginTop: 20, position: 'fixed', top: '150px', right: '70px',
  },
  saveButton: {
    marginTop: 20, position: 'fixed', top: '200px', right: '70px',
  },
  saveResponseOk: {
    marginTop: 65, position: 'fixed', top: '250px', right: '70px',
  },
  serverResponse: {
    marginTop: 65, position: 'fixed', top: '250px', right: '70px', color: 'red',
  },
  paper: {
    display: 'flex', flexDirection: 'row',
  },
  buttonBox: { width: '170px' },
  closeIcon: {
    marginTop: 20, top: '-75px', right: '-40px',
  },
});

const LinkCalculation: FC = (() => {
  const attenuationMandatoryParameters = useSelectApplicationState( state=> state.microwave.atmosphere.attenuationMandatoryParameters);
  const radioMandatoryParameters = useSelectApplicationState( state=> state.microwave.radio.radioMandatoryParameters);
  const waveguideMandatoryParameters = useSelectApplicationState(state=> state.microwave.waveguide.waveguideMandatoryParameters);
  const antennaMandatoryParameters = useSelectApplicationState( state=> state.microwave.antenna.antennaMandatoryParameters);
  const frequencyMandatoryParameters = useSelectApplicationState( state=> state.microwave.radio.frequencyMandatoryParameters);
  const locationMandatoryParameters = useSelectApplicationState( state=> state.microwave.site.locationMandatoryParameters);
  const linkAttributes = useSelectApplicationState( state=> state.microwave.query.linkAttributes);
  //   const loadingComplete = useSelectApplicationState( state=> state.microwave.view.loadingComplete);
  const processing = useSelectApplicationState( state=> state.microwave.view.processing);
  //   const formView = useSelectApplicationState( state=> state.microwave.view.formView);
  const reachable = useSelectApplicationState( state=> state.microwave.view.reachable);
  const save = useSelectApplicationState( state=> state.microwave.query.linkSave);
  const isCalculationServerReachable = useSelectApplicationState( state=> state.microwave.view.reachable);
  const savingComplete = useSelectApplicationState( state=> state.microwave.query.savingComplete);
  const linkSaving = useSelectApplicationState( state=> state.microwave.query.linkSaving);
  
  const [isFrequencyAccordionOpen, setFrequencyAccordionOpen] = useState(false);
  const [isAntennaAccordionOpen, setAntennaAccordionOpen] = useState(false);
  const [isWaveguideAccordionOpen, setWaveguideAccordionOpen] = useState(false);
  const [isRadioAccordionOpen, setRadioAccordionOpen] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const dispatch = useApplicationDispatch();
  
  const UpdateConectivity = (serverReachable: boolean) => dispatch(new isCalculationServerReachableAction(serverReachable));



  const restCallsActionAsync = () => dispatch(calculateButtonAction());
  const saveCallsActionAsync = () => dispatch(saveLinkCallAsync());

  const classes = styles();
  const handleDialogClose = () => setOpenDialog(false);

  const handleButton = (e: any) => {
    if (e.target.value === 'CALCULATE') {
      restCallsActionAsync();
    }
    if (e.target.value === 'SAVE') {
      setOpenDialog(true);
      saveCallsActionAsync();
    }
  };

  React.useEffect(() => {

  }, []);
  React.useEffect(() => {
    fetch(BASE_URL + '/fsl/1/' + '$13')
      .then(res => { if (res.ok) { UpdateConectivity(true); } else { UpdateConectivity(false); } });
  }, []);


  return (
		<div className={classes.sectionMargin}>
			<Paper id="link-details-panel" aria-label="linkcalculator-panel" className={classes.paper} >
				<ConnectionInfo
					messageType={'Connection Error'}
					message={'Calculation data can not be loaded'}
					reachable={isCalculationServerReachable!}
				/>


				{
					reachable &&
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
								{(check(linkAttributes)) !== '' ?
									<MissingInformation /> :
									<div className={classes.outerDiv} >

										<Accordion aria-label="location-accordion" defaultExpanded>
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="location-panel-header"
												id="location-panel-header"
											>
												<Typography className={classes.accordionTitle} aria-label="location-panel-label">Location</Typography>
												{!locationMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="location-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="location-panel-details" >

												<LocationView aria-label="location-view" />
											</AccordionDetails>
										</Accordion>

										<Accordion aria-label="frequeny-channel-accordion" expanded={isFrequencyAccordionOpen} onChange={() => setFrequencyAccordionOpen(!isFrequencyAccordionOpen)}>
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="frequeny-panel-header"
												id="frequency-header"
											>
												<Typography className={classes.accordionTitle} aria-label="frequency-panel-label">Frequency and Channel</Typography>
												{!frequencyMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="frequency-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="frequency-panel-details"  >
												{isFrequencyAccordionOpen &&
													<FrequencyChannelView aria-label="frequency-view" />
												}
											</AccordionDetails>
										</Accordion>
										<Accordion aria-label="antenna-accordion" expanded={isAntennaAccordionOpen} onChange={() => setAntennaAccordionOpen(!isAntennaAccordionOpen)}>
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="antenna-header"
												id="antenna-header"
											>
												<Typography className={classes.accordionTitle} aria-label="antenna-panel-label">Antenna</Typography>
												{!antennaMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="antenna-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="antenna-panel-details"  >
												<AntennaView aria-label="antenna-view" />
											</AccordionDetails>
										</Accordion>
										<Accordion aria-label="waveguide-accordion" expanded={isWaveguideAccordionOpen} onChange={() => setWaveguideAccordionOpen(!isWaveguideAccordionOpen)}>
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="waveguide-header"
												id="waveguide-header"
											>
												<Typography className={classes.accordionTitle} aria-label="waveguide-panel-label">Waveguide</Typography>
												{!waveguideMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="waveguide-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="waveguide-panel-details"  >
												<WaveguideView aria-label="waveguide-view" />
											</AccordionDetails>
										</Accordion>
										<Accordion aria-label="radio-accordion" expanded={isRadioAccordionOpen} onChange={() => setRadioAccordionOpen(!isRadioAccordionOpen)}>
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="radio-header"
												id="radio-header"
											>
												<Typography className={classes.accordionTitle} aria-label="radio-panel-label">Radio</Typography>
												{!radioMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="radio-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="radio-panel-details"  >
												<RadioView aria-label="radio-view" />
											</AccordionDetails>
										</Accordion>
										<Accordion aria-label="attenuation-accordion">
											<AccordionSummary
												expandIcon={<ExpandMoreOutlined />}
												aria-label="attenuation-header"
												id="attenuation-header"
											>
												<Typography className={classes.accordionTitle} aria-label="attenuation-panel-label">Attenuation</Typography>
												{!attenuationMandatoryParameters &&
													< Typography >
														<FormHelperText error aria-label="attenuation-panel-error">  * Required Fields Missing * </FormHelperText>
													</Typography>
												}
											</AccordionSummary>
											<AccordionDetails className={classes.justifyCenter} aria-label="attenuation-panel-details"  >
												<AttenuationView aria-label="attenuation-view" />

											</AccordionDetails>
										</Accordion >
									</div>
								}
								<Box className={classes.buttonBox}>
									<Button className={classes.calculateButton} value='CALCULATE' aria-label="link-calculator-button" variant="contained" color="primary"
										onClick={handleButton}>
										Calculate Link
									</Button >
									<Button className={classes.saveButton} value='SAVE' aria-label="save-link-button" variant="contained" color="primary"
										onClick={handleButton}>
										Save Link
									</Button >
									<div>
										{isOpenDialog &&

											<>
												{
													linkSaving ?

														<Stack>
															<Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'} >
																<DialogContent>
																	<DialogContentText>
																		Save
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
																			<h3>Saving ...</h3>
																		</div>
																	</Paper>
																</DialogContent>
															</Dialog>
														</Stack>

													  : <>
															{
																save.saveFail ?
																	<Stack >
																		<Dialog onClose={handleDialogClose} open={isOpenDialog} fullWidth maxWidth={'lg'}  >
																			<DialogContent>
																				<Paper style={{ height: '200px' }}>
																					<ConnectionInfo
																						messageType={'Saving Error'}
																						message={save.message}
																						reachable={save.message === ''}
																						style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999 }}
																					/>
																				</Paper>
																			</DialogContent>
																		</Dialog>
																	</Stack>
																  : savingComplete &&
																	save.status === 200 &&
																	<Typography className={classes.saveResponseOk} variant="body1">Link Saved</Typography>
															}
														</>
												}
											</>
										}
									</div>
								</Box>
							</>
						}
					</>
				}
			</Paper >
		</div >
  );
});

export default LinkCalculation;
