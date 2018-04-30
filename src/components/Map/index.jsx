import React, { Component } from 'react';
import { ComposableMap, ZoomableGlobe, Geographies, Geography } from 'react-simple-maps';
import './style.css';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      selected: null
    }
  }

  getRegionId = (region) => (region.properties.NAME_LONG);

  onClick = (region) => {
    console.log(region);
    this.setState({
      selected: this.getRegionId(region)
    });
  }

  render() {
    const { selected } = this.state;

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
            <Geographies
              geography="/topojson/world.json"
              disableOptimization
            >
              {(geographies, projection) => geographies
                  .filter((geography) => (selected == null || selected === this.getRegionId(geography)))
                  .map((geography, i) => (
                    <Geography
                      key={this.getRegionId(geography)}
                      geography={geography}
                      projection={projection}
                      onClick={this.onClick}
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
