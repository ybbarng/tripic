const { get } = require('axios');
const fs = require('fs');
const wkx = require('wkx');
const { zeroFill } = require('./utils');

const loadTopoJson = () => {
  return get('https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m.json')
    .then((response) => {
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    });
};

const editProperty = (property, i) => {
  /*
  { NAME: 'Zimbabwe',
    NAME_LONG: 'Zimbabwe',
    ABBREV: 'Zimb.',
    FORMAL_EN: 'Republic of Zimbabwe',
    POP_EST: 13805084,
    POP_RANK: 14,
    GDP_MD_EST: 28330,
    POP_YEAR: 2017,
    GDP_YEAR: 2016,
    ISO_A2: 'ZW',
    ISO_A3: 'ZWE',
    CONTINENT: 'Africa',
    REGION_UN: 'Africa',
    SUBREGION: 'Eastern Africa' }
  */
  return {
    'name': property.FORMAL_EN || property.NAME_LONG,
    'id': zeroFill(i, 3)
  }
};

const editTopoJson = (data) => {
  const objectsKey = Object.keys(data.objects)[0];
  const geometries = data.objects[objectsKey].geometries;
  for (var i = 0; i < geometries.length; i++) {
    geometries[i].properties = editProperty(geometries[i].properties, i + 1);
  }
  data.objects[objectsKey].geometries = geometries;
  return data;
};

loadTopoJson()
  .then((data) => {
    return editTopoJson(data);
  })
  .then((data) => {
    return fs.writeFile('000.json', JSON.stringify(data), (error) => {
      if (error) {
        throw error;
      }
    });
  })
  .catch((e) => {
    console.error(e);
  });


/*
for (var i = 0; i < geojson.features.length; i++) {
  country = geojson.features[i];
  console.log(country.properties.name);
  const geometry = wkx.Geometry.parseGeoJSON(country.geometry);
  const wktString = geometry.toWkt();
  console.log(wktString);
}
*/
