(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"external-Event.html\">Event</a>","id":"external:Event","children":[]},{"label":"<a href=\"external-HTMLElement.html\">HTMLElement</a>","id":"external:HTMLElement","children":[]},{"label":"<a href=\"external-SVG.html\">SVG</a>","id":"external:SVG","children":[]},{"label":"<a href=\"external-XMLHttpRequest.html\">XMLHttpRequest</a>","id":"external:XMLHttpRequest","children":[]},{"label":"<a href=\"external-jQuery.html\">jQuery</a>","id":"external:jQuery","children":[]},{"label":"<a href=\"module-meteoJS.html\">meteoJS</a>","id":"module:meteoJS","children":[{"label":"base","id":"module:meteoJS/base","children":[{"label":"<a href=\"module-meteoJS_base_collection.html\">collection</a>","id":"module:meteoJS/base/collection","children":[{"label":"<a href=\"module-meteoJS_base_collection.Collection.html\">Collection</a>","id":"module:meteoJS/base/collection.Collection","children":[]}]},{"label":"<a href=\"module-meteoJS_base_named.html\">named</a>","id":"module:meteoJS/base/named","children":[{"label":"<a href=\"module-meteoJS_base_named.Named.html\">Named</a>","id":"module:meteoJS/base/named.Named","children":[]}]},{"label":"<a href=\"module-meteoJS_base_namedCollection.html\">namedCollection</a>","id":"module:meteoJS/base/namedCollection","children":[{"label":"<a href=\"module-meteoJS_base_namedCollection.NamedCollection.html\">NamedCollection</a>","id":"module:meteoJS/base/namedCollection.NamedCollection","children":[]}]},{"label":"<a href=\"module-meteoJS_base_unique.html\">unique</a>","id":"module:meteoJS/base/unique","children":[{"label":"<a href=\"module-meteoJS_base_unique.Unique.html\">Unique</a>","id":"module:meteoJS/base/unique.Unique","children":[]}]},{"label":"<a href=\"module-meteoJS_base_uniquenamed.html\">uniquenamed</a>","id":"module:meteoJS/base/uniquenamed","children":[{"label":"<a href=\"module-meteoJS_base_uniquenamed.UniqueNamed.html\">UniqueNamed</a>","id":"module:meteoJS/base/uniquenamed.UniqueNamed","children":[]}]}]},{"label":"<a href=\"module-meteoJS_calc.html\">calc</a>","id":"module:meteoJS/calc","children":[]},{"label":"<a href=\"module-meteoJS_events.html\">events</a>","id":"module:meteoJS/events","children":[]},{"label":"<a href=\"module-meteoJS_repetitiveRequests.html\">repetitiveRequests</a>","id":"module:meteoJS/repetitiveRequests","children":[{"label":"<a href=\"module-meteoJS_repetitiveRequests.RepetitiveRequests.html\">RepetitiveRequests</a>","id":"module:meteoJS/repetitiveRequests.RepetitiveRequests","children":[]}]},{"label":"<a href=\"module-meteoJS_sounding.html\">sounding</a>","id":"module:meteoJS/sounding","children":[{"label":"<a href=\"module-meteoJS_sounding.Sounding.html\">Sounding</a>","id":"module:meteoJS/sounding.Sounding","children":[]},{"label":"<a href=\"module-meteoJS_sounding_parcel.html\">parcel</a>","id":"module:meteoJS/sounding/parcel","children":[{"label":"<a href=\"module-meteoJS_sounding_parcel.Parcel.html\">Parcel</a>","id":"module:meteoJS/sounding/parcel.Parcel","children":[]}]}]},{"label":"<a href=\"module-meteoJS_synview.html\">synview</a>","id":"module:meteoJS/synview","children":[{"label":"<a href=\"module-meteoJS_synview_collection.html\">collection</a>","id":"module:meteoJS/synview/collection","children":[{"label":"<a href=\"module-meteoJS_synview_collection.Collection.html\">Collection</a>","id":"module:meteoJS/synview/collection.Collection","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_map.html\">map</a>","id":"module:meteoJS/synview/map","children":[{"label":"<a href=\"module-meteoJS_synview_map.SynviewMap.html\">SynviewMap</a>","id":"module:meteoJS/synview/map.SynviewMap","children":[]},{"label":"<a href=\"module-meteoJS_synview_map_ll.html\">ll</a>","id":"module:meteoJS/synview/map/ll","children":[{"label":"<a href=\"module-meteoJS_synview_map_ll.MapLL.html\">MapLL</a>","id":"module:meteoJS/synview/map/ll.MapLL","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_map_ol.html\">ol</a>","id":"module:meteoJS/synview/map/ol","children":[{"label":"<a href=\"module-meteoJS_synview_map_ol.MapOL.html\">MapOL</a>","id":"module:meteoJS/synview/map/ol.MapOL","children":[]}]}]},{"label":"<a href=\"module-meteoJS_synview_resource.html\">resource</a>","id":"module:meteoJS/synview/resource","children":[{"label":"<a href=\"module-meteoJS_synview_resource.Resource.html\">Resource</a>","id":"module:meteoJS/synview/resource.Resource","children":[]},{"label":"<a href=\"module-meteoJS_synview_resource_GeoJSON.html\">GeoJSON</a>","id":"module:meteoJS/synview/resource/GeoJSON","children":[{"label":"<a href=\"module-meteoJS_synview_resource_GeoJSON.GeoJSON.html\">GeoJSON</a>","id":"module:meteoJS/synview/resource/GeoJSON.GeoJSON","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_resource_GeoJSONTile.html\">GeoJSONTile</a>","id":"module:meteoJS/synview/resource/GeoJSONTile","children":[{"label":"<a href=\"module-meteoJS_synview_resource_GeoJSONTile.GeoJSONTile.html\">GeoJSONTile</a>","id":"module:meteoJS/synview/resource/GeoJSONTile.GeoJSONTile","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_resource_Image.html\">Image</a>","id":"module:meteoJS/synview/resource/Image","children":[{"label":"<a href=\"module-meteoJS_synview_resource_Image.ImageStatic.html\">ImageStatic</a>","id":"module:meteoJS/synview/resource/Image.ImageStatic","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_resource_OSM.html\">OSM</a>","id":"module:meteoJS/synview/resource/OSM","children":[{"label":"<a href=\"module-meteoJS_synview_resource_OSM.OSM.html\">OSM</a>","id":"module:meteoJS/synview/resource/OSM.OSM","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_resource_Vector.html\">Vector</a>","id":"module:meteoJS/synview/resource/Vector","children":[{"label":"<a href=\"module-meteoJS_synview_resource_Vector.Vector.html\">Vector</a>","id":"module:meteoJS/synview/resource/Vector.Vector","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_resource_VectorTile.html\">VectorTile</a>","id":"module:meteoJS/synview/resource/VectorTile","children":[{"label":"<a href=\"module-meteoJS_synview_resource_VectorTile.VectorTile.html\">VectorTile</a>","id":"module:meteoJS/synview/resource/VectorTile.VectorTile","children":[]}]}]},{"label":"<a href=\"module-meteoJS_synview_resourceCollection.html\">resourceCollection</a>","id":"module:meteoJS/synview/resourceCollection","children":[{"label":"<a href=\"module-meteoJS_synview_resourceCollection.ResourceCollection.html\">ResourceCollection</a>","id":"module:meteoJS/synview/resourceCollection.ResourceCollection","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_tooltip.html\">tooltip</a>","id":"module:meteoJS/synview/tooltip","children":[{"label":"<a href=\"module-meteoJS_synview_tooltip.Tooltip.html\">Tooltip</a>","id":"module:meteoJS/synview/tooltip.Tooltip","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_type.html\">type</a>","id":"module:meteoJS/synview/type","children":[{"label":"<a href=\"module-meteoJS_synview_type.Type.html\">Type</a>","id":"module:meteoJS/synview/type.Type","children":[]}]},{"label":"<a href=\"module-meteoJS_synview_typeCollection.html\">typeCollection</a>","id":"module:meteoJS/synview/typeCollection","children":[{"label":"<a href=\"module-meteoJS_synview_typeCollection.TypeCollection.html\">TypeCollection</a>","id":"module:meteoJS/synview/typeCollection.TypeCollection","children":[]}]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram.html\">thermodynamicDiagram</a>","id":"module:meteoJS/thermodynamicDiagram","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram.ThermodynamicDiagram.html\">ThermodynamicDiagram</a>","id":"module:meteoJS/thermodynamicDiagram.ThermodynamicDiagram","children":[]},{"label":"axes","id":"module:meteoJS/thermodynamicDiagram/axes","children":[{"label":"axes","id":"module:meteoJS/thermodynamicDiagram/axes/axes","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_axes_axes_axisLabels.html\">axisLabels</a>","id":"module:meteoJS/thermodynamicDiagram/axes/axes/axisLabels","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_axes_xAxis.html\">xAxis</a>","id":"module:meteoJS/thermodynamicDiagram/axes/xAxis","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_axes_xAxis.xAxis.html\">xAxis</a>","id":"module:meteoJS/thermodynamicDiagram/axes/xAxis.xAxis","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_axes_yAxis.html\">yAxis</a>","id":"module:meteoJS/thermodynamicDiagram/axes/yAxis","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_axes_yAxis.yAxis.html\">yAxis</a>","id":"module:meteoJS/thermodynamicDiagram/axes/yAxis.yAxis","children":[]}]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem.html\">coordinateSystem</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem.CoordinateSystem.html\">CoordinateSystem</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem","children":[]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_emagram.html\">emagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/emagram","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_emagram.Emagram.html\">Emagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/emagram.Emagram","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_skewTlogPDiagram.html\">skewTlogPDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_skewTlogPDiagram.SkewTlogPDiagram.html\">SkewTlogPDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram.SkewTlogPDiagram","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_stueveDiagram.html\">stueveDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_coordinateSystem_stueveDiagram.StueveDiagram.html\">StueveDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram.StueveDiagram","children":[]}]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_diagramSounding.html\">diagramSounding</a>","id":"module:meteoJS/thermodynamicDiagram/diagramSounding","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_diagramSounding.DiagramSounding.html\">DiagramSounding</a>","id":"module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_functions.html\">functions</a>","id":"module:meteoJS/thermodynamicDiagram/functions","children":[]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_hodograph.html\">hodograph</a>","id":"module:meteoJS/thermodynamicDiagram/hodograph","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_hodograph.Hodograph.html\">Hodograph</a>","id":"module:meteoJS/thermodynamicDiagram/hodograph.Hodograph","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotAltitudeDataArea.html\">plotAltitudeDataArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotAltitudeDataArea.PlotAltitudeDataArea.html\">PlotAltitudeDataArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotArea.html\">plotArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotArea","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotArea.PlotArea.html\">PlotArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotArea.PlotArea","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotDataArea.html\">plotDataArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotDataArea","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_plotDataArea.PlotDataArea.html\">PlotDataArea</a>","id":"module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_tdDiagram.html\">tdDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/tdDiagram","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_tdDiagram.TDDiagram.html\">TDDiagram</a>","id":"module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_windbarbsProfile.html\">windbarbsProfile</a>","id":"module:meteoJS/thermodynamicDiagram/windbarbsProfile","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_windbarbsProfile.WindbarbsProfile.html\">WindbarbsProfile</a>","id":"module:meteoJS/thermodynamicDiagram/windbarbsProfile.WindbarbsProfile","children":[]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_windspeedProfile.html\">windspeedProfile</a>","id":"module:meteoJS/thermodynamicDiagram/windspeedProfile","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagram_windspeedProfile.WindspeedProfile.html\">WindspeedProfile</a>","id":"module:meteoJS/thermodynamicDiagram/windspeedProfile.WindspeedProfile","children":[]}]}]},{"label":"<a href=\"module-meteoJS_thermodynamicDiagramPluggable.html\">thermodynamicDiagramPluggable</a>","id":"module:meteoJS/thermodynamicDiagramPluggable","children":[{"label":"<a href=\"module-meteoJS_thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable.html\">ThermodynamicDiagramPluggable</a>","id":"module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable","children":[]}]},{"label":"<a href=\"module-meteoJS_timeline.html\">timeline</a>","id":"module:meteoJS/timeline","children":[{"label":"<a href=\"module-meteoJS_timeline.Timeline.html\">Timeline</a>","id":"module:meteoJS/timeline.Timeline","children":[]},{"label":"<a href=\"module-meteoJS_timeline_animation.html\">animation</a>","id":"module:meteoJS/timeline/animation","children":[{"label":"<a href=\"module-meteoJS_timeline_animation.Animation.html\">Animation</a>","id":"module:meteoJS/timeline/animation.Animation","children":[]},{"label":"<a href=\"module-meteoJS_timeline_animation_togglebutton.html\">togglebutton</a>","id":"module:meteoJS/timeline/animation/togglebutton","children":[{"label":"<a href=\"module-meteoJS_timeline_animation_togglebutton.ToggleButton.html\">ToggleButton</a>","id":"module:meteoJS/timeline/animation/togglebutton.ToggleButton","children":[]}]}]},{"label":"<a href=\"module-meteoJS_timeline_navigationButtons.html\">navigationButtons</a>","id":"module:meteoJS/timeline/navigationButtons","children":[{"label":"<a href=\"module-meteoJS_timeline_navigationButtons.NavigationButtons.html\">NavigationButtons</a>","id":"module:meteoJS/timeline/navigationButtons.NavigationButtons","children":[]}]},{"label":"<a href=\"module-meteoJS_timeline_visualisation.html\">visualisation</a>","id":"module:meteoJS/timeline/visualisation","children":[{"label":"<a href=\"module-meteoJS_timeline_visualisation.Visualisation.html\">Visualisation</a>","id":"module:meteoJS/timeline/visualisation.Visualisation","children":[]},{"label":"<a href=\"module-meteoJS_timeline_visualisation_bsButtons.html\">bsButtons</a>","id":"module:meteoJS/timeline/visualisation/bsButtons","children":[{"label":"<a href=\"module-meteoJS_timeline_visualisation_bsButtons.bsButtons.html\">bsButtons</a>","id":"module:meteoJS/timeline/visualisation/bsButtons.bsButtons","children":[]}]},{"label":"<a href=\"module-meteoJS_timeline_visualisation_bsDropdown.html\">bsDropdown</a>","id":"module:meteoJS/timeline/visualisation/bsDropdown","children":[{"label":"<a href=\"module-meteoJS_timeline_visualisation_bsDropdown.bsDropdown.html\">bsDropdown</a>","id":"module:meteoJS/timeline/visualisation/bsDropdown.bsDropdown","children":[]}]},{"label":"<a href=\"module-meteoJS_timeline_visualisation_slider.html\">slider</a>","id":"module:meteoJS/timeline/visualisation/slider","children":[{"label":"<a href=\"module-meteoJS_timeline_visualisation_slider.Slider.html\">Slider</a>","id":"module:meteoJS/timeline/visualisation/slider.Slider","children":[]}]},{"label":"<a href=\"module-meteoJS_timeline_visualisation_text.html\">text</a>","id":"module:meteoJS/timeline/visualisation/text","children":[{"label":"<a href=\"module-meteoJS_timeline_visualisation_text.Text.html\">Text</a>","id":"module:meteoJS/timeline/visualisation/text.Text","children":[]}]}]}]},{"label":"<a href=\"module-meteoJS_tooltip.html\">tooltip</a>","id":"module:meteoJS/tooltip","children":[{"label":"<a href=\"module-meteoJS_tooltip.Tooltip.html\">Tooltip</a>","id":"module:meteoJS/tooltip.Tooltip","children":[]},{"label":"<a href=\"module-meteoJS_tooltip_bootstrapTooltip.html\">bootstrapTooltip</a>","id":"module:meteoJS/tooltip/bootstrapTooltip","children":[{"label":"<a href=\"module-meteoJS_tooltip_bootstrapTooltip.BootstrapTooltip.html\">BootstrapTooltip</a>","id":"module:meteoJS/tooltip/bootstrapTooltip.BootstrapTooltip","children":[]}]}]}]}],
        openedIcon: ' &#x21e3;',
        saveState: false,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
