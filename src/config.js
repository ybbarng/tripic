require('dotenv').config();

const Config = {
  mapboxAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  cloudUrlHeader: process.env.REACT_APP_CLOUD_URL_HEADER
}
export default Config;
