import React, { Component } from 'react';
import './style.css';
import Map from '../Map';
import * as api from '../../api';
import logo from '../../assets/main_logo.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      pics: [],
      center: [126.9687473, 37.5543629],
      zoom: [11],
      clickedPic: null,
      hoveredPic: null,
      response: '',
      modalVisible: false,
    };
  }

  componentDidMount = () => {
    this.getPics();
  };

  getPics = () => {
    api.readPics()
      .then(this.concatPics)
      .catch(err => console.log(err));
  };

  concatPics = (newPics) => {
    const pics = this.state.pics.concat(newPics);
    this.setState({
      pics
    });
  };

  onMovedMap = (map, evt) => {
    const center = map.getCenter();
    const zoom = [map.getZoom()];
    this.setState({
      center: [center.lng, center.lat],
      zoom
    });
  };

  onClickMarker = (clickedPic) => {
    if (this.state.clickedPic === null ||
        this.state.clickedPic !== clickedPic) {
      this.setState({
        center: clickedPic.getLocation(),
        zoom: [11],
        clickedPic
      });
    } else {
      this.setState({
        clickedPic: null
      });
    }
  };

  onMouseEnterMarker = (hoveredPic) => {
    this.setState({
      hoveredPic
    });
  };

  onMouseLeaveMarker = (hoveredPic) => {
    if (hoveredPic === this.state.hoveredPic) {
      this.setState({
        hoveredPic: null
      });
    }
  };

  render() {
    const { pics, center, zoom, clickedPic, hoveredPic } = this.state;
    return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-title" alt="Tripic" />
      </header>
      <Map />
    </div>
    );
  }
}

export default App;
