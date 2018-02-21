import EXIF from 'exif-js';

// Degree-Minute-Second to Decimal Degrees
const convertDMStoDD = (degrees, minutes, seconds, direction) => {
  return (['N', 'E'].includes(direction) ? 1 : -1 ) *
    degrees + (1 / 60) * minutes + (1 / 3600) * seconds;
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
}

// Run in callback of EXIF.getData()
const getLongitude = (image) => {
  return getAxisInfo(image, 'Longitude');
}

const getImageInfo = (image) => {
  return new Promise((resolve, reject) => {
    if (image.type !== 'image/jpeg') {
      reject();
    }
    EXIF.getData(image, () => {
      const datetime = EXIF.getTag(image, 'DateTimeOriginal');
      const latitude = getLatitude(image);
      const longitude = getLongitude(image);
      resolve({
        datetime,
        latitude,
        longitude
      });
    });
  });
}

export {
  convertDMStoDD,
  getImageInfo
};
