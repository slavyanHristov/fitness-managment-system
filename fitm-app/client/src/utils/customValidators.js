import { helpers } from "@vuelidate/validators";

export const validatePhone = helpers.regex(/^\d{10}$/);
export const validateTimeFormat = helpers.regex(
  /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/
);
export const validateGymName = helpers.regex(/^[A-Za-z\s,._+()*'&-]{2,}$/);
export const validateDescription = helpers.regex(/^[a-zA-Z0-9\s.,!''""\-()]*$/);
export const validatePassword = helpers.regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?_&]*/
);
export const validateUsername = helpers.regex(
  /^[A-Za-z]+(?:[ _-]*[A-Za-z0-9]+)$/
);
export const validateName = helpers.regex(/^[A-Z][a-zA-Z]{2,}$/);
export const validateFullName = helpers.regex(
  /^[A-Z][a-zA-Z]{2,}(?: [A-Z][a-zA-Z]*){0,2}$/
);
export const validateSalary = helpers.regex(/^\d{3,4}(?:\.\d{0,2})?$/);
export const validatePrecision = helpers.regex(/^\d{0,2}(\.\d{1,2})?$/);

export const validateFileType = (value) => {
  if (!value) {
    return true;
  }
  let selectedFiles = value;
  let isImage = true;
  Object.keys(selectedFiles).forEach((file) => {
    console.log("file", selectedFiles[file]);
    if (!selectedFiles[file].type.startsWith("image")) {
      isImage = false;
    }
  });
  return isImage;
};
