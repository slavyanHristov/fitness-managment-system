import axios from "axios";

export default (url = "http://localhost:5000/api") => {
  return axios.create({
    baseURL: url,
    withCredentials: true,
  });
};
