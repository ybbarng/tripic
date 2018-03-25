import moment from 'moment';
import 'moment/locale/ko';
import Config from '../config';
import {getImageInfo} from '../utils'

moment.locale('ko');


class Pic {
  constructor() {
    this.latitude = 0;
    this.longitude = 0;
  }

  static convertImageToPic(images, tripId) {
    return images.map((image, i) => {
      const pic = new Pic();
      return getImageInfo(image).then((info) => {
        pic.id = null;
        pic.trip_id = tripId;
        pic.image = image;
        pic.datetime = info.datetime;
        pic.latitude = info.latitude;
        pic.longitude = info.longitude;
        pic.image_src = image.preview;
        return pic;
      });
    });
  }

  static convertDbsToPics(images) {
    return images.map((image, i) => {
      const pic = new Pic();
      pic.id = image.id;
      pic.trip_id = image.trip_id;
      pic.trip_name = image.trip_name;
      pic.datetime = moment(image.datetime, 'YYYY-MM-DD HH:mm:ss');
      pic.latitude = image.latitude;
      pic.longitude = image.longitude;
      pic.image_src = image.image_src;
      pic.description = image.description;
      return pic;
    });
  }

  getDatetime = () => {
    return this.datetime.format('LLLL');  // 2018년 3월 25일 일요일 오후 3:50
  };

  getImageSrc = (width, height, cropMode='c_scale') => {
    if (this.image_src.startsWith('blob:')) {
      return this.image_src;
    }
    const sizeParam = (Number.isInteger(width) && Number.isInteger(height)) ? `/w_${width},h_${height},${cropMode}` : '';
    return `${Config.cloudUrlHeader}${sizeParam}${this.image_src}`;
  };

  getLocation = () => {
    return [this.longitude, this.latitude];
  };

  updateDbInfo = (id, image_src) => {
    this.id = id;
    window.URL.revokeObjectURL(this.image.preview);
    this.image_src = image_src;
  };
}

export default Pic;
