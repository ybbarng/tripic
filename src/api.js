import axios from 'axios';

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

export const readPicsOfTrip = (tripId) => {
  return axios.get('/api/pics', { params: { trip_id: tripId }}).then((response) => {
    return response.data;
  });
};

export const createPic = (data) => {
  return axios.post('/api/pic', data).then((response) => {
    return response.data
  });
};
