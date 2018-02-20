import React, { Component } from 'react';
import './style.css';
import Map from '../Map'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tripic</h1>
        </header>
        <Map />
      </div>
    );
  }
}

export default App;
