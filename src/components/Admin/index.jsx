import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './style.css';
import AdminTrip from '../AdminTrip';
import * as api from '../../api';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      trips: [],
    }
  }

  componentDidMount = () => {
    this.getTrips();
  };


  getTrips = () => {
    api.readTrips()
      .then((trips) => {
        this.updateTrips(trips);
      }).catch(err => console.log(err));
  };

  updateTrips = (trips) => {
    trips.sort((a, b) => (b.id - a.id));
    this.setState({
      trips
    });
  };

  getTripById = (tripId) => {
    if (typeof tripId === typeof '') {
      tripId = parseInt(tripId, 10);
      if (isNaN(tripId)) {
        return null;
      }
    }
    return this.state.trips.find((trip) => {
      return trip.id === tripId;
    });
  }

  createTrip = (name) => {
    return api.createTrip(name).then((newTrip) => {
      const newTrips = this.state.trips.slice();
      newTrips.push(newTrip);
      newTrips.sort((a, b) => (b.id - a.id));
      this.setState({
        trips: newTrips,
      });
    }).catch((err) => {
      console.log(err);
      this.setState({
        tripTitleEditText: '잘못된 이름입니다.'
      });
    });
  };

  onRenameTrip = (tripId, tripName) => {
    const renamedTrip = this.getTripById(tripId);
    if (renamedTrip === null) {
      return;
    }
    const newTrips = this.state.trips.slice();
    const index = newTrips.indexOf(renamedTrip);
    if (index < 0) {
      return;
    }
    newTrips[index].name = tripName;
    this.setState({
      trips: newTrips
    });
  };

  onDeleteTrip = (tripId) => {
    const deletedTrip = this.getTripById(tripId);
    if (deletedTrip === null) {
      return;
    }
    const newTrips = this.state.trips.slice();
    const index = newTrips.indexOf(deletedTrip);
    if (index < 0) {
      return;
    }
    newTrips.splice(index, 1);
    this.props.history.push('/admin');
    this.setState({
      trips: newTrips
    });
  };

  render() {
    const { trips } = this.state;
    return (
      <div className="admin">
        <div className="admin-trips">
        <h1 className="admin-trips-title">여행 목록</h1>
        { trips && trips.map((trip, i) => (
          <Link to={`/admin/${trip.id}`} className="admin-trips-item" key={i}>{ trip.name }</Link>
        ))}
        </div>
        <div className="admin-body">
        <Route path="/admin/:tripId" render={(props) => {
          return (
            <AdminTrip
              trip={this.getTripById(props.match.params.tripId)}
              onRenameTrip={this.onRenameTrip}
              onDeleteTrip={this.onDeleteTrip}
              {...props}
            />
          );}
        } />
        </div>
      </div>
    );
  }
}

export default Admin;
