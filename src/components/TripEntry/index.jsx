import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './style.css';
import lockImage from '../../assets/lock.png';
import unlockImage from '../../assets/unlock.png';

class TripEntry extends Component {
  constructor() {
    super();
    this.lockMessage = "변경하려면 자물쇠를 클릭하세요.";
    this.unlockMessage = "더 이상 변경하지 않으려면 자물쇠를 클릭하세요.";
    this.uploadingMessage = "사진을 업로드하는 중에는 여행을 변경할 수 없습니다.";
  }

  render() {
    const { tripId, pics, lock, isUploading, onKeyDownTripName, onKeyUpTripName, tripName, onClickLock, onClickRemove, onDrop } = this.props;
    const message = (() => {
      if (isUploading) {
        return this.uploadingMessage;
      } else if (lock) {
        return this.lockMessage;
      } else {
        return this.unlockMessage;
      }
    })();
    const nameEditable = isUploading ? "false" : "true";
    return (
      <div className="trip-entry">
        <h3
          className="trip-entry-title"
          contentEditable={nameEditable}
          suppressContentEditableWarning={true}
          onKeyDown={onKeyDownTripName}
          onKeyUp={onKeyUpTripName}
          placeholder="여행 이름을 입력하세요."
          >{ tripName }</h3>
        <div className="trip-entry-right">
          <span className="trip-entry-right-message">{ message }</span>
          { !isUploading && (
            <button
              className="trip-entry-lock"
              onClick={onClickLock}
              >
              <img
                className="trip-entry-lock-image"
                src={ lock ? lockImage : unlockImage }
                alt={ lock ? "자물쇠 잠김" : "자물쇠 풀림" }
                />
            </button>
          )}
        </div>
        <div className="trip-entry-body">
          <div className="trip-entry-pics">
          {
            pics && pics.map((pic, i) => (
              <img className="trip-entry-pics-entry" src={pic.image.preview} key={i}/>
            ))
          }
          {
            !pics && <p className="trip-entry-no-pics">이 여행에 등록된 사진이 없습니다.</p>
          }
          </div>
          { !lock && (
            <Dropzone
              className="trip-entry-dropzone"
              activeClassName="trip-entry-dropzone-active"
              rejectClassName="trip-entry-dropzone-reject"
              accept="image/jpeg, image/png"
              onDrop={ onDrop.bind(null, tripId) }
              >
              <div className="trip-entry-dropzone-guide">
              <svg className="trip-entry-dropzone-guide-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
                <p><strong>드래그</strong> 또는 <strong>클릭</strong>으로<br /> 사진 추가</p>
              </div>
            </Dropzone>
            )}
        </div>
        { !lock && (
          <button className="trip-entry-remove" onClick={onClickRemove}>&#10006; 여행 삭제</button>
        )}
      </div>
    )
  }
}

export default TripEntry;
