import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './style.css';
import Map from '../Map'
import Pic from '../Pic'

class App extends Component {
  constructor() {
    super();
    this.state = {
      pics: [],
      dropzoneActive: false,
      center: [126.9687473, 37.5543629],
      zoom: [11],
      clickedPic: null,
      hoveredPic: null,
      response: ''
    };
  }

  componentDidMount = () => {
    this.getPics()
      .then(this.concatPics)
      .catch(err => console.log(err));
    this.getTrips();
  };

  getApi = async (url) => {
    const response = await fetch(`/api/${url}`);
    console.log(response);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    console.log(body);
    return body;
  };

  getPics = () => {
    return this.getApi('pics.json');
  };

  getTrips = async () => {
    return this.getApi('trips.json');
  };

  concatPics = (newPics) => {
    const pics = this.state.pics.concat(newPics);
    this.setState({
      pics,
      dropzoneActive: false
    });
  };

  onDragEnter = () => {
    this.setState({
      dropzoneActive: true
    });
  };

  onDragLeave = () => {
    this.setState({
      dropzoneActive: false
    });
  };

  onDrop = (images) => {
    Promise.all(Pic.fromImages(images))
    .then((newPics) => {
      this.concatPics(newPics);
      this.setState({
        dropzoneActive: false
      });
    });
  };

  onMovedMap = (map, evt) => {
    const center = map.getCenter();
    const zoom = [map.getZoom()];
    this.setState({
      center: [center.lng, center.lat],
      zoom
    });
  }

  onClickMarker = (clickedPic) => {
    if (this.state.clickedPic === null ||
        this.state.clickedPic !== clickedPic) {
      this.setState({
        center: clickedPic.location,
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
    const { pics, center, zoom, dropzoneActive, clickedPic, hoveredPic } = this.state;
    return (
      <Dropzone
        disableClick
        style={{ position: "relative" }}
        accept="image/jpeg, image/png"
        onDrop={ this.onDrop }
        onDragEnter={ this.onDragEnter }
        onDragLeave={ this.onDragLeave }
        >
        { dropzoneActive && <div className="overlay">여기에 업로드할 사진을 놓으세요.</div> }
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Tripic</h1>
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
      </Dropzone>
    );
  }
}

export default App;
