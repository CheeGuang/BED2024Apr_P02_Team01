// globalVariables.js
let refreshToken = null;

const setRefreshToken = (token) => {
  refreshToken = token;
};

const getRefreshToken = () => {
  return refreshToken;
};

module.exports = {
  setRefreshToken,
  getRefreshToken,
};
