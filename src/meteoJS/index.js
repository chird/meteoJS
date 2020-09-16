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
 * Any event.
 * 
 * @external Event
 * @see {@link https://developer.mozilla.org/de/docs/Web/API/Event}
 */

/**
 * XMLHttpRequest object.
 * 
 * @external XMLHttpRequest
 * @see {@link https://developer.mozilla.org/de/docs/Web/API/XMLHttpRequest}
 */

/**
 * SVG object.
 * 
 * @external SVG
 * @see {@link https://svgjs.com/docs/3.0/|API Doc}
 */

import 'regenerator-runtime/runtime.js';

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
import {
  default as Visualisation,
  makeTimeTextCallbackFunction
} from './timeline/Visualisation.js';
import { default as Text } from './timeline/visualisation/Text.js';
import { default as Slider } from './timeline/visualisation/Slider.js';
import { default as bsButtons } from './timeline/visualisation/bsButtons.js';
import { default as bsDropdown } from './timeline/visualisation/bsDropdown.js';
export const timeline = {
  Animation,
  Visualisation,
  makeTimeTextCallbackFunction,
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
import { default as SynviewCollection } from './synview/Collection.js';
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
  Collection: SynviewCollection,
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

export { default as Modelviewer } from './Modelviewer.js';
import Variable from './modelviewer/Variable.js';
import TimeVariable from './modelviewer/TimeVariable.js';
import VariableCollection from './modelviewer/VariableCollection.js';
import Node from './modelviewer/Node.js';
import ModelviewerResource from './modelviewer/Resource.js';
import ModelviewerImage from './modelviewer/resource/Image.js';
import ModelviewerSounding from './modelviewer/resource/Sounding.js';
import Resources from './modelviewer/Resources.js';
import NWPResources from './modelviewer/NWPResources.js';
import Container from './modelviewer/Container.js';
import Display from './modelviewer/Display.js';
import Simple from './modelviewer/display/Simple.js';
import SelectNavigation from './modelviewer/display/SelectNavigation.js';
export const modelviewer = {
  Variable,
  TimeVariable,
  VariableCollection,
  Node,
  Resource: ModelviewerResource,
  resource: {
    Image: ModelviewerImage,
    Sounding: ModelviewerSounding
  },
  Resources,
  NWPResources,
  Container,
  Display,
  display: {
    Simple,
    SelectNavigation
  }
}

export { default as Sounding } from './Sounding.js';
import { default as Parcel } from './sounding/Parcel.js';
export const sounding = {
  Parcel
};

export { default as ThermodynamicDiagramPluggable } from './ThermodynamicDiagramPluggable.js';
export { default as ThermodynamicDiagram } from './ThermodynamicDiagram.js';
import CoordinateSystem from './thermodynamicDiagram/CoordinateSystem.js';
import StueveDiagram from './thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import Emagram from './thermodynamicDiagram/coordinateSystem/Emagram.js';
import SkewTlogPDiagram from './thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import DiagramSounding from './thermodynamicDiagram/DiagramSounding.js';
import Hodograph from './thermodynamicDiagram/Hodograph.js';
import TDDiagram from './thermodynamicDiagram/TDDiagram.js';
import { drawWindbarbInto } from './thermodynamicDiagram/Functions.js';
import WindbarbsProfile from './thermodynamicDiagram/WindbarbsProfile.js';
import WindspeedProfile from './thermodynamicDiagram/WindspeedProfile.js';
import xAxis from './thermodynamicDiagram/axes/xAxis.js';
import yAxis from './thermodynamicDiagram/axes/yAxis.js';
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
  functions: {
    drawWindbarbInto
  },
  WindbarbsProfile,
  WindspeedProfile,
  axes: {
    xAxis,
    yAxis
  }
};