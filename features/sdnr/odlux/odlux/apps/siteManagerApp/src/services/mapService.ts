import { IExternalTableState } from '../../../../framework/src/components/material-table/utilities';
import { requestRest } from '../../../../framework/src/services/restService';
import { SiteDetails } from '../models/siteDetails';

const filterKeysUrl = '/topology/network/filters/keys';

type FilterKey = {
  key: string;
  reference: string;
  type: string;
  label: string | null;
};

let filterMapping: { [table: string]: { [column: string]: { key: string; type: string } } };

const getFieldMapping = async () => {
  if (filterMapping) {
    return filterMapping;
  }

  const response = await requestRest<FilterKey[]>(filterKeysUrl);
  if (!response) {
    throw new Error('No filter mapping found');
  }

  filterMapping = {};
  response.forEach(key => {
    const parts = key.reference.split('.');
    const table = parts[0];
    const column = parts[1];

    if (!filterMapping[table]) {
      filterMapping[table] = {};
    }
    filterMapping[table][column] = { key: key.key, type: key.type };
  });

  return filterMapping;
};

const createMapFilter = async (tableName: string, tableState: IExternalTableState<SiteDetails>) => {
  const mapping = await getFieldMapping();

  return Object.keys(tableState.filter).map(key => {
    const column = mapping[tableName] && mapping[tableName][key];
    const value = tableState.filter[key] && tableState.filter[key].trim();
    if (!column || !value) {
      return null;
    }
    return value.match(/^[<>]/i)
      ? `${column.key}${value}`
      : column.type === 'string'
        ? value.includes('\'')
          ? `${column.key}='${value}'`
          : `${column.key}='${value}'`
        : `${column.key}=${value}`;

  }).filter(filter => filter !== null).join(' AND ');

};

export { createMapFilter };
