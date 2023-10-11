import axios from "axios";

//  check if the token is expired
const isTokenExpired = (idToken, refreshToken) => {
  const now = Date.now() / 1000;
  const decodedToken = decodeIdToken(idToken);
  const expirationTime = decodedToken.exp - now;
  if (expirationTime <= 0) {
    return true;
  } else if (expirationTime < 300) {
    refreshAccessToken(refreshToken);
  }
  return false;
};

const decodeIdToken = idToken => {
  const tokenParts = idToken.split(".");
  const encodedPayload = tokenParts[1];
  const decodedPayload = atob(encodedPayload);
  return JSON.parse(decodedPayload);
};

const refreshAccessToken = async refreshToken => {
  const response = await axios.post(
    `${process.env.HTTPS_ENDPOINT}/auth/refresh-token`,
    {
      refreshToken,
    },
  );
  const { accessToken, idToken, expiresIn } = response.data;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("id-token", idToken);
  localStorage.setItem("refresh-token", response.data.refreshToken);
  localStorage.setItem("expires-in", expiresIn);
  axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
};

export { refreshAccessToken, decodeIdToken, isTokenExpired };
