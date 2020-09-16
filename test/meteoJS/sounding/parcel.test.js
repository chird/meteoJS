import assert from 'assert';
import {
  default as Parcel,
  Parcel as ParcelClass
} from '../../../src/meteoJS/sounding/Parcel.js';

const properties = [
  'id', 'pres', 'tmpc', 'dwpc', 'ptrace', 'ttrace', 'blayer',
  'tlayer', 'lclpres', 'lclhght', 'lfcpres', 'lfchght', 'elpres', 'elhght',
  'mplpres', 'mplhght', 'bplus', 'bminus', 'bfzl', 'b3km', 'b6km', 'p0c',
  'pm10c', 'pm20c', 'pm30c', 'hght0c', 'hghtm10c', 'hghtm20c', 'hghtm30c',
  'wm10c', 'wm20c', 'wm30c', 'li5', 'li3', 'brnshear', 'brnu', 'brnv', 'limax',
  'limaxpres', 'cap', 'cappres', 'bmin', 'bminpres'
];

describe('Parcel, import via default', () => {
  it('empty constructor', () => {
    let parcel = new Parcel();
    properties.forEach(property => {
      assert.ok(property in parcel, property);
      assert.equal(parcel[property], undefined, property);
    });
  });
  it('properties', () => {
    let options = {};
    properties.forEach(property =>
      options[property] = Math.floor(Math.random() * Math.floor(1000)));
    let parcel = new Parcel(options);
    properties.forEach(property =>
      assert.equal(parcel[property], options[property], property));
  });
});
describe('Parcel, import via name', () => {
  it('empty constructor', () => {
    let parcel = new ParcelClass();
    properties.forEach(property =>
      assert.equal(parcel[property], undefined, property));
  });
});