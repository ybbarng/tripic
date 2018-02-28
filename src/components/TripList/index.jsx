import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Modal from 'react-modal';
import './style.css';

class TripList extends Component {
  render() {
    const { trips, modalVisible, openModal, closeModal, afterModalOpen, onDrop } = this.props;
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
          <div className="triplist-modal-header">
            <h2 className="triplist-modal-title">여행 목록</h2>
            <button className="triplist-modal-close" onClick={closeModal} title="창 닫기">&#10006;</button>
          </div>
          <div className="triplist-modal-trips">
          {
            trips && trips.map((trip, i) => (
              <div className="triplist-modal-trips-entry" key={i}>
                <h3 className="triplist-modal-trips-entry-title">{ trip.trip_name }</h3>
                <Dropzone
                  className="triplist-modal-trips-entry-dropzone"
                  accept="image/jpeg, image/png"
                  onDrop={ onDrop.bind(null, trip) }
                  >
                  <div className="triplist-modal-trips-entry-dropzone-guide">
									<svg className="triplist-modal-trips-entry-dropzone-guide-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
                    <p><strong>드래그</strong> 또는 <strong>클릭</strong>으로<br /> 사진 추가</p>
                  </div>
                </Dropzone>
              </div>
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
