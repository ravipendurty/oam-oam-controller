/* eslint-disable react/prop-types */
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

import React from 'react';
import { TreeItemContentProps, useTreeItem } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useSelectApplicationState } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

type TreeItemComponentProps = TreeItemContentProps;

interface CustomContentProps extends TreeItemComponentProps {
  toggleTreeItems: (nodeId: string, expanded: boolean) => Promise<any>;
  retrieveDetails: (siteId: string, isCallFromSearch: boolean) => void;
  isNodeSelected: boolean;
}

// Custom TreeItem content
export const CustomContent = React.forwardRef<any>(function CustomContent(
  props: CustomContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    toggleTreeItems,
    retrieveDetails,
    isNodeSelected,

  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  useSelectApplicationState((state: IApplicationStoreState) => state.siteManager);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    await toggleTreeItems(nodeId, expanded).then(() => {
      handleExpansion(event);
    });
    handleExpansion(event);
  };

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    retrieveDetails(nodeId, false);
    handleSelection(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: isNodeSelected || selected,
        [classes.focused]: isNodeSelected || focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component='div'
        className={classes.label}
      >
        <div onClick={handleExpansionClick}>{label}</div>
      </Typography>
    </div>
  );
});

