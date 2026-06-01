import axios from "axios";

const API_URL =
  "http://localhost:5000/api/ai";

export const getSummaries =
  async (token) => {

    const response =
      await axios.get(
        `${API_URL}/summaries`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
  export const summarizeDocument =
  async (id, token) => {

    const response =
      await axios.post(
        `${API_URL}/summarize/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };