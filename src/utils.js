import EXIF from 'exif-js';
import moment from 'moment';

// Degree-Minute-Second to Decimal Degrees
const convertDMStoDD = (degrees, minutes, seconds, direction) => {
  return (['N', 'E'].includes(direction) ? 1 : -1 ) *
    degrees + (1 / 60) * minutes + (1 / 3600) * seconds;
};

const convertTiffDateTimeFormat = (tiffDateTime) => {
  const datetime = moment(tiffDateTime, 'YYYY:MM:DD HH:mm:ss');
  if (datetime.isValid()) {
    return datetime;
  } else {
    return null;
  }
};

// Run in callback of EXIF.getData()
const getAxisInfo = (image, axisName) => {
  if (!['Longitude', 'Latitude'].includes(axisName)) {
    console.error(`Wrong axis name: ${axisName}`);
    return 0;
  }
  const axisValue = EXIF.getTag(image, `GPS${axisName}`);
  const axisDirection = EXIF.getTag(image, `GPS${axisName}Ref`);
  return (axisValue && axisDirection) ?
  convertDMStoDD(...axisValue.map((number) => Number(number)), axisDirection)
  : 0;
};

// Run in callback of EXIF.getData()
const getLatitude = (image) => {
  return getAxisInfo(image, 'Latitude');
};

// Run in callback of EXIF.getData()
const getLongitude = (image) => {
  return getAxisInfo(image, 'Longitude');
};

const getImageInfo = (image) => {
  return new Promise((resolve, reject) => {
    if (image.type !== 'image/jpeg') {
      reject();
    }
    EXIF.getData(image, () => {
      const tiffDateTime = EXIF.getTag(image, 'DateTimeOriginal');
      const datetime = tiffDateTime ? convertTiffDateTimeFormat(tiffDateTime) : null;
      const latitude = getLatitude(image);
      const longitude = getLongitude(image);
      resolve({
        datetime,
        latitude,
        longitude
      });
    });
  });
};

const requestApi = async (url, method, headers, body) => {
  const response = await fetch(`/api/${url}`, {
    method,
    headers,
    body
  });
  console.log(response);
  const responseBody = await response.json();

  if (response.status !== 200) {
    throw Error(responseBody.message);
  }
  console.log(responseBody);
  return responseBody;
};

const getApi = (url) => {
  return requestApi(url, 'get');
};

const postApi = (url, headers, body) => {
  return requestApi(url, 'post', headers, body);
};

const putApi = (url, headers, body) => {
  return requestApi(url, 'put', headers, body);
};

const deleteApi = (url, headers, body) => {
  return requestApi(url, 'delete', headers, body);
};

const editElement = (array, element, newEntry) => {
  return array.map((el) => ((el.id === element.id) ? Object.assign({}, el, newEntry) : el));
};

const getLocation = (object) => {
  return [object.longitude, object.latitude];
};

export {
  convertDMStoDD,
  getImageInfo,
  editElement,
  getApi,
  postApi,
  putApi,
  deleteApi,
  getLocation,
};
