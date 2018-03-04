import axios from 'axios';
import React, { Component } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import 'react-select/dist/react-select.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.css';
import TripEntry from '../TripEntry';
import Pic from '../Pic';
import { editElement } from '../../utils';

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      trips: [],
      selectedTripId: null,
      lock: true,
      isUploading: false
    }
    this.newTripId = Number.MAX_SAFE_INTEGER;
    this.newTripName = '새 여행 추가';
    this.newTripMessage = '새 여행을 추가하려면 이 문구를 수정하세요.';
  }

  componentDidMount = () => {
    this.getTrips();
  };

  getTrips = () => {
    axios.get('/api/trips')
      .then((response) => {
        this.updateTrips(response.data);
      }).catch(err => console.log(err));
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

  appendPicsToTrip = (tripId, newPics) => {
    const trip = this.getTripById(tripId);
    const pics = trip.pics ? trip.pics.concat(newPics) : newPics;
    console.log(pics);
    const newTrips = editElement(this.state.trips, trip, { pics });
    this.setState({
      trips: newTrips
    });
  };

  uploadNewPics = () => {
    return new Promise((resolve, reject) => {
      console.log('uploadNewPics');
      const tripId = this.state.selectedTripId;
      if (!tripId) {
        return resolve();
      }
      const trip = this.getTripById(tripId);
      if (!trip.pics) {
        return resolve();
      }
      const picsToUpload = trip.pics.filter((pic) => (pic.id === null));
      if (!picsToUpload) {
        return resolve();
      }
      this.setState({
        isUploading: true
      });
      const uploaders = picsToUpload.map((pic) => {
        const formData = new FormData();
        formData.append('trip_id', pic.trip_id);
        formData.append('datetime', pic.datetime.format('YYYY-MM-DD HH:mm:ss'));
        formData.append('latitude', pic.latitude);
        formData.append('longitude', pic.longitude);
        formData.append('image', pic.image);
        return axios.post('/api/pic', formData).then((response) => {
          const index = trip.pics.findIndex((el) => (el.image === pic.image));
          trip.pics[index].updateDbInfo(response.data.id, response.data.image_src);
        }).catch(err => console.log(err));
      });
      axios.all(uploaders).then(() => {
        const newTrips = editElement(this.state.trips, trip, { pics: trip.pics });
        console.log(newTrips);
        this.setState({
          trips: newTrips,
          isUploading: false
        });
        resolve();
      });
    });
  };

  lockTrip = () => {
    return new Promise((resolve, reject) => {
      const isUnlocked = !this.state.lock;
      this.setState({
        lock: true
      });
      if (isUnlocked) {
        this.uploadNewPics().then(resolve);
        return;
      }
      resolve();
    }).then(() => {
      console.log('after lockTrip');
    });
  };

  unlockTrip = () => {
    if (this.state.isUploading) {
      return;
    }
    this.setState({
      lock: false
    });
  };

  onClickLock = () => {
    this.state.lock ? this.unlockTrip() : this.lockTrip();
  };

  onClickRemove = () => {
    confirmAlert({
      title: '여행 삭제',
      message: '정말로 이 여행 항목을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      cancelLabel: '취소',
      onConfirm: this.removeSelectedTrip,
    });
  };

  removeSelectedTrip = () => {
    const trip = this.getTripById(this.state.selectedTripId);
    if (!trip) {
      return;
    }
    return axios.delete(`api/trip/${trip.id}`).then((response) => {
        const newTrips = this.state.trips.slice();
        const index = newTrips.indexOf(trip);
        if (index < 0) {
          return;
        }
        newTrips.splice(index, 1);
        this.setState({
          trips: newTrips,
          selectedTripId: null
        });
      }).catch((err) => {
        console.log(err);
      });
  };

  onDrop = (tripId, images, rejects) => {
    Promise.all(Pic.convertImageToPic(images, tripId))
    .then((newPics) => {
      this.appendPicsToTrip(tripId, newPics);
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
    this.lockTrip().then(() => {
      this.setState({
        selectedTripId: tripOption.value
      });
      this.getPicsOfTrip(tripOption.value);
    });
  };

  getTripById = (tripId) => {
    return this.state.trips.find((trip) => {
      return trip.id === tripId;
    });
  }

  createTrip = (name, target) => {
    return axios.post('/api/trip', { name }).then((response) => {
        const newTrips = this.state.trips.slice();
        newTrips.push(response.data);
        newTrips.sort((a, b) => (b.id - a.id));
        this.setState({
          trips: newTrips,
          selectedTripId: response.data.id
        });
      }).catch((err) => {
        target.textContent = this.newTripMessage;
      });
  };

  changeTripName = (tripId, name, target) => {
    const trip = this.getTripById(tripId);
    return axios.put(`api/trip/${tripId}`, { name }).then((response) => {
        const newTrips = editElement(this.state.trips, trip, { name });
        this.setState({
          trips: newTrips
        });
      }).catch((err) => {
        target.textContent = trip.name;
      });
  };

  getPicsOfTrip = (tripId) => {
    return axios.get(`api/pics`, { params: { trip_id: tripId }}).then((response) => {
      const trip = this.getTripById(tripId);
      const pics = trip.pics? trip.pics.filter((pic) => pic.id === null).concat(response.data) : response.data;
      const newTrips = editElement(this.state.trips, trip, { pics });
      this.setState({
        trips: newTrips
      });
    }).catch(err => console.log(err));
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
    const { trips, modalVisible, selectedTripId, lock, isUploading } = this.state;
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
            disabled={!lock || isUploading}
            >
          </Select>
          {
            selectedTrip && (
              <TripEntry
                tripId={selectedTrip.id}
                pics={selectedTrip.pics}
                lock={lock}
                isUploading={isUploading}
                onKeyDownTripName={this.onKeyDownTripName}
                onKeyUpTripName={this.onKeyUpTripName}
                tripName={selectedTrip.message || selectedTrip.name}
                onClickLock={this.onClickLock}
                onClickRemove={this.onClickRemove}
                onDrop={this.onDrop}
                />
            )
          }
        </Modal>
      </div>
    );
  }
}

Modal.setAppElement('#root');

export default TripList;
