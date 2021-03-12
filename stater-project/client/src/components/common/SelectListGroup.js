import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const SelectListGroup = ({ name, value, error, info, onChange, options }) => {
  const selectOptions = options.map((option) => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      <select
        className={classnames("form-control form-control-lg", {
          "is-invalid": error,
        })}
        value={value}
        onChange={onChange}
        name={name}
      >
        {selectOptions}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
      {info && <small className="text-muted form-text">{info}</small>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default SelectListGroup;
