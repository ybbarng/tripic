import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Modal from 'react-modal';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './style.css';
import Pic from '../Pic';
import { editElement, getApi, postApi, putApi } from '../../utils';

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      trips: [],
      selectedTripId: null
    }
    this.newTripId = Number.MAX_SAFE_INTEGER;
    this.newTripName = '새 여행 추가';
    this.newTripMessage = '새 여행을 추가하려면 이 문구를 수정하세요.';
  }

  componentDidMount = () => {
    this.getTrips()
      .then(this.updateTrips)
      .catch(err => console.log(err));
  };

  getTrips = () => {
    return getApi('trips.json');
  };

  updateTrips = (trips) => {
    trips.push({
      id: this.newTripId,
      name: this.newTripName,
      message: this.newTripMessage
    });
    trips.sort((a, b) => (b.id - a.id));
    this.setState({
      trips
    });
  };

  appendPicsToTrip = (trip, newPics) => {
    const pics = trip.pics ? trip.pics.concat(newPics) : newPics;
    console.log(pics);
    const newTrips = editElement(this.state.trips, trip, { pics });
    this.setState({
      trips: newTrips
    });
  };

  onDrop = (trip, images, rejects) => {
    Promise.all(Pic.fromImages(images))
    .then((newPics) => {
      this.appendPicsToTrip(trip, newPics);
    });
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

  onChangeTrip = (tripOption) => {
    if (!tripOption) {
      return;
    }
    this.setState({
      selectedTripId: tripOption.value
    });
  };

  getTripById = (tripId) => {
    return this.state.trips.find((trip) => {
      return trip.id === tripId;
    });
  }

  createTrip = (name, target) => {
    return postApi(
      `trip`,
      {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      JSON.stringify({ name })).then((body) => {
        const newTrips = this.state.trips.slice();
        newTrips.push(body);
        newTrips.sort((a, b) => (b.id - a.id));
        this.setState({
          trips: newTrips,
          selectedTripId: body.id
        });
      }).catch((err) => {
        target.textContent = this.newTripMessage;
      });
  };

  changeTripName = (tripId, name, target) => {
    const trip = this.getTripById(tripId);
    return putApi(
      `trip/${tripId}`,
      {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      JSON.stringify({ name })).then((body) => {
        const newTrips = editElement(this.state.trips, trip, { name });
        this.setState({
          trips: newTrips
        });
      }).catch((err) => {
        target.textContent = trip.name;
      });
  };

  onKeyDownTripName = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  onKeyUpTripName = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.state.selectedTripId) {
        this.setState();
        return;
      }
      const newTripName = event.target.textContent;
      if (!newTripName) {
        return;
      }
      event.target.blur();
      if (this.state.selectedTripId === this.newTripId) {
        this.createTrip(newTripName, event.target);
      } else {
        this.changeTripName(this.state.selectedTripId, newTripName, event.target);
      }
    }
  };

  render() {
    const { trips, modalVisible, selectedTripId } = this.state;
    const selectedTrip = selectedTripId && this.getTripById(selectedTripId);
    const tripOptions = trips && trips.map((trip) => ({
      value: trip.id,
      label: trip.name
    }));
    return (
      <div>
        <button className="triplist-open" onClick={this.openModal}>여행 목록</button>
        <Modal
          isOpen={modalVisible}
          onAfterOpen={this.afterModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="여행 목록"
          >
          <div className="triplist-modal-header">
            <h2 className="triplist-modal-title">여행 목록</h2>
            <button className="triplist-modal-close" onClick={this.closeModal} title="창 닫기">&#10006;</button>
          </div>
          <Select
            className="triplist-modal-trips"
            name="trip"
            value={selectedTripId}
            onChange={this.onChangeTrip}
            options={tripOptions}
            >
          </Select>
          {
            selectedTrip && (
              <div className="triplist-modal-trips-entry">
                <h3
                  className="triplist-modal-trips-entry-title"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onKeyDown={this.onKeyDownTripName}
                  onKeyUp={this.onKeyUpTripName}
                  placeholder="여행 이름을 입력하세요."
                  >{ selectedTrip.message || selectedTrip.name }</h3>
                <div className="triplist-modal-trips-entry-body">
                  <div className="triplist-modal-trips-entry-pics">
                  {
                    selectedTrip.pics && selectedTrip.pics.map((pic, i) => (
                      <img className="triplist-modal-trips-entry-pics-entry" src={pic.image.preview} key={i}/>
                    ))
                  }
                  </div>
                  <Dropzone
                    className="triplist-modal-trips-entry-dropzone"
                    activeClassName="triplist-modal-trips-entry-dropzone-active"
                    rejectClassName="triplist-modal-trips-entry-dropzone-reject"
                    accept="image/jpeg, image/png"
                    onDrop={ this.onDrop.bind(null, selectedTrip) }
                    >
                    <div className="triplist-modal-trips-entry-dropzone-guide">
                    <svg className="triplist-modal-trips-entry-dropzone-guide-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
                      <p><strong>드래그</strong> 또는 <strong>클릭</strong>으로<br /> 사진 추가</p>
                    </div>
                  </Dropzone>
                </div>
              </div>
            )
          }
        </Modal>
      </div>
    );
  }
}

Modal.setAppElement('#root');

export default TripList;
