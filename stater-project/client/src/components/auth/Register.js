import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";

import TextFieldGroup from "../common/TextFieldGroup";

const Register = ({
  auth: { isAuthenticated },
  registerUser,
  history,
  ...props
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name,
      email,
      password,
      password2,
    };
    registerUser(newUser, history);
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
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
              <TextFieldGroup
                type="email"
                name="email"
                value={email}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                info="This site uses Gravatar so if you want a profile image, use a
                Gravatar email"
              />
              <TextFieldGroup
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <TextFieldGroup
                type="password"
                name="password2"
                value={password2}
                placeholder="Confirm Password"
                onChange={(e) => setPassword2(e.target.value)}
                error={errors.password2}
              />
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
