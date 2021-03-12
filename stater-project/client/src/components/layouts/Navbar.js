import React from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

const Navbar = ({
  auth: { isAuthenticated, user },
  logoutUser,
  clearCurrentProfile,
}) => {
  const onLogoutClick = (e) => {
    e.preventDefault();
    clearCurrentProfile();
    logoutUser();
  };

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      <li className="nav-item">
        <a className="nav-link" onClick={onLogoutClick} href="">
          <img
            src={`https:${user.avatar}`}
            alt={user.name}
            title="Connect to Gravatar to display your image"
            style={{
              width: "25px",
              objectFit: "contain",
              marginRight: "5px",
              borderRadius: "50%",
            }}
          />{" "}
          Logout
        </a>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DevConnector
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profiles">
                {" "}
                Developers
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(
  Navbar
);
