import axios from 'axios';
import Pic from './components/Pic';

export const readTrips = () => {
  return axios.get('/api/trips')
    .then((response) => {
      return response.data;
    });
};

export const createTrip = (tripName) => {
  return axios.post('/api/trip', { tripName })
    .then((response) => {
      return response.data;
    });
};

export const updateTrip = (tripId, tripName) => {
  return axios.put(`/api/trip/${tripId}`, { tripName });
};

export const deleteTrip = (tripId) => {
  return axios.delete(`/api/trip/${tripId}`);
};

export const readPics = (tripId) => {
  return axios.get('/api/pics').then((response) => {
    return Pic.convertDbsToPics(response.data);
  });
};

export const readPicsOfTrip = (tripId) => {
  return axios.get('/api/pics', { params: { trip_id: tripId }}).then((response) => {
    return Pic.convertDbsToPics(response.data);
  });
};

export const createPic = (data) => {
  return axios.post('/api/pic', data).then((response) => {
    return response.data
  });
};

export const deletePic = (picId) => {
  return axios.delete(`/api/pic/${picId}`);
};
