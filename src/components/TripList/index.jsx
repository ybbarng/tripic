import React, { Component } from 'react';
import Modal from 'react-modal';
import './style.css';

class TripList extends Component {
  render() {
    const { trips, modalVisible, openModal, closeModal, afterModalOpen } = this.props;
    console.log(trips);
    return (
      <div>
        <button className="triplist-open" onClick={openModal}>&#128748;여행 목록</button>
        <Modal
          isOpen={modalVisible}
          onAfterOpen={afterModalOpen}
          onRequestClose={closeModal}
          contentLabel="여행 목록"
          >
          <h2 className="triplist-modal-title">여행 목록</h2>
          <button className="triplist-modal-close" onClick={closeModal} title="창 닫기">&#10006;</button>
          <div className="triplist-modal-trips">
          {
            trips && trips.map((trip, i) => (
              <h3 className="triplist-modal-trips-entry">{ trip.trip_name }</h3>
            ))
          }
          </div>
        </Modal>
      </div>
    );
  }
}

Modal.setAppElement('#root');

export default TripList;
