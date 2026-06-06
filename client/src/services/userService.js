import axios from "axios";

const API_URL =
  "http://localhost:5000/api/user";

export const getProfile =
  async (token) => {

    const response =
      await axios.get(
        `${API_URL}/profile`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const updateProfile =
  async (
    profileData,
    token
  ) => {

    const response =
      await axios.put(
        `${API_URL}/profile`,
        profileData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
  export const getNotifications =
async (token) => {

  const response =
    await axios.get(
      `${API_URL}/notifications`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const updateNotifications =
async (
  notifications,
  token
) => {

  const response =
    await axios.put(
      `${API_URL}/notifications`,
      notifications,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};
export const changePassword =
async (
  passwordData,
  token
) => {

  const response =
    await axios.put(
      `${API_URL}/change-password`,
      passwordData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};