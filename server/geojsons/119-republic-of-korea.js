const { get } = require('axios');
const fs = require('fs');
const wkx = require('wkx');
const { zeroFill } = require('./utils');

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

const editPrefectureProperty = (property) => {
  /*
   * {"code":"39","name":"제주특별자치도","name_eng":"Jeju-do","base_year":"2013"}
  */
  return {
    'name': property.name_eng,
    'native_language_name': property.name,
    'id': countryId + zeroFill(property.code, 2)
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

