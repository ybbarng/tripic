const fs = require('fs');

const wkx = require('wkx');

const database = new require('./database')();
const geojson = require('./world/countries.geo.json');

for (var i = 0; i < geojson.features.length; i++) {
  country = geojson.features[i];
  console.log(country.properties.name);
  const geometry = wkx.Geometry.parseGeoJSON(country.geometry);
  const wktString = geometry.toWkt();
  console.log(wktString);
}
