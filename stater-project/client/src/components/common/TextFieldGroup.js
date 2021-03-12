import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextFieldGroup = ({
  name,
  value,
  type,
  placeholder,
  error,
  info,
  onChange,
  disabled,
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error,
        })}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {info && <small className="text-muted form-text">{info}</small>}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.string,
  type: PropTypes.string.isRequired,
};

TextFieldGroup.defaultProps = {
  type: "text",
};

export default TextFieldGroup;
