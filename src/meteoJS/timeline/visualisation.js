/**
 * @module meteoJS/timeline/visualisation
 */

/**
 * Object to visualise {@link meteoJS/timeline}.
 * 
 * @class
 * @abstract
 * @param {meteoJS.timeline} timeline Timeline object to visualise.
 * @param {object} options Options.
 * @listens meteoJS.timeline#change:time
 * @listens meteoJS.timeline#change:times
 * @listens meteoJS.timeline#change:enabledTimes
 */
meteoJS.timeline.visualisation = {};