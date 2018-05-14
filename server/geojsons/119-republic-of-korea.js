const { get } = require('axios');
const fs = require('fs');
const wkx = require('wkx');
const { feature } = require('topojson-client');
const { topology } = require('topojson-server');
const { groupBy } = require('./utils');

const countryId = '119';

const loadTopoJson = (url) => {
  return get(url)
    .then((response) => {
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    });
};

// 한국 전체의 정보. 시/도가 기록되어 있다.
const loadCountryTopoJson = () => {
  return loadTopoJson('https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_topo_simple.json');
};

const editProperty = (property) => {
  /*
   * {"code":"39","name":"제주특별자치도","name_eng":"Jeju-do","base_year":"2013"}
   * {"code":"39020","name":"서귀포시","name_eng":"Seogwipo-si","base_year":"2013"}
  */
  return {
    'name': property.name_eng,
    'native_language_name': property.name,
    'id': countryId + property.code
  }
};

const editTopoJson = (data) => {
  const objectsKey = Object.keys(data.objects)[0];
  const geometries = data.objects[objectsKey].geometries;
  for (var i = 0; i < geometries.length; i++) {
    geometries[i].properties = editProperty(geometries[i].properties);
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


// 모든 광역시/도 정보. 각 지역 별로 잘라서 저장
const loadMunicipalitiesTopoJson = () => {
  return loadTopoJson('https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_municipalities_topo.json');
};

const splitMunicipalitiesTopoJson = (data) => {
  const geographyPaths = feature(
    data,
    data.objects[Object.keys(data.objects)[0]]
  ).features;
  const municipalities = groupBy(geographyPaths, (geography) => {
    return geography.properties.id.substr(0, 5);
  });
  return municipalities;
};

loadMunicipalitiesTopoJson().then((data) => {
  return editTopoJson(data);
}).then((data) => {
  const municipalities = splitMunicipalitiesTopoJson(data);
  return Promise.all(Array.from(municipalities.keys()).sort().map((municipalityId) => {
    console.log(municipalityId);
    const data = topology(municipalities.get(municipalityId));
    const topoJson = {
      'type': 'Topology',
      //'transform': {'scale':[0.00029019291197877233,0.0002505167879320917],'translate':[124.61330721874788,33.10915891208669]},
      'objects': {
        'skorea_municipalities_geo': {
          'type': 'GeometryCollection',
          'geometries': Object.keys(data.objects).map((key) => {
            return data.objects[key];
          })
        }
      },
      'arcs': data.arcs
    };
    return fs.writeFile(`outputs/${municipalityId}.json`, JSON.stringify(topoJson), (error) => {
      if (error) {
        throw error;
      }
    });
  }));
}).catch((e) => {
  console.error(e);
});

