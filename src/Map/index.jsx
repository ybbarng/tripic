import React, { Component } from 'react';
import ReactMapboxGL, { Layer, Feature } from "react-mapbox-gl";
import Config from '../config';

const Mapbox = ReactMapboxGL({
  accessToken: Config.mapboxAccessToken
});

class Map extends Component {
  render() {
    const { pics } = this.props;
    return (
      <Mapbox
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <Layer
          type="symbol"
          id="marker"
          layout={{ "icon-image": "marker-15" }}>
          {
            pics.map((pic, i) => {
              return <Feature coordinates={pic.location} key={i} />
            })
          }
        </Layer>
      </Mapbox>
    );
  }
}

export default Map;
