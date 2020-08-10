# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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

[Unreleased]: https://github.com/chird/meteoJS/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/chird/meteoJS/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/chird/meteoJS/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/chird/meteoJS/compare/7ac7aa2785f7af9c5ca266472a52b1f71cea394c...v1.6.0