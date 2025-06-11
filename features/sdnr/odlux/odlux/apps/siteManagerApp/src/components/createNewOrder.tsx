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

import React from 'react';

import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { useApplicationDispatch, useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { ResetAction, SelectUserAction, SetTSSRAction, UpdateNoteAction, UpdateTasks } from '../actions/sitedocManagementAction';
import { SitedocOrder, SitedocOrderTask } from '../models/siteDocTypes';
import sitedocDataService from '../services/sitedocDataService';
import OrderTask from './orderTask';

type orderProps = RouteComponentProps & {
  siteId: string;
  onClose: (siteId: string) => void;
  onError: () => void;
};

const NewOrder = (props: orderProps) => {
  const users = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.sitedocManagement.users);
  const selectedUser = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.sitedocManagement.selectedUser);
  const isTssr = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.sitedocManagement.isTSSR);
  const tasks = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.sitedocManagement.tasks);
  const note = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.sitedocManagement.note);
  const site = useSelectApplicationState((state: IApplicationStoreState) => state.siteManager.details.data);

  const dispatch = useApplicationDispatch();
  const selectUserAction = (user: string) => dispatch(new SelectUserAction(user));
  const checkTSSR = (value: boolean) => dispatch(new SetTSSRAction(value));
  const updateNote = (noteUpdate: string) => dispatch(new UpdateNoteAction(noteUpdate));
  const setTasks = (addTasks: SitedocOrderTask[]) => dispatch(new UpdateTasks(addTasks));
  const reset = () => dispatch(new ResetAction());

  const emptyTask: SitedocOrderTask = { type: '', description: '', completed: false };
  const [isUsernameEmpty, setUsernameEmpty] = React.useState(false);
  const [areTasksEmpty, setTasksEmpty] = React.useState<{ error: boolean }[]>([]);
  const [orderInfoMessage, setOrderInfoMessage] = React.useState<{ message: string; error: boolean }>({ message: '', error: false });
  const splitSiteIdSelected = props.siteId.toString();
  let siteIdSelectedToCreateOrder = splitSiteIdSelected.split('#')[0];

  React.useEffect(() => {
    const taskErrors = tasks.map(() => { return { error: false }; });
    setTasksEmpty(taskErrors);
  }, []);

  const addTaskButtonClicked = (e: any) => {
    e.preventDefault();
    setTasks([...tasks, emptyTask]);
    setTasksEmpty([...areTasksEmpty, { error: false }]);
  };

  const update = (property: string, index: number, newValue: string) => {
    let items = [...tasks];
    let item = { ...items[index] } as any;
    item[property] = newValue;
    items[index] = item;
    setTasks(items);
    //clean error
    if (items[index].description.length > 0 && items[index].type.length > 0) {
      let errors = [...areTasksEmpty];
      errors[index] = { error: false };
      setTasksEmpty(errors);
    }
  };

  const updateTaskType = (index: number, value: string) => {
    update('type', index, value);
  };

  const updateTaskDescription = (index: number, value: string) => {
    update('description', index, value);
  };

  const onReset = () => {
    reset();
  };

  const checkTasks = (orderTasks: SitedocOrderTask[]) => {
    let empty: number[] = [];
    orderTasks.forEach((el, i) => {
      if (el.description.length == 0 || el.type.length == 0)
        empty.push(i);
    });

    return empty;
  };

  const createOrder = () => {
    const emptyTasks = checkTasks(tasks);
    let areParamsEmpty = false;
    if (selectedUser.length == 0) {
      setUsernameEmpty(true);
      areParamsEmpty = true;
    }

    if (emptyTasks.length > 0) {
      let orderTasks = areTasksEmpty;
      //clean errors
      orderTasks = tasks.map(() => { return { error: false }; });
      //set errors
      emptyTasks.forEach(el => {
        orderTasks[el] = { error: true };
      });
      setTasksEmpty(orderTasks);
      areParamsEmpty = true;
    }

    if (!areParamsEmpty) {
      setUsernameEmpty(false);
      setTasksEmpty([]);
      //remove possible milliseconds 
      const datetime = new Date().toJSON().split('.')[0] + 'Z';
      let newOrder: SitedocOrder = {
        tasks: tasks,
        state: 'OPEN',
        assignedUser: selectedUser,
        reportFile: '',
        note: note,
        date: datetime,
        isTssr: isTssr,
      };
      sitedocDataService.createOrder(newOrder, siteIdSelectedToCreateOrder)
        .then((res) => {
          //display message
          if (!res.serverError) {
            setOrderInfoMessage(res);
          }
        });
    }
  };

  const onClose = (siteId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onClose && props.onClose(siteId);
  };

  const onError = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onError && props.onError();
  };

  const name = site?.name;

  return <>
    <Dialog fullWidth open={true} >
      <DialogTitle>TSS-Report Order</DialogTitle>
      <DialogContent>
        <div>
          <span>Create order for site</span> <span>{siteIdSelectedToCreateOrder}</span><span>{name && name.length > 0 && ' | ' + name}</span>
          <FormControl style={{ marginTop: '20px' }} fullWidth variant='standard' error={isUsernameEmpty}>
            <InputLabel id='assign-user-label-siteManager'>Assign to User</InputLabel>
            <Select
              variant='standard'
              fullWidth
              labelId='assign-user-label-siteManager'
              aria-label='assign-user'
              value={selectedUser}
              onChange={(e) => { selectUserAction(e.target.value as string); setUsernameEmpty(false); }}
              label='Assign to User'>
              {
                users.map((el) => {
                  return <MenuItem aria-label={el.userName} value={el.userName}>{`${el.lastName}, ${el.firstName}`}</MenuItem>;
                })
              }
            </Select>
            {
              isUsernameEmpty && <FormHelperText>User cannot be empty</FormHelperText>
            }
          </FormControl>
          <FormGroup style={{ marginTop: '20px' }} >
            <FormControlLabel control={<Checkbox aria-label='site-manager-isTSSRCheckbox' color='secondary' checked={isTssr}
              onChange={() => checkTSSR(!isTssr)} />} label='Is TSSR' />
          </FormGroup>

          <div>
            {
              tasks.map((el, index) => {
                return <OrderTask error={areTasksEmpty[index]?.error} value={el} onDescUpdate={(e) => { updateTaskDescription(index, e); }}
                  onTypeUpdate={(e) => { updateTaskType(index, e); }} />;
              })
            }
            <DialogActions>
              <Button onClick={addTaskButtonClicked} aria-label='add-new-task' component='span' color='secondary'>
                ADD TASK
              </Button>
            </DialogActions>
            <TextField
              aria-label='add-note'
              variant='standard'
              multiline
              fullWidth
              value={note}
              onChange={e => { updateNote(e.target.value as string); }}
              label='Add Note' ></TextField>
          </div>
          <div style={{ marginTop: '20px' }} >
            {
              orderInfoMessage.message.length > 0 && (!orderInfoMessage.error) &&
              <Typography aria-label='site-manager-order-creation-message' style={{ marginTop: 10 }} color={'green'}
                variant='body1'>{orderInfoMessage.message}</Typography>
            }
            {
              orderInfoMessage.message.length > 0 && orderInfoMessage.error &&
              <>
                <Dialog open={true}>
                  <DialogTitle>Error in Order Creation </DialogTitle>
                  <DialogContent aria-label='site-manager-order-creation-error-message' > {orderInfoMessage.message}
                  </DialogContent>
                  <DialogActions>
                    <Button color='secondary' onClick={onError}>OK</Button>
                  </DialogActions>
                </Dialog>
              </>
            }
          </div>
        </div>
      </DialogContent>
      <DialogActions style={{ marginTop: '30px' }} >
        <Button aria-label='create-order-button' color='secondary' onClick={e => { e.preventDefault(); createOrder(); }}>CREATE ORDER</Button>
        <Button aria-label='reset-button' color='secondary' onClick={e => { e.preventDefault(); onReset(); }} >RESET</Button>
        <Button aria-label='close-button' color='secondary' onClick={e => { e.preventDefault(); onClose(siteIdSelectedToCreateOrder); }}>CLOSE</Button>
      </DialogActions>
    </Dialog>
  </>;
};

const CreateNewOrder = withRouter(NewOrder);

export default CreateNewOrder;
