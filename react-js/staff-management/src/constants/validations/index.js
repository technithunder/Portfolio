export const AlphaNumeric = {
  regexPattern: /^[a-zA-Z0-9\s]+$/,
  errorMessage: 'Only alphanumeric characters are allowed.'
};

export const OnlyLetters = {
  regexPattern: /^[a-zA-Z\s]+$/,
  errorMessage: 'Only letters and spaces are allowed.'
};

export const RealNumber = {
  regexPattern: /^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?$/,
  errorMessage: 'Please enter a valid real number.'
};
