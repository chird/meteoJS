# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.14.7] - 2021-07-02

### Fixed
- Bugfix in
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html)
  if an empty variable is passed to displayVariables.

## [1.14.6] - 2021-06-11

### Fixed
- Modelviewer: Concretise the behaviour of a
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html)
  with disabled adaptSuitableResource option.

## [1.14.5] - 2021-05-28

### Fixed
- Crashed test suite.

## [1.14.4] - 2021-05-14

### Fixed
- Bugfix on removing a sounding parcel.

## [1.14.3] - 2021-05-04

### Changed
- Fixed examples due to broken integetry tags.
- Updated docs for the timeline classes.
- Added github actions for Node 12.x, 14.x and 15.x
- Updated to bootstrap@v5 in
  [BootstrapTooltip](https://chird.github.io/meteoJS/doc/module-meteoJS_tooltip_bootstrapTooltip.BootstrapTooltip.html),
  [ToggleButton](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_animation_togglebutton.ToggleButton.html),
  [animation insert-functions](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_animation.html),
  [bsDropdown](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_bsDropdown.bsDropdown.html) and
  [bsButtons](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_bsButtons.bsButtons.html)
- Use of bootstrap icons in
  [ToggleButton](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_animation_togglebutton.ToggleButton.html)
  for better default appearance.
- Improved performance in
  [Resources.html#getAvailableVariables](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resources.Resources.html#getAvailableVariables)

## [1.14.2] - 2021-03-26

### Changed
- Improved performance for the method `getAvailableVariables` in
  [Resources](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resources.Resources.html).

## [1.14.1] - 2021-03-23

### Changed
- Bugfix in
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html).

## [1.14.0] - 2021-03-22
### Added
- Method `getAvailableVariables` in
  [Display](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_display.Display.html).

### Removed
- Events `change:selectedVariable` and `change:availableVariables` in
  [Display](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_display.Display.html).

### Changed
- Internal optimizations in
  [Resources](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resources.Resources.html).

## [1.13.0] - 2021-03-19
### Added
- Internal class
  [ResourcesTreeNode](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resourcesTreeNode.ResourcesTreeNode.html).
- Method `getSelectedVariable` in
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html).

### Changed
- Internal data structure in [Node](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_node.Node.html).
- Internal data structure in [Resource](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resource.Resource.html).
- Updated several packages.

## [1.12.0] - 2021-03-01
### Added
- Method `getMirrorsFrom` in
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html).
- Time format is now dynamic in
  [bsButtons](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_bsButtons.html#~options).

### Changed
- The `change:selectedVariables` event in
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html).
  is now fired debounced.
- `mirrorsFrom` can now be called for different other containers on
  [Container](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_container.Container.html).
- Added internal cache for performance reasons in
  [Node](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_node.Node.html).

### Fixed
- Bugfix for the `pauseOnHiddenDocument` feature in
  [RepetitiveRequests](https://chird.github.io/meteoJS/doc/module-meteoJS_repetitiveRequests.RepetitiveRequests.html).
- Fix to prevent some unwanted side effects with the keyboard navigation in
  [Timeline](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline.Timeline.html).

## [1.11.4] - 2020-11-19
### Added
- Additional keyboard navigation options in
  [Timeline](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline.html#~optionKeyboardNavigation).
### Fixed
- False button definition in [Timeline](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline.html#~optionKeyboardNavigation).
- Bugfix in [TDDiagram](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_tdDiagram.TDDiagram.html),
  a parcel was additionally drawn instead of replaced, when its display options changed.

## [1.11.3] - 2020-11-19
### Fixed
- Simpler API definition of [Resources#getTimesByVariables](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resources.Resources.html#getTimesByVariables).

## [1.11.2] - 2020-11-18
### Fixed
- Fix in [Collection](https://chird.github.io/meteoJS/doc/module-meteoJS_base_collection.Collection.html).

## [1.11.1] - 2020-11-13
### Fixed
- Doc fixes in sereval base classes.
- Fixes in [Display](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_display.Display.html),
  [Modelviewer](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer.Modelviewer.html)
  and [Resources](https://chird.github.io/meteoJS/doc/module-meteoJS_modelviewer_resources.Resources.html).

## [1.11.0] - 2020-11-02
### Added
- New event `before:request` in
  [RepetitiveRequests](https://chird.github.io/meteoJS/doc/module-meteoJS_repetitiveRequests.RepetitiveRequests.html).

## [1.10.1] - 2020-10-26
### Fixed
- Several bugs in [RepetitiveRequests](https://chird.github.io/meteoJS/doc/module-meteoJS_repetitiveRequests.RepetitiveRequests.html).
  Caution: If you set `responseType` to 'json', you can't read the
  `responseText`-Property anymore.

## [1.10.0] - 2020-10-01
### Added
- Thermodynamic diagram: Better and faster styling for parcels. Therefore a new
  class [DiagramParcel](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_diagramParcel.DiagramParcel.html)
  is introduced.
- Thermodynamic diagram: Two new options are added: `filterDataPoint` and
  `minDataPointsDistance`. Both apply to the plotted details of the data.

### Changed
- With some hackish conditions, the hover labels in the windspeed profile stay
  inside the container.

### Fixed
- The hover labels are cleared, when soundings are added. If an invisible
  sounding is added, this doesn't happen anymore.

## [1.9.0] - 2020-09-16
### Added
- Modelviewer classes. Used to build an application to view different resources.
  These resources belong to certain variables (like model run, displayed region,
  etc.). Currently not every feature is implemented.

## [1.8.1] - 2020-08-10
### Added
- Github workflows.

### Changed
- Update to OpenLayers 6.4.3.
- Use imageSmoothing option of openlayers in the synview's Resource class.
- Packages updated.

## [1.8.0] - 2020-08-10
### Added
- [preload](https://chird.github.io/meteoJS/doc/module-meteoJS_synview_resource.Resource.html#preload) to the synview's Resource class.
- Preload options to the synview's Type class.

## [1.7.0] - 2020-07-07
### Added
- [makeTimeTextCallbackFunction](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation.html#.makeTimeTextCallbackFunction) to the bundle file.
- Library info to the bundle file.
- Example with a thetae diagram.
- New function to draw windbarbs: [drawWindbarbInto](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_functions.html#.drawWindbarbInto).
- prebuild:background/postbuild:background events to [PlotArea](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_plotArea.PlotArea.html).
- preinsert:sounding/postinsert:sounding events to [PlotDataArea](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_plotDataArea.PlotDataArea.html).
- Option windspeedMax to [WindspeedProfile](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_windspeedProfile.WindspeedProfile.html).

### Changed
- Updated SVG.js library in the examples.
- Incorrect orientation for the
[xAxis](https://chird.github.io/meteoJS/doc/module-meteoJS_thermodynamicDiagram_axes_xAxis.xAxis.html)
title.
- Added "snowfall limit" line to example with the ϴe diagram (with "postbuild:background" event).

### Fixed
- Time format in examples.
- Don't include SVG.js in bundle file.
- Visibility according to the options of the guide lines in the thermodynamic diagram.
- Thermodynamic diagram tests example.

## [1.6.0] - 2020-06-08
### Added
- CHANGELOG.md added.
- New argument `getTimeText` to 
[Visualisation](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation.Visualisation.html)
and its child classes.
- Thermodynamic examples: raw SVG and parcel lift by click.
- Tags for releases.

### Changed
- Get rid of included [Moment.js](https://momentjs.com/) in the bundle file.
- [Timeline](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline.Timeline.html)
doesn't import [Moment.js](https://momentjs.com/) anymore.
- [Visualisation](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation.Visualisation.html)
doesn't import [Moment.js](https://momentjs.com/) anymore. Due to this
[bsButtons](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_bsButtons.bsButtons.html),
[bsDropdown](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_bsDropdown.bsDropdown.html),
[Slider](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_slider.Slider.html) and
[Text](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation_text.Text.html)
have a new constructor argument `getTimeText` (see above). But all format-arguments
will not work anymore, until you pass a callback to `getTimeText`.
- Index page for the examples.

### Removed
- Section about "changelog" vs "CHANGELOG".

### Fixed
- Some tests with DOM usage.

[Unreleased]: https://github.com/chird/meteoJS/compare/v1.14.7...HEAD
[1.14.7]: https://github.com/chird/meteoJS/compare/v1.14.6...v1.14.7
[1.14.6]: https://github.com/chird/meteoJS/compare/v1.14.5...v1.14.6
[1.14.5]: https://github.com/chird/meteoJS/compare/v1.14.4...v1.14.5
[1.14.4]: https://github.com/chird/meteoJS/compare/v1.14.3...v1.14.4
[1.14.3]: https://github.com/chird/meteoJS/compare/v1.14.2...v1.14.3
[1.14.2]: https://github.com/chird/meteoJS/compare/v1.14.1...v1.14.2
[1.14.1]: https://github.com/chird/meteoJS/compare/v1.14.0...v1.14.1
[1.14.0]: https://github.com/chird/meteoJS/compare/v1.13.0...v1.14.0
[1.13.0]: https://github.com/chird/meteoJS/compare/v1.12.0...v1.13.0
[1.12.0]: https://github.com/chird/meteoJS/compare/v1.11.4...v1.12.0
[1.11.4]: https://github.com/chird/meteoJS/compare/v1.11.3...v1.11.4
[1.11.3]: https://github.com/chird/meteoJS/compare/v1.11.2...v1.11.3
[1.11.2]: https://github.com/chird/meteoJS/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/chird/meteoJS/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/chird/meteoJS/compare/v1.10.1...v1.11.0
[1.10.1]: https://github.com/chird/meteoJS/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/chird/meteoJS/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/chird/meteoJS/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/chird/meteoJS/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/chird/meteoJS/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/chird/meteoJS/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/chird/meteoJS/compare/7ac7aa2785f7af9c5ca266472a52b1f71cea394c...v1.6.0