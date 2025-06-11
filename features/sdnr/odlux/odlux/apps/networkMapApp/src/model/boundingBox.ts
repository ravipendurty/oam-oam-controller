/* eslint-disable no-underscore-dangle */
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

/***
 * Custom bounding box, holds a rectangular area spanned open by lat-lon coordinate pairs
 */
export class BoundingBox {

  private _south: number;
 
  private _west: number;

  private _north: number;
 
  private _east: number;

  get south(): number {
    return this._south;
  }

  get west():number {
    return this._west;
  }

  get north():number {
    return this._north;
  }

  get east():number {
    return this._east;
  }

  public static createFromBoundingBox = (mapboxBoundingBox: maplibregl.LngLatBounds) => {
    const bbox = new BoundingBox();
    bbox._south = mapboxBoundingBox.getSouth();
    bbox._east = mapboxBoundingBox.getEast();
    bbox._north = mapboxBoundingBox.getNorth();
    bbox._west = mapboxBoundingBox.getWest();
    return bbox;
  };

  public static createFromNumbers = (west: number, south: number, east: number, north: number) => {
    const bbox = new BoundingBox();
    bbox._south = south;
    bbox._west = west;
    bbox._north = north;
    bbox._east = east;
    return bbox;
  };

}