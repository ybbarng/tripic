import React, { Component } from 'react';
import { get } from 'axios';
import { Annotation, Annotations, ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoBounds, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import './style.css';

class Map extends Component {
  constructor() {
    super();
    this.defaultScale = 180;
    this.state = {
      regionId: '000',
      geographPaths: [],
      selected: null,
      projection: 'times',
      scale: this.defaultScale,
      center: [11, 0],
      yOffset: 50
    }
    this.sizeFactors = new Proxy({
      '111': 150, // Japan
      '119': 150, // Republic of Korea
      '227': 240, // United States of America
    }, {
      get: (dict, countryId) => countryId in dict ? dict[countryId] : 100
    });
  }

  componentDidMount = () => {
    this.loadGeoJson();
  };

  loadGeoJson = () => {
    get(`/topojson/${this.state.regionId}.json`)
      .then(res => {
        if (res.status !== 200) {
          return;
        }
        const data = res.data;
        console.log(data);
        const geographyPaths = feature(
          data,
          data.objects[Object.keys(data.objects)[0]]
        ).features;
        this.setState({
          geographyPaths,
          selected: null
        });
      });
  };

  getRegionId = (region) => {
    return region.properties.id;
  };

  onClick = (region) => {
    console.log(region);
    const bounds = geoBounds(region.geometry);
    const center = geoCentroid(region.geometry);
    console.log(center);
    console.log(bounds[1][0] - bounds[0][0]);
    console.log(bounds[1][1] - bounds[0][1]);
    const sizeFactor = this.sizeFactors[region.properties.id];
    const widthScale = Math.abs(360 / (bounds[1][0] - bounds[0][0]) * sizeFactor);
    const heightScale = Math.abs(180 / (bounds[1][1] - bounds[0][1]) * sizeFactor);
    console.log(widthScale);
    console.log(heightScale);
    this.setState({
      selected: this.getRegionId(region),
      projection: 'orthographic',
      scale: Math.min(widthScale, heightScale),
      center,
      yOffset: 0
    });
    this.setState({
      regionId: this.getRegionId(region)
    }, () => {
      this.loadGeoJson();
    });
  }

  render() {
    const { regionId, geographyPaths, selected, projection, scale, center, yOffset } = this.state;

    const filteredGeographies = geographyPaths ? geographyPaths.filter((geography) => (this.getRegionId(geography) !== '012' /* Antarctica */ &&
      (selected == null || selected === this.getRegionId(geography)))) : null;
    return (
      <div className="Map">
        <ComposableMap
          projection={projection}
          projectionConfig={{
            scale,
            rotation: [-center[0], -center[1], 0],
            yOffset
          }}
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          <ZoomableGroup disablePanning>
            <Geographies
              geography={filteredGeographies}
              disableOptimization
            >
              {(geographies, projection) => geographies.map((geography, i) => (
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
            <Annotations>
            { filteredGeographies && regionId !== '000' && filteredGeographies.map((geography) => {
              const myCenter = geoCentroid(geography.geometry);
              console.log(myCenter);
              console.log(myCenter[0]);
              return (
                <Annotation
                  key={this.getRegionId(geography)}
                  dx={0}
                  dy={0}
                  subject={myCenter}
                  strokeWidth={1}
                  style= {{
                    fill: '#666',
                    fontSize: '10px'
                  }}
                >
                  <text>{geography.properties.native_language_name}</text>
                </Annotation>
              );
            })}
            </Annotations>
            </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default Map;
