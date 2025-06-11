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

import React, { FC, MouseEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  denseTable: {
    borderRadius: '0px',
  },
  button: {
    margin: 0,
    padding: '6px 6px',
    minWidth: 'unset',
  },
});

type DenseTableProps = {
  actions?: boolean;
  headers: string[];
  height: number;
  hover: boolean;
  ariaLabelRow: string;
  ariaLabelColumn?: string[];
  verticalTable?: boolean;
  navigate?(applicationName: string, path?: string): void;
  onLinkClick?(id: string): void; data: any[];
  onClick?(id: string): void;
};

const DenseTable: FC<DenseTableProps> = (props) => {
  const {
    ariaLabelRow,
    data,
    headers,
    height,
    hover,
    ariaLabelColumn,
    onClick = () => undefined,
    navigate = () => undefined,
    verticalTable,
  } = props;

  const styles = useStyles();

  const handleClick = (event: MouseEvent<HTMLDivElement>, id: string) => {
    event.preventDefault();
    onClick(id);
  };

  return (
    <Paper className={styles.denseTable}>
      <div style={{ height: height, overflow: 'auto' }}>
        <Table padding="normal" stickyHeader size="small" aria-label="table" >
          <TableHead>
            <TableRow>
              {
                headers.map((tableHeader) => (<TableCell>{tableHeader}</TableCell>))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {

              const values = (typeof row === 'string' || row instanceof String) ? [row] : Object.keys(row).map(function (e) { return row[e]; });

              return (
                <TableRow aria-label={ariaLabelRow} key={index} hover={hover} onClick={e => handleClick(e, row.name)}>
                  {
                    values.map((value, i) => {
                      if (value !== undefined) {

                        if (!verticalTable) {
                          const ariaLabel = ariaLabelColumn === undefined ? headers[i].toLowerCase() : ariaLabelColumn[i];
                          if (ariaLabel.length > 0) {
                            return <TableCell aria-label={ariaLabel}>{value}</TableCell>;
                          } else {
                            return <TableCell>{value}</TableCell>;
                          }
                        } else {
                          // skip adding aria label to 'header' column
                          if (i === 0) {
                            return <TableCell>{value}</TableCell>;
                          } else {
                            const ariaLabel = props.ariaLabelColumn === undefined ? props.headers[index].toLowerCase() : props.ariaLabelColumn[index];
                            return <TableCell aria-label={ariaLabel}>{value}</TableCell>;
                          }
                        }
                      } else
                        return null;
                    })
                  }
                  {
                    props.actions && <TableCell >
                      <div style={{ display: 'flex' }}>
                        <Tooltip disableInteractive title="Configure">
                          <Button
                            color="inherit"
                            className={styles.button}
                            aria-label="configuration-button"
                            disabled={row.status !== 'Connected'}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate('configuration', row.name);
                            }}>C</Button>
                        </Tooltip>
                        <Tooltip disableInteractive title="Fault">
                          <Button
                            color="inherit"
                            className={styles.button}
                            aria-label="fault-button"
                            disabled={row.status !== 'Connected'}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate('fault', row.name);
                            }}>F</Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  }
                </TableRow>);
            })
            }
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

DenseTable.displayName = 'DenseTable';

export default DenseTable;