import React, { Component } from 'react';
import { ComposableMap, ZoomableGlobe, Geographies, Geography } from 'react-simple-maps';
import './style.css';

class Map extends Component {
  render() {
    return (
      <div className="Map">
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0]
          }}
          width={980}
          height={702}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGlobe
            center={[137, 0]}
            disablePanning
            >
            <Geographies geography="/topojson/world.json">
              {(geographies, projection) => geographies.map((geography, i) => (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#FF5722",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))}
            </Geographies>
          </ZoomableGlobe>
        </ComposableMap>
      </div>
    );
  }
}

export default Map;
