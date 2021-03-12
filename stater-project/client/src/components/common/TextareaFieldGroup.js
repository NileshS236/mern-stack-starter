import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextareaFieldGroup = ({
  name,
  value,
  placeholder,
  error,
  info,
  onChange,
}) => {
  return (
    <div className="form-group">
      <textarea
        className={classnames("form-control form-control-lg", {
          "is-invalid": error,
        })}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {info && <small className="text-muted form-text">{info}</small>}
    </div>
  );
};

TextareaFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
};

export default TextareaFieldGroup;
