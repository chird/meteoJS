# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- [makeTimeTextCallbackFunction](https://chird.github.io/meteoJS/doc/module-meteoJS_timeline_visualisation.html#.makeTimeTextCallbackFunction) to the bundle file.

### Fixed
- Time format in examples.

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

[Unreleased]: https://github.com/chird/meteoJS/compare/v1.6.0...HEAD
[1.6.0]: https://github.com/chird/meteoJS/compare/7ac7aa2785f7af9c5ca266472a52b1f71cea394c...v1.6.0