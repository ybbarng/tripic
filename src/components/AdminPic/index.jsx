import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature, RotationControl, ZoomControl } from "react-mapbox-gl";
import Config from '../../config';
import './style.css';

const Mapbox = ReactMapboxGL({
  accessToken: Config.mapboxAccessToken
});

class AdminPic extends Component {
  constructor() {
    super();
    this.state = {
      pic: null,
      tripId: -1,
      picIndex: -1,
      center: [126.9687473, 37.5543629],
      zoom: [11],
    };
  }

  init = (pic, tripId, picIndex) => {
    this.setState({
      tripId,
      picIndex,
    });
    if (pic) {
      this.setState({
        pic,
        center: pic.getLocation()
      });
    }
  };

  componentDidMount = () => {
    const { tripId, picIndex } = this.props.match.params;
    const { pic } = this.props;
    this.init(pic, tripId, picIndex);
  }

  componentWillReceiveProps = (newProps) => {
    const { tripId, picIndex } = newProps.match.params;
    const { pic } = newProps;
    this.init();
    if (this.state.tripId !== tripId || this.state.picIndex !== picIndex) {
      this.init(pic, tripId, picIndex);
    }
  }

  onMovedMap = (map, evt) => {
    const center = map.getCenter();
    const zoom = [map.getZoom()];
    this.setState({
      center: [center.lng, center.lat],
      zoom
    });
  };

  onChangeDatetime = (event) => {
    const { pic } = this.state;
    if (!pic) {
      return;
    }
    pic.setDatetime(event.target.value, 'YYYY-MM-DDTHH:mm:ss');
    this.setState({
      pic
    });
  };

  onChangeLatitude = (event) => {
    const { pic } = this.state;
    this.changePicLocation(event.target.value, pic.longitude, true);
  };

  onChangeLongitude = (event) => {
    const { pic } = this.state;
    this.changePicLocation(pic.latitude, event.target.value, true);
  };

  changePicLocation = (latitude, longitude, changeCenter) => {
    const { pic } = this.state;
    if (!pic) {
      return;
    }
    pic.latitude = latitude;
    pic.longitude = longitude;
    this.setState({
      pic
    });
    if (changeCenter) {
      this.setState({
        center: pic.getLocation()
      });
    }
  };

  onDragMarker = (map, evt) => {
    const { lngLat } = map;
    this.changePicLocation(lngLat.lat, lngLat.lng);
  };

  createMarker = (pic) => {
    if (pic) {
      return (
        <Feature
          coordinates={pic.getLocation()}
          draggable={true}
          onDrag={this.onDragMarker}
          />
      );
    }
  };

  render() {
    const { pic, center, zoom } = this.state;

    if (!pic) {
      return (
        <div>
          사진을 찾을 수 없습니다.
        </div>
      );
    }
    return (
      <div className="pic">
        <img className="pic-image" src={pic.getImageSrc(427, 240)} alt="사진 미리보기" />
        <form className="pic-info">
          <h2>사진 정보</h2>
          <div className="pic-info">
            <span className="pic-info-name">여행 이름</span>
            <span className="pic-info-value">{pic.trip_name}</span>
          </div>

          <div className="pic-info">
            <span className="pic-info-name">촬영 일시</span>
            <input
              className="pic-info-value"
              type="datetime-local"
              value={pic.getDatetime('YYYY-MM-DDTHH:mm:ss')}
              onChange={this.onChangeDatetime}
              />
          </div>
          <div className="pic-info">
            <span className="pic-info-name">위도</span>
            <input
              className="pic-info-value"
              type="number"
              value={pic.latitude}
              onChange={this.onChangeLatitude}
              />
          </div>
          <div className="pic-info">
            <span className="pic-info-name">경도</span>
            <input
              className="pic-info-value"
              type="number"
              value={pic.longitude}
              onChange={this.onChangeLongitude}
              />
          </div>
        </form>
        <Mapbox
          // eslint-disable-next-line
          style="mapbox://styles/mapbox/streets-v9"
          onMoveEnd={this.onMovedMap}
          center={center}
          zoom={zoom}
          containerStyle={{
            height: "427px",
            width: "427px"
          }}>
          <ZoomControl
            style={{
              top: "60px",
              left: "20px"
            }}
            position="top-left" />
          <RotationControl
            style={{
              top: "112px",
              left: "20px"
            }}
            position="top-left" />
          <Layer
            type="circle"
            id="marker"
            paint={{
              "circle-radius": {
                "base": 10,
                "stops":[[11, 10], [18, 30]],
              },
              "circle-color": '#9302f4'
            }}>
            { this.createMarker(pic) }
          </Layer>
        </Mapbox>
      </div>
    );
  }
};

export default AdminPic;
