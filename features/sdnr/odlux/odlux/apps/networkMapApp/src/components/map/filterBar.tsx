import React, { FC, useEffect, useState } from 'react';
import { useApplicationDispatch, useSelectApplicationState } from '../../../../../framework/src/flux/connect';

import FilterIcon from '@mui/icons-material/FilterList';
import makeStyles from '@mui/styles/makeStyles';

import { SetFilterValueAction } from '../../actions/filterActions';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles({
  filterBar: {
    padding: '2px 4px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    top: 70,
    marginLeft: 5,
    width: 400,
    zIndex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 5,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

const FilterBar: FC = () => {
  
  const filterValue = useSelectApplicationState(state => state.network.filter.value);
  
  const dispatch = useApplicationDispatch();
  const onFilterChange = (value: string) => dispatch(new SetFilterValueAction(value));
   
  const [filterText, setFilterText] = useState(filterValue);

  useEffect(() => {
    setFilterText(filterValue);
  }, [filterValue]);

  const handleFilterApply = () => {
    onFilterChange(filterText);
  };

  const styles = useStyles();
  
  return (
    <Paper component="form" className={styles.filterBar}>
      <InputBase
        className={styles.input}
        placeholder="Enter filter term"
        inputProps={{ 'aria-label': 'networkmap-filterbar' }}
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleFilterApply();
          }
        }}
        readOnly={false}
      />
      <Divider className={styles.divider} orientation="vertical" />
      <IconButton
        type="button"
        className={styles.iconButton}
        aria-label="apply-button"
        onClick={handleFilterApply}
        size="large">
        <FilterIcon />
      </IconButton>
    </Paper>
  );
};

FilterBar.displayName = 'FilterBar';

export { FilterBar };
