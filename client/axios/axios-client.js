// axios/createAxiosClient.js
import axios from 'axios';

export const createAxiosClient = (req) => {
  if (typeof window === 'undefined') {
    // Server-side
    return axios.create({
      baseURL: 'http://ingress-nginx.ingress-nginx-svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // Client-side
    return axios.create({
      baseURL: '/',
      headers: {},
    });
  }
};
