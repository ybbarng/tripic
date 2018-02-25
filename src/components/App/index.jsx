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
      dropzoneActive: false
    };
  }

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
      const pics = this.state.pics.concat(newPics);
      this.setState({
        pics,
        dropzoneActive: false
      });
    });
  };

  render() {
    const { pics, dropzoneActive } = this.state;
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
          <Map pics={pics}/>
        </div>
      </Dropzone>
    );
  }
}

export default App;
