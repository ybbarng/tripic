import axios from 'axios';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './style.css';
import AlertDialog from '../AlertDialog';
import AdminThumbnail from '../AdminThumbnail';
import AdminPic from '../AdminPic';
import Pic from '../Pic';
import * as api from '../../api';
import lockImage from '../../assets/lock.png';
import unlockImage from '../../assets/unlock.png';
import { editObject, getObjectById } from '../../utils';

class AdminTrip extends Component {
  constructor() {
    super();
    this.state = {
      fetching: false,
      trip: null,
      pics: [],
      tempPics: [],
      lock: true,
      isUploading: false,
      tripTitleEditText: ''
    }
    this.lockMessage = "변경하려면 자물쇠를 클릭하세요.";
    this.unlockMessage = "더 이상 변경하지 않으려면 자물쇠를 클릭하세요.";
    this.uploadingMessage = "사진을 업로드하는 중에는 여행을 변경할 수 없습니다.";
  }

  fetchAll = (tripId, trip) => {
    this.setState({
      fetching: true,
      trip
    });
    this.fetchPicsOfTrip(tripId).then(() => {
      this.setState({
        fetching: false
      });
    });
  };

  fetchTrip = (tripId) => {
    /*
    return api.readTrip(tripId).then((trip) => {
      this.setState({
        trip
      });
    });
    */
  }

  fetchPicsOfTrip = (tripId) => {
    return api.readPicsOfTrip(tripId).then((pics) => {
      this.setState({
        pics
      });
    }).catch(err => console.log(err));
  };

  componentDidMount = () => {
    this.fetchAll(
      this.props.match.params.tripId,
      this.props.trip
    );
  }

  componentWillReceiveProps = (newProps) => {
    var newTripId = newProps.match.params.tripId;
    if (this.state.trip == null || this.state.trip.id + '' !== newTripId) {
      this.fetchAll(newTripId, newProps.trip);
    }
  }

  uploadNewPics = () => {
    return new Promise((resolve, reject) => {
      console.log('uploadNewPics');
      const { tempPics } = this.state;
      if (tempPics.length < 1) {
        return resolve();
      }
      this.setState({
        isUploading: true
      });
      const uploaders = tempPics.map((pic) => {
        const formData = new FormData();
        formData.append('trip_id', pic.trip_id);
        formData.append('datetime', pic.datetime.format('YYYY-MM-DD HH:mm:ss'));
        formData.append('latitude', pic.latitude);
        formData.append('longitude', pic.longitude);
        formData.append('image', pic.image);
        return api.createPic(formData).then((dbInfo) => {
          const index = tempPics.findIndex((el) => (el.image === pic.image));
          tempPics[index].updateDbInfo(dbInfo.id, dbInfo.image_src);
        }).catch(err => console.log(err));
      });
      axios.all(uploaders).then(() => {
        const pics = this.state.pics.slice().concat(tempPics);
        this.setState({
          pics,
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
        this.saveTripNewTitle()
          .then(this.uploadNewPics)
          .then(resolve);
        return;
      }
      resolve();
    });
  };

  unlockTrip = () => {
    const { trip, isUploading } = this.state;
    if (!trip || isUploading) {
      return;
    }
    this.setState({
      lock: false,
      tripTitleEditText: trip.name
    });
  };

  onClickLock = () => {
    this.state.lock ? this.unlockTrip() : this.lockTrip();
  };

  onChangeTripTitle = (event) => {
    this.setState({
      tripTitleEditText: event.target.value
    });
  };

  onClickRemove = () => {
    var message = '정말로 이 여행 항목을 삭제하시겠습니까?';
    const nPics = this.state.pics.length;
    if (nPics > 0) {
      message += `\n(주의) 이 여행에 포함된 ${nPics} 개의 사진도 같이 삭제됩니다.`;
    }
    AlertDialog({
      title: '여행 삭제',
      message,
      confirmLabel: '삭제',
      cancelLabel: '취소',
      onConfirm: this.removeTrip,
    });
  };

  removeTrip = () => {
    const { trip } = this.state;
    const { onDeleteTrip } = this.props;
    if (!trip) {
      return;
    }
    return api.deleteTrip(trip.id).then((response) => {
        onDeleteTrip(trip.id);
      }).catch((err) => {
        console.log(err);
      });
  };

  onDrop = (tripId, images, rejects) => {
    Promise.all(Pic.convertImageToPic(images, tripId))
    .then((newPics) => {
      const tempPics = this.state.tempPics.slice().concat(newPics);
      this.setState({
        tempPics
      });
    });
  };

  changeTripName = (tripId, name) => {
    const { trip } = this.state;
    const { onRenameTrip } = this.props;
    return api.updateTrip(tripId, name).then((response) => {
        const newTrip = editObject(trip, { name });
        this.setState({
          trip: newTrip
        });
        onRenameTrip(tripId, name);
      }).catch((err) => {
        console.log(err);
        this.setState({
          tripTitleEditText: trip.name
        });
      });
  };

  saveTripNewTitle = () => {
    return new Promise((resolve, reject) => {
      const newTripName = this.state.tripTitleEditText;
      if (!newTripName) {
        resolve();
        return;
      }
      if (this.state.trip.name === newTripName) {
        resolve();
        return;
      }
      this.changeTripName(this.state.trip.id, newTripName)
        .then(resolve);
    });
  };

  getNextImageIndex = (pics, i) => {
    return (i + 1) % pics.length;
  };

  getPrevImageIndex = (pics, i) => {
    return (i + pics.length - 1) % pics.length;
  };

  getPic = (tripId, picIndex) => {
    if (typeof tripId === typeof '') {
      tripId = parseInt(tripId, 10);
      if (isNaN(tripId)) {
        return null;
      }
    }
    if (typeof picIndex === typeof '') {
      picIndex = parseInt(picIndex, 10);
      if (isNaN(picIndex)) {
        return null;
      }
    }
    const { trip, pics, tempPics } = this.state;
    if (trip === null) {
      return null;
    }
    if (trip.id !== tripId) {
      return null;
    }
    if (picIndex < pics.length) {
      return pics[picIndex];
    } else if (picIndex < pics.length + tempPics.length) {
      return tempPics[picIndex - pics.length];
    } else {
      return null;
    }
  };

  getPicById = (picId) => {
    return getObjectById(this.state.pics, picId);
  };

  onClickDeletePic = (picId) => {
    AlertDialog({
      title: '사진 삭제',
      message: '정말로 이 사진을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      cancelLabel: '취소',
      onConfirm: this.removePic.bind(null, picId)
    });
  };

  removePic = (picId) => {
    const pic = this.getPicById(picId);
    if (!pic) {
      return;
    }
    return api.deletePic(picId).then((response) => {
        this.onDeletePic(response.data.deletedPicId);
      }).catch((err) => {
        console.log(err.response);
        if (err.response.data.error === 'NOT_FOUND_FROM_DB') {
          this.onDeletePic(picId);
          return;
        }
        toast.error('에러가 발생하여 사진을 삭제하는데 실패했습니다.');
      });
  };

  onDeletePic = (picId) => {
    const deletedPic = this.getPicById(picId);
    if (deletedPic === null) {
      return;
    }
    const newPics = this.state.pics.slice();
    const index = newPics.indexOf(deletedPic);
    if (index < 0) {
      return;
    }
    newPics.splice(index, 1);
    this.setState({
      pics: newPics
    });
    toast.success('사진이 성공적으로 삭제되었습니다.');
  };

  render() {
    const { fetching, trip, pics, tripTitleEditText, lock, isUploading } = this.state;
    const message = (() => {
      if (isUploading) {
        return this.uploadingMessage;
      } else if (lock) {
        return this.lockMessage;
      } else {
        return this.unlockMessage;
      }
    })();
    if (fetching || !trip) {
      return (
        <div>
          로딩중...
        </div>
      );
    } else {
      return (
        <div className="trip">
          <div className="trip-entry">
            <div className="trip-entry-header">
              {
                lock && (
                  <h3
                    className="trip-entry-header-title"
                    placeholder="여행 이름을 입력하세요."
                    >{ trip.name }</h3>
              )}
              {
                !lock && (
                  <input type="text"
                    className="trip-entry-header-title-edit"
                    value={tripTitleEditText}
                    disabled={lock || isUploading}
                    placeholder="여행 이름을 입력하세요."
                    onChange={this.onChangeTripTitle}
                    />
              )}
              <div className="trip-entry-header-right">
                <span className="trip-entry-header-right-message">{ message }</span>
                { !isUploading && (
                  <button
                    className="trip-entry-header-right-lock"
                    onClick={this.onClickLock}
                    >
                    <img
                      className="trip-entry-header-right-lock-image"
                      src={ lock ? lockImage : unlockImage }
                      alt={ lock ? "자물쇠 잠김" : "자물쇠 풀림" }
                      />
                  </button>
                )}
              </div>
            </div>
            <div className="trip-entry-body">
              <div className="trip-entry-pics">
              {
                pics && pics.map((pic, i) => (
                  <AdminThumbnail
                    src={pic.getImageSrc(96, 54)}
                    alt={pic.description || ''}
                    linkTo={`/admin/${trip.id}/${i}`}
                    onClickDelete={this.onClickDeletePic.bind(null, pic.id)}
                    key={i}
                    />
                ))
              }
              {
                (!pics || pics.length === 0) && <p className="trip-entry-no-pics">이 여행에 등록된 사진이 없습니다.</p>
              }
              </div>
              { !lock && (
                <Dropzone
                  className="trip-entry-dropzone"
                  activeClassName="trip-entry-dropzone-active"
                  rejectClassName="trip-entry-dropzone-reject"
                  accept="image/jpeg, image/png"
                  onDrop={this.onDrop.bind(null, trip.id)}
                  >
                  <div className="trip-entry-dropzone-guide">
                  <svg className="trip-entry-dropzone-guide-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
                    <p><strong>드래그</strong> 또는 <strong>클릭</strong>으로<br /> 사진 추가</p>
                  </div>
                </Dropzone>
                )}
            </div>
            { !lock && (
              <button className="trip-entry-remove" onClick={this.onClickRemove}>&#10006; 여행 삭제</button>
            )}
          </div>
          <Route path="/admin/:tripId/:picIndex" render={(props) => {
            return (
              <div className="trip-pic">
                <AdminPic
                  pic={this.getPic(props.match.params.tripId, props.match.params.picIndex)}
                  {...props}
                />
              </div>
            );}
          } />
          <ToastContainer
            hideProgressBar={true}
          />
        </div>
      )
    }
  }
}

export default AdminTrip;
