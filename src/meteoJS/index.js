/**
 * @module meteoJS
 */

/**
 * jQuery object.
 * 
 * @external jQuery
 * @see {@link https://api.jquery.com|API Doc}
 */

/**
 * Any HTML element.
 * 
 * @external HTMLElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
 */

/**
 * XMLHttpRequest object.
 * 
 * @external XMLHttpRequest
 * @see {@link https://developer.mozilla.org/de/docs/Web/API/XMLHttpRequest}
 */

/**
 * Moment's format method.
 * 
 * @external moment#format
 * @see {@link https://momentjs.com/docs/#/displaying/format/|API Doc}
 */

/**
 * SVG object.
 * 
 * @external SVG
 * @see {@link https://svgjs.com/docs/3.0/|API Doc}
 */

import * as calc from './calc.js';
export { calc };

import { default as addEventFunctions } from './Events.js';
export const events = {
  addEventFunctions
};

export { default as RepetitiveRequests } from './RepetitiveRequests.js';

export { default as Timeline } from './Timeline.js';
import { default as Animation,
  insertFrequencyInput,
  insertFrequencyRange,
  insertFrequencyButtonGroup,
  insertRestartPauseInput,
  insertRestartPauseRange,
  insertRestartPauseButtonGroup } from './timeline/Animation.js';
import { default as ToggleButton } from './timeline/animation/ToggleButton.js';
import { default as Visualisation } from './timeline/Visualisation.js';
import { default as Text } from './timeline/visualisation/Text.js';
import { default as Slider } from './timeline/visualisation/Slider.js';
import { default as bsButtons } from './timeline/visualisation/bsButtons.js';
import { default as bsDropdown } from './timeline/visualisation/bsDropdown.js';
export const timeline = {
  Animation,
  Visualisation,
  animation: {
    ToggleButton,
    insertFrequencyInput,
    insertFrequencyRange,
    insertFrequencyButtonGroup,
    insertRestartPauseInput,
    insertRestartPauseRange,
    insertRestartPauseButtonGroup
  },
  visualisation: {
    Text,
    Slider,
    bsButtons,
    bsDropdown
  }
};

export { default as Synview } from './Synview.js';
import { default as Collection } from './synview/Collection.js';
import { default as Map } from './synview/SynviewMap.js';
import { default as MapOL } from './synview/map/MapOL.js';
import { default as MapLL } from './synview/map/MapLL.js';
import { default as Resource } from './synview/Resource.js';
import { default as GeoJSON } from './synview/resource/GeoJSON.js';
import { default as GeoJSONTile } from './synview/resource/GeoJSONTile.js';
import { default as Image } from './synview/resource/Image.js';
import { default as OSM } from './synview/resource/OSM.js';
import { default as Vector } from './synview/resource/Vector.js';
import { default as VectorTile } from './synview/resource/VectorTile.js';
import { default as ResourceCollection } from './synview/ResourceCollection.js';
import { default as Tooltip } from './synview/Tooltip.js';
import { default as Type } from './synview/Type.js';
import { default as TypeCollection } from './synview/TypeCollection.js';
export const synview = {
  Collection,
  Map,
  map: {
    MapOL,
    MapLL
  },
  Resource,
  resource: {
    GeoJSON,
    GeoJSONTile,
    Image,
    OSM,
    Vector,
    VectorTile
  },
  ResourceCollection,
  Tooltip,
  Type,
  TypeCollection
};

export { Tooltip } from './Tooltip.js';
import BootstrapTooltip from './tooltip/BootstrapTooltip.js';
export const tooltip = {
  BootstrapTooltip
};

export { default as Sounding } from './Sounding.js';
import { default as Parcel } from './sounding/Parcel.js';
export const sounding = {
  Parcel
};

export { default as ThermodynamicDiagram } from './ThermodynamicDiagram.js';
import { default as CoordinateSystem } from './thermodynamicDiagram/CoordinateSystem.js';
import { default as StueveDiagram } from './thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import { default as Emagram } from './thermodynamicDiagram/coordinateSystem/Emagram.js';
import { default as SkewTlogPDiagram } from './thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import { default as DiagramSounding } from './thermodynamicDiagram/DiagramSounding.js';
import { default as Hodograph } from './thermodynamicDiagram/Hodograph.js';
import { default as TDDiagram } from './thermodynamicDiagram/TDDiagram.js';
import { default as Windprofile } from './thermodynamicDiagram/Windprofile.js';
import { default as xAxis } from './thermodynamicDiagram/axes/xAxis.js';
import { default as yAxis } from './thermodynamicDiagram/axes/yAxis.js';
export const thermodynamicDiagram = {
  CoordinateSystem,
  coordinateSystem: {
    StueveDiagram,
    Emagram,
    SkewTlogPDiagram
  },
  DiagramSounding,
  Hodograph,
  TDDiagram,
  Windprofile,
  axes: {
    xAxis,
    yAxis
  }
};