# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Fixed
- Doc fixes in [Collection](https://chird.github.io/meteoJS/doc/module-meteoJS_base_collection.Collection.html).

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

[Unreleased]: https://github.com/chird/meteoJS/compare/v1.11.0...HEAD
[1.11.0]: https://github.com/chird/meteoJS/compare/v1.10.1...v1.11.0
[1.10.1]: https://github.com/chird/meteoJS/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/chird/meteoJS/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/chird/meteoJS/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/chird/meteoJS/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/chird/meteoJS/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/chird/meteoJS/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/chird/meteoJS/compare/7ac7aa2785f7af9c5ca266472a52b1f71cea394c...v1.6.0