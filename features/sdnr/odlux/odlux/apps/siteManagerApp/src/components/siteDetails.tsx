import React, { useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

import { useApplicationDispatch } from '../../../../framework/src/flux/connect';

import { loadAllAvailableSiteTypesAsync } from '../actions/siteManagerTreeActions';
import { Sites } from '../models/siteManager';
import siteManagerService from '../services/siteManagerService';

const useStyles = makeStyles({
  formContainer: {
    position: 'relative',
    paddingRight: '48px',
  },
  iconContainer: {
    position: 'absolute',
    top: '8px',
    right: '0',
    display: 'flex',
    zIndex: 1,
  },
});

type Address = {
  streetAndNr: string;
  city: string;
  zipCode: string;
  country: string;
};

type Location = {
  lon: string;
  lat: string;
};

interface AvailableSiteTypes {
  keyId: number;
  type: string;
}

type SiteDetailsProps = {
  siteDetails: {
    id: string;
    uuid: string;
    name: string;
    amslInMeters: string;
    type: string;
    'area-id': string;
    'item-count': number;
    address: Address;
    operator: string;
    location: Location;
    [key: string]: any;
  };
};

const SiteDetailsAccordion: React.FC<SiteDetailsProps> = (props: SiteDetailsProps) => {
  const classes = useStyles();
  const dispatch = useApplicationDispatch();
  const getAllAvailableSiteTypes = async () => dispatch(loadAllAvailableSiteTypesAsync());

  const [formState, setFormState] = useState<Sites>(props.siteDetails);
  const [siteTypesData, setSiteTypesData] = useState<AvailableSiteTypes[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saveInfoMessage, setSaveInfoMessage] = React.useState<{ message: string; error: boolean }>({ message: '', error: false });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const [parent, key] = name.split('.');

    setFormState((prevFormData) => ({
      ...prevFormData,
      [parent]: {
        ...(prevFormData[parent as keyof Sites] as object),
        [key]: value,
      },
    }));

  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveInfoMessage({ message: '', error: false });
  };

  const handleCancelClick = () => {
    setFormState(props.siteDetails);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    const editedFields: Sites = Object.keys(formState).reduce<any>((acc, key) => {
      if (formState[key as keyof Sites] !== props.siteDetails[key as keyof Sites]) {
        acc[key as keyof Sites] = formState[key as keyof Sites];
      }
      return acc;
    }, {});
    siteManagerService.saveModifiedSiteDetails(editedFields, formState.id).then((result) => {
      setSaveInfoMessage(result);
    });
    setIsEditing(false);
  };

  const fetchAllAvailableSiteTypes = async () => {
    try {
      const data: any = await getAllAvailableSiteTypes();
      const tableData: any[] = data.map((row: any) => ({
        type: row,
      }));
      setSiteTypesData(tableData);
    } catch (error) {
      console.error('Error fetching all Site types:', error);
    }
  };

  React.useEffect(() => {
    setFormState(props.siteDetails);
    fetchAllAvailableSiteTypes();
    setSaveInfoMessage({ message: '', error: false });
  }, [props.siteDetails]);

  return (
    <>
      <div className={classes.formContainer}>
        <TextField label="Site Name" aria-label='site-details-site-name' variant="standard" name="name" fullWidth value={formState.name}
          onChange={handleInputChange} InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="SiteID" aria-label='site-details-site-id' variant="standard" name="id" type="email" fullWidth value={formState.id}
          onChange={handleInputChange} InputProps={{ readOnly: !isEditing }} disabled={isEditing} /> <br />
        <TextField label="UUID" aria-label='site-details-site-uuid' variant="standard" fullWidth name="uuid" value={formState.uuid}
          onChange={handleInputChange} InputProps={{ readOnly: !isEditing }} disabled={isEditing} /> <br />
        <TextField label="Latitude" aria-label='site-details-latitude' variant="standard" name="location.lat" fullWidth
          value={formState.location ? formState.location.lat : ''} onChange={handleNestedInputChange} InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="Longitude" aria-label='site-details-longitude' variant="standard" name="location.lon" fullWidth
          value={formState.location ? formState.location.lon : ''} onChange={handleNestedInputChange} InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="Street & Number" aria-label='site-details-site-addr-street' variant="standard" name="address.streetAndNr" fullWidth
          value={formState.address ? formState.address.streetAndNr : ''} onChange={handleNestedInputChange} InputProps={{ readOnly: !isEditing }} /><br />
        <TextField label="Zip Code" aria-label='site-details-site-addr-zip' variant="standard" name="address.zipCode" fullWidth
          value={formState.address ? formState.address.zipCode : ''} onChange={handleNestedInputChange} InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="City" aria-label='site-details-site-addr-city' variant="standard" name="address.city" fullWidth
          value={formState.address ? formState.address.city : ''} onChange={handleNestedInputChange}
          InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="Country" aria-label='site-details-addr-country' variant="standard" name="address.country" fullWidth
          value={formState.address ? formState.address.country : ''} onChange={handleNestedInputChange}
          InputProps={{ readOnly: !isEditing }} /> <br />
        <TextField label="amslInMeters" aria-label='site-details-site-amsl' variant="standard" name="amslInMeters" fullWidth
          value={formState.amslInMeters} onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }} /> <br />
        <FormControl variant="standard" fullWidth>
          <InputLabel htmlFor="siteType">type</InputLabel>
          <Select style={{ marginTop: '30px' }} variant="standard" aria-label="site-details-site-type-selection" value={formState.type || ''}
            inputProps={{ readOnly: !isEditing }}
            onChange={(event) => {
              event.preventDefault();
              const selectedSiteType = event.target.value;
              setFormState({ ...formState, type: selectedSiteType });
            }} fullWidth >
            {siteTypesData.map((rows) => (
              <MenuItem key={rows.keyId} value={rows.type}>
                {rows.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Operator" aria-label='site-details-site-operator' variant="standard" name="operator" fullWidth disabled={isEditing}
          value={formState.operator} onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }} /> <br />

        {isEditing ? (
          <div className={classes.iconContainer}>
            <IconButton onClick={e => { e.preventDefault(); handleSubmit(); }}>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelClick}>
              <CancelIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton onClick={handleEditClick} className={classes.iconContainer}>
            <EditIcon />
          </IconButton>
        )}

        <div style={{ marginTop: '20px' }} >
          {
            saveInfoMessage.message.length > 0 && (!saveInfoMessage.error) &&
            <Typography aria-label='site-manager-order-creation-message' style={{ marginTop: 10 }} color={'green'}
              variant='body1'>{saveInfoMessage.message}</Typography>
          }
          {
            saveInfoMessage.message.length > 0 && saveInfoMessage.error &&
            <Typography aria-label='site-manager-order-creation-message' style={{ marginTop: 10 }} color={'red'}
              variant='body1'>{'Save Failed - ' + saveInfoMessage.message}</Typography>
          }
        </div>
      </div>
    </>
  );
};

export default SiteDetailsAccordion;
