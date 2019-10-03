/**
 * @module meteoJS
 */

import * as calc from './calc.js';
export { calc };

import { default as addEventFunctions } from './Events.js';
export const events = {
  addEventFunctions
};

import Unique from './base/Unique.js';
import Named from './base/Named.js';
import UniqueNamed from './base/UniqueNamed.js';
import Collection from './base/Collection.js';
import NamedCollection from './base/NamedCollection.js';
export const base = {
  Unique,
  Named,
  UniqueNamed,
  Collection,
  NamedCollection
}

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
}

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
    Simple
  }
}

export { default as Sounding } from './Sounding.js';
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
}