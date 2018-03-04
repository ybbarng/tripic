import {getImageInfo} from '../utils'

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

  updateDbInfo = (id, image_src) => {
    this.id = id;
    window.URL.revokeObjectURL(this.image.preview);
    this.image_src = image_src;
  };
}

export default Pic;
