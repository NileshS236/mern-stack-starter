import axios from "axios";
// Utils
import setAuthToken from "../utils/setAuthToken";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import jwt_decode from "jwt-decode";

// Register User
export const registerUser = (userData, history) => async (dispatch) => {
  try {
    await axios.post("/apis/user/register", userData);
    history.push("/login");
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data,
    });
  }
};

// Login - Get User Token
export const loginUser = (userData) => async (dispatch) => {
  try {
    const res = await axios.post("/apis/user/login", userData);
    // Save to localStorage
    const { token } = res.data;
    // Set token to localstorage
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data,
    });
  }
};

// Set logged-in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
