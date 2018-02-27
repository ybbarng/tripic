import React, { Component } from 'react'; import Dropzone from 'react-dropzone';
import './style.css';
import Map from '../Map';
import Pic from '../Pic';
import TripList from '../TripList';

class App extends Component {
  constructor() {
    super();
    this.state = {
      trips: [],
      pics: [],
      dropzoneActive: false,
      center: [126.9687473, 37.5543629],
      zoom: [11],
      clickedPic: null,
      hoveredPic: null,
      response: '',
      modalVisible: false,
    };
  }

  componentDidMount = () => {
    this.getPics()
      .then(this.concatPics)
      .catch(err => console.log(err));
    this.getTrips()
      .then(this.updateTrips)
      .catch(err => console.log(err));
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

  getTrips = () => {
    return this.getApi('trips.json');
  };

  concatPics = (newPics) => {
    const pics = this.state.pics.concat(newPics);
    this.setState({
      pics,
      dropzoneActive: false
    });
  };

  updateTrips = (trips) => {
    this.setState({
      trips
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
  };

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

  setModalVisible = (modalVisible) => {
    this.setState({
      modalVisible
    });
  };

  openModal = () => {
    this.setModalVisible(true);
  };

  closeModal = () => {
    this.setModalVisible(false);
  };

  afterModalOpen = () => {
  };

  render() {
    const { pics, trips, center, zoom, dropzoneActive, clickedPic, hoveredPic, modalVisible } = this.state;
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
          <TripList
            trips={trips}
            modalVisible={modalVisible}
            openModal={this.openModal}
            closeModal={this.closeModal}
            afterModalOpen={this.afterModalOpen}
            />
        </div>
      </Dropzone>
    );
  }
}

export default App;
