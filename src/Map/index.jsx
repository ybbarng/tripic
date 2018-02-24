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
      selectedPic: null
    };
  }

  render() {
    const onClickMarker = (pic) => (
      (mapWithEvent) => {
        const newPic = this.state.selectedPic ? null : pic;
        this.setState({
          selectedPic: newPic
        });
      }
    );

    const createMarker = (pic, i) => (
      <Feature
        coordinates={pic.location}
        onClick={onClickMarker(pic)}
        key={i}
        />
    );
    const { pics } = this.props;
    const { selectedPic } = this.state;
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
        { selectedPic &&
          <Popup
            coordinates={selectedPic.location}
            >
            <img className="mapbox-popup-image" src={selectedPic.image.preview} />
          </Popup>
        }
      </Mapbox>
    );
  }
}

export default Map;
