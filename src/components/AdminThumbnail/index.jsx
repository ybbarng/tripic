import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

class AdminThumbnail extends Component {
  constructor() {
    super();
    this.state = {
      showOptions: false
    }
  }

  onMouseEnter = () => {
    this.setState({
      showOptions: true
    });
  }

  onMouseLeave = () => {
    this.setState({
      showOptions: false
    });
  }

  render() {
    const { src, alt, linkTo, onClickDelete } = this.props;
    const { showOptions } = this.state;

    return (
      <div
        className="thumbnail"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        >
        <img
          className="image"
          src={src}
          alt={alt || ''}
          />
        { showOptions && (
          <div className="thumbnail-overlap">
            <Link className="thumbnail-overlap-detail" to={linkTo} style={{ textDecoration: 'none' }}>
              상세보기
            </Link>
            <div className="thumbnail-overlap-delete" onClick={onClickDelete}>&#10006;</div>
          </div>
        )}
      </div>
    );
  }
};

export default AdminThumbnail;
