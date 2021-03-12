import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import isEmpty from "../../validations/is-empty";
import ProfileActions from "./ProfileActions";
import Education from "./Education";
import Experience from "./Experience";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  const onDeleteClick = (e) => {
    deleteAccount();
  };

  let dashBoardContent;

  if (profile === null || loading) {
    dashBoardContent = <Spinner />;
  } else {
    // Check if logged in and has a profile
    if (!isEmpty(profile)) {
      dashBoardContent = (
        <div>
          <p className="lead text-muted">
            Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
          </p>
          <ProfileActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div style={{ marginBottom: "60px" }} />
          <button onClick={onDeleteClick} className="btn btn-danger">
            Delete My Account
          </button>
        </div>
      );
    } else {
      // Check if logged in and has a profile
      dashBoardContent = (
        <div>
          <p className="lead text-muted">Welcome {user.name}</p>
          <p>You have not yet setup a profile. Please add some profile.</p>
          <Link to="create-profile" className="btn btn-lg btn-info">
            Create Profile
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            {dashBoardContent}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
