const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validatePostInput = (data) => {
  let errors = {};

  data.text = isEmpty(data.text) ? "" : data.text;

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    error.text = "Post must be between 10 to 300 characters.";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field can't be Empty.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
