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

const parseDateTimeFromFileName = (name) => {
  const iphoneFileNameFormat = 'YYYYMMDD_HHmmss.jpg';
  const androidFileNameFormat = 'YYYY-MM-DD HH.mm.ss.jpg';
  const datetime = (() => {
    if (name.startsWith('IMG_')) {
      // Bug: moment can't parsing G_YYYYMMDD
      return moment(name.substring(4), iphoneFileNameFormat);
    } else {
      return moment(name, androidFileNameFormat);
    }
  })();
  if (datetime.isValid()) {
    return datetime;
  }
  return null;
}

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
      const datetime = (() => {
        if (tiffDateTime) {
          return convertTiffDateTimeFormat(tiffDateTime);
        } else if (image.name) {
          return parseDateTimeFromFileName(image.name);
        }
        return null;
      })();
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

const editObject = (element, newElement) => {
  return Object.assign({}, element, newElement);
};

const editElement = (array, element, newEntry) => {
  return array.map((el) => ((el.id === element.id) ? editObject(el, newEntry) : el));
};

export {
  convertDMStoDD,
  getImageInfo,
  editObject,
  editElement,
};
