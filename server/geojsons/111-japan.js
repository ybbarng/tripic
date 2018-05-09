const { get } = require('axios');
const fs = require('fs');
const wkx = require('wkx');
const { zeroFill } = require('./utils');

const countryId = '111';

const loadTopoJson = (url) => {
  return get(url)
    .then((response) => {
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    });
};

// 일본 전체의 정보. 도도부현이 기록되어 있다.
const loadCountryTopoJson = () => {
  return loadTopoJson('https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson');
};

const editPrefectureProperty = (property) => {
  /*
  {"nam":"Kyoto Fu","nam_ja":"京都府","id":26}
  */
  return {
    'name': property.nam,
    'native_language_name': property.nam_ja,
    'id': countryId + zeroFill(property.id, 2)
  }
};

const editTopoJson = (data) => {
  const objectsKey = Object.keys(data.objects)[0];
  const geometries = data.objects[objectsKey].geometries;
  for (var i = 0; i < geometries.length; i++) {
    geometries[i].properties = editPrefectureProperty(geometries[i].properties);
  }
  data.objects[objectsKey].geometries = geometries;
  return data;
};

loadCountryTopoJson().then((data) => {
  return editTopoJson(data);
}).then((data) => {
  return fs.writeFile(`outputs/${countryId}.json`, JSON.stringify(data), (error) => {
    if (error) {
      throw error;
    }
  });
}).catch((e) => {
  console.error(e);
});

// 도도부현의 정보. 시정촌이 기록되어 있다.
const loadPrefectureTopoJson = (prefectureId) => {
  return loadTopoJson(`https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/topojson/prefectures/${prefectureId}.topojson`);
};

const getMunicipalityProperty = (geometry) => {
  /*
   * {"type":"Polygon","id":"01101","arcs":[[0,1,2,3,4,5,6,7,8,9,10,11,12,13]]}
  */
  return {
    'name': geometry.id,
    'native_language_name': geometry.id,
    'id': countryId + geometry.id
  }
};

const editMunicipalityTopoJson = (data) => {
  const objectsKey = Object.keys(data.objects)[0];
  const geometries = data.objects[objectsKey].geometries;
  const multiPolygons = {}
  for (var i = 0; i < geometries.length; i++) {
    const geometryId = geometries[i].id;
    if (!(geometryId in multiPolygons)) {
      const newGeometry = {
        'type': 'MultiPolygon',
        'properties': getMunicipalityProperty(geometries[i]),
        'arcs': []
      }
      multiPolygons[geometryId] = newGeometry;
    }
    multiPolygons[geometryId].arcs.push(geometries[i].arcs);
  }
  const newGeometries = [];
  const keys = Object.keys(multiPolygons);
  keys.sort();
  for (const key of keys) {
    newGeometries.push(multiPolygons[key]);
  }
  data.objects[objectsKey].geometries = newGeometries;
  return data;
};

Array.from(Array(47).keys()).map((i) => {
  const prefectureId = zeroFill(i + 1, 2);
  loadPrefectureTopoJson(prefectureId).then((data) => {
    console.log(`outputs/${countryId}${prefectureId}.json`);
    return editMunicipalityTopoJson(data, (geometry) => (getMunicipalityProperty(geometry)));
  }).then((data) => {
    return fs.writeFile(`outputs/${countryId}${prefectureId}.json`, JSON.stringify(data), (error) => {
      if (error) {
        throw error;
      }
    });
  }).catch((e) => {
    console.error(e);
  });
});
