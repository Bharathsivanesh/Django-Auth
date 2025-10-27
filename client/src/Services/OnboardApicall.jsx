import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/myapp/";

export const apiService = async ({
  endpoint,
  method = "GET",
  payload = {},
  onSuccess = () => {},
  onError = () => {},
  headers = {},
  fullUrl = false,
}) => {
  const url = fullUrl ? endpoint : `${BASE_URL}${endpoint}`;
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    // Normal API call
    const response = await axios({
      url,
      method,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
    });

    onSuccess(response.data);
    return response.data;
  } catch (error) {
    const errData = error?.response?.data;
    const statusCode = error?.response?.status;

    // ✅ Only handle token expiration errors
    const isAccessExpired =
      statusCode === 401 &&
      errData?.code === "token_not_valid" &&
      Array.isArray(errData?.messages) &&
      errData.messages.some(
        (msg) =>
          msg.token_class === "AccessToken" &&
          msg.message.toLowerCase().includes("expired")
      );

    // 🔹 If access token expired → refresh it
    if (isAccessExpired && refreshToken) {
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = refreshResponse.data.access;
        localStorage.setItem("access_token", newAccess);

        // Retry original request with new access token
        const retryResponse = await axios({
          url,
          method,
          data: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccess}`,
            ...headers,
          },
        });

        onSuccess(retryResponse.data);
        return retryResponse.data;
      } catch (refreshError) {
        // 🔻 Handle refresh token expiration separately
        const refreshErrData = refreshError?.response?.data;
        const refreshStatus = refreshError?.response?.status;

        const isRefreshExpired =
          refreshStatus === 401 &&
          (refreshErrData?.detail === "Token is expired" ||
            refreshErrData?.code === "token_not_valid");

        if (isRefreshExpired) {
          console.warn("Refresh token expired — logging out user.");
          localStorage.clear();
          alert("Your session has expired. Please log in again.");
          window.location.href = "/"; // redirect to login page
        }

        onError(refreshError);
        throw refreshError;
      }
    }

    // For all other errors (not token related)
    onError(error);
    throw error;
  }
};
