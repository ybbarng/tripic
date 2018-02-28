import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature, Popup, RotationControl, ZoomControl } from "react-mapbox-gl";
import Config from '../../config';
import './style.css';

const Mapbox = ReactMapboxGL({
  accessToken: Config.mapboxAccessToken
});

class Map extends Component {
  render() {
    const { pics, center, zoom, clickedPic, hoveredPic,
      onMovedMap, onClickMarker, onMouseEnterMarker,
      onMouseLeaveMarker } = this.props;

    const createMarker = (pic, i) => (
      <Feature
        coordinates={pic.location}
        onClick={onClickMarker.bind(null, pic)}
        onMouseEnter={onMouseEnterMarker.bind(null, pic)}
        onMouseLeave={onMouseLeaveMarker.bind(null, pic)}
        key={i}
        />
    );
    return (
      <Mapbox
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/streets-v9"
        onMoveEnd={onMovedMap}
        center={center}
        zoom={zoom}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <ZoomControl
          style={{
            top: "50px"
          }}
          position="top-left" />
        <RotationControl
          style={{
            top: "102px"
          }}
          position="top-left" />
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
