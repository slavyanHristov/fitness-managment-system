import axios from "axios";
// localhost root url: http://localhost:5000/api
// production server url: https://fitm-serv.herokuapp.com/
export default (url = `${import.meta.env.VITE_BACKEND_URL}/api`) => {
  return axios.create({
    baseURL: url,
    withCredentials: true,
  });
};
