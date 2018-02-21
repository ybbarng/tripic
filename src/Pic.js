import {getImageInfo} from './utils'

class Pic {
  constructor() {
    this.latitude = 0;
    this.longitude = 0;
  }

  static fromImages(images) {
    return images.map((image, i) => {
      const pic = new Pic();
      return getImageInfo(image).then((info) => {
        pic.datetime = info.datetime;
        pic.latitude = info.latitude;
        pic.longitude = info.longitude;
        return pic;
      });
    });
  }

  get location() {
    return [this.longitude, this.latitude];
  }
}

export default Pic;
