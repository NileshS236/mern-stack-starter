import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES,
} from "./types";

// Get profile by handle
export const getProfileByHandle = (handle) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get(`/apis/profile/handle/${handle}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: null,
      })
    );
};

export const createProfile = (profileData, history) => async (dispatch) => {
  try {
    await axios.post("/apis/profile", profileData);
    history.push("/dashboard");
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data,
    });
  }
};

// Get all profiles
export const getProfiles = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/apis/profile/all")
    .then((res) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILES,
        payload: null,
      })
    );
};

// Add experience
export const addExperience = (expData, history) => (dispatch) => {
  axios
    .post("/apis/profile/experience", expData)
    .then(() => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Add education
export const addEducation = (eduData, history) => (dispatch) => {
  axios
    .post("/apis/profile/education", eduData)
    .then(() => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete Experience
export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`/apis/profile/experience/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete Education
export const deleteEducation = (id) => (dispatch) => {
  axios
    .delete(`/apis/profile/education/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get current profile
export const getCurrentProfile = () => async (dispatch) => {
  dispatch(setProfileLoading());
  try {
    const res = await axios.get("/apis/profile");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PROFILE,
      payload: {},
    });
  }
};

// Delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("/apis/profile")
      .then((res) =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        })
      )
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};

// Set Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// Craete current Profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
