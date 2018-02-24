import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature, Popup } from "react-mapbox-gl";
import Config from '../config';
import './style.css';

const Mapbox = ReactMapboxGL({
  accessToken: Config.mapboxAccessToken
});

class Map extends Component {
  constructor() {
    super();
    this.state = {
      clickedPic: null,
      hoveredPic: null
    };
  }

  render() {
    const { pics } = this.props;
    const { clickedPic, hoveredPic } = this.state;

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
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <Layer
          type="circle"
          id="marker"
          paint={{
            "circle-radius": 5,
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
