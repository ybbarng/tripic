import React, { Component } from 'react';
import { getImageSrc } from '../../utils';

class AdminPic extends Component {
  render() {
    const { pic } = this.props;
    console.log(pic);
    if (!pic) {
      return (
        <div>
          사진을 찾을 수 없습니다.
        </div>
      );
    }
    return (
      <img src={getImageSrc(pic)} />
    );
  }
};

export default AdminPic;
