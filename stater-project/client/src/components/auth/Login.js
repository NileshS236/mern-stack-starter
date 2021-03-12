import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

import TextFieldGroup from "../common/TextFieldGroup";

const Login = ({ loginUser, auth: { isAuthenticated }, history, ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    loginUser(user);
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/dashboard");
    }

    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props]);

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">
              Sign in to your DevConnector account
            </p>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                type="email"
                name="email"
                value={email}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <TextFieldGroup
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
