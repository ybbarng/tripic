import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature, Popup, RotationControl, ZoomControl } from "react-mapbox-gl";
import Config from '../config';
import './style.css';

const Mapbox = ReactMapboxGL({
  accessToken: Config.mapboxAccessToken
});

class Map extends Component {
  constructor() {
    super();
    this.state = {
      center: [126.9687473, 37.5543629],
      zoom: [11],
      clickedPic: null,
      hoveredPic: null
    };
  }

  render() {
    const { pics } = this.props;
    const { center, zoom, clickedPic, hoveredPic } = this.state;

    const onMoveEndMap = (map, evt) => {
      const center = map.getCenter();
      const zoom = [map.getZoom()];
      this.setState({
        center: [center.lng, center.lat],
        zoom
      });
    }

    const onClickMarker = (pic) => (
      (mapWithEvent) => {
        const newPic = (clickedPic === null || clickedPic !== pic) ? pic : null;
        this.setState({
          clickedPic: newPic
        });
      }
    );

    const onMouseEnterMarker = (pic) => (
      (mapWithEvent) => {
        this.setState({
          hoveredPic: pic
        });
      }
    );

    const onMouseLeaveMarker = (pic) => (
      (mapWithEvent) => {
        if (hoveredPic === pic) {
          this.setState({
            hoveredPic: null
          });
        }
      }
    );

    const createMarker = (pic, i) => (
      <Feature
        coordinates={pic.location}
        onClick={onClickMarker(pic)}
        onMouseEnter={onMouseEnterMarker(pic)}
        onMouseLeave={onMouseLeaveMarker(pic)}
        key={i}
        />
    );
    return (
      <Mapbox
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/streets-v9"
        onMoveEnd={onMoveEndMap}
        center={center}
        zoom={zoom}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <ZoomControl />
        <RotationControl />
        <Layer
          type="circle"
          id="marker"
          paint={{
            "circle-radius": {
              "base": 5,
              "stops":[[11, 5], [18, 20]],
            },
            "circle-color": '#9302f4'
          }}>
          { pics.map(createMarker) }
        </Layer>
        { clickedPic &&
          <Popup
            coordinates={clickedPic.location}
            >
            <img className="mapbox-popup-image" src={clickedPic.image.preview} />
          </Popup>
        }
        { hoveredPic &&
          <Popup
            coordinates={hoveredPic.location}
            >
            <img className="mapbox-popup-image" src={hoveredPic.image.preview} />
          </Popup>
        }
      </Mapbox>
    );
  }
}

export default Map;
