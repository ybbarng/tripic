import React, { Component } from 'react';
import { ComposableMap, ZoomableGlobe, Geographies, Geography } from 'react-simple-maps';
import { geoBounds, geoCentroid } from 'd3-geo';
import './style.css';

class Map extends Component {
  constructor() {
    super();
    this.defaultScale = 150;
    this.state = {
      selected: null,
      projection: 'mercator',
      scale: this.defaultScale,
      center: [137, 0]
    }
  }

  getRegionId = (region) => (region.properties.NAME_LONG);

  onClick = (region) => {
    console.log(region);
    const bounds = geoBounds(region.geometry);
    const center = geoCentroid(region.geometry);
    console.log(center);
    console.log(bounds[1][0] - bounds[0][0]);
    console.log(bounds[1][1] - bounds[0][1]);
    const sizeFactor = region.properties.NAME_LONG === 'United States' ? 540 : 180;
    const widthScale = Math.abs(360 / (bounds[1][0] - bounds[0][0]) * sizeFactor);
    const heightScale = Math.abs(180 / (bounds[1][1] - bounds[0][1]) * sizeFactor);
    console.log(widthScale);
    console.log(heightScale);
    this.setState({
      selected: this.getRegionId(region),
      projection: 'orthographic',
      scale: Math.min(widthScale, heightScale),
      center
    });
  }

  render() {
    const { selected, projection, scale, center } = this.state;
    console.log(scale);

    return (
      <div className="Map">
        <ComposableMap
          projection={projection}
          projectionConfig={{
            scale,
            rotation: [-11, 0, 0]
          }}
          width={980}
          height={900}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGlobe
            center={center}
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
