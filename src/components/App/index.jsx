import axios from 'axios';
import React, { Component } from 'react';
import moment from 'moment';
import './style.css';
import Map from '../Map';
import { getLocation } from '../../utils';
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
    axios.get('api/pics')
      .then((response) => (
        this.convertPics(response.data)
      )).then(this.concatPics)
      .catch(err => console.log(err));
  };

  convertPics = (pics) => {
    return pics.map((pic) => {
      pic.datetime = moment(pic.datetime, 'YY-MM-DD HH:mm:ss');
      return pic;
    });
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
        center: getLocation(clickedPic),
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
      <Map
        pics={pics}
        center={center}
        zoom={zoom}
        clickedPic={clickedPic}
        hoveredPic={hoveredPic}
        onMovedMap={this.onMovedMap}
        onClickMarker={this.onClickMarker}
        onMouseEnterMarker={this.onMouseEnterMarker}
        onMouseLeaveMarker={this.onMouseLeaveMarker}
        />
    </div>
    );
  }
}

export default App;
