import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature, Popup, RotationControl, ZoomControl } from "react-mapbox-gl";
import Config from '../../config';
import { getImageSrc, getLocation } from '../../utils';
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
        coordinates={getLocation(pic)}
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
          height: "100%",
          width: "100vw"
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
              "base": 5,
              "stops":[[11, 5], [18, 20]],
            },
            "circle-color": '#9302f4'
          }}>
          { pics && pics.map(createMarker) }
        </Layer>
        { clickedPic &&
          <Popup
            coordinates={getLocation(clickedPic)}
            >
            <img
              className="mapbox-popup-image"
              src={getImageSrc(clickedPic, 80, 45)}
              alt={clickedPic.description || ''}
              />
          </Popup>
        }
        { hoveredPic &&
          <Popup
            coordinates={getLocation(hoveredPic)}
            >
            <img
              className="mapbox-popup-image"
              src={getImageSrc(hoveredPic, 80, 45)}
              alt={hoveredPic.description || ''}
              />
          </Popup>
        }
      </Mapbox>
    );
  }
}

export default Map;
