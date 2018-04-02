import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import './style.css';
import AdminTrip from '../AdminTrip';
import * as api from '../../api';
import { getObjectById } from '../../utils';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      trips: [],
      newTripName: ''
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
    return getObjectById(this.state.trips, tripId);
  }

  onChangeNewTripName = (event) => {
    this.setState({
      newTripName: event.target.value
    });
  }

  createTrip = (event) => {
    const name = this.state.newTripName;
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
    const { trips, newTripName } = this.state;
    return (
      <div className="admin">
        <div className="admin-trips">
          <h1 className="admin-trips-title">여행 목록</h1>
          <div>
            <TextField
              type="text"
              label="여행 이름"
              value={newTripName}
              onChange={this.onChangeNewTripName}
              />
            <Button
              variant="raised"
              color="primary"
              onClick={this.createTrip}
              >
              여행 추가
            </Button>
          </div>
          <List component="nav">
            { trips && trips.map((trip, i) => (
              <Link className="admin-trips-item" to={`/admin/${trip.id}`} style={{ textDecoration: 'none' }} key={i}>
                <ListItem button>
                  <ListItemText primary={trip.name} />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
        <Route path="/admin/:tripId" render={(props) => {
          return (
            <div className="admin-body">
              <AdminTrip
                trip={this.getTripById(props.match.params.tripId)}
                onRenameTrip={this.onRenameTrip}
                onDeleteTrip={this.onDeleteTrip}
                {...props}
              />
            </div>
          );}
        } />
      </div>
    );
  }
}

export default Admin;
