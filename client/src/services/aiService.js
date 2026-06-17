import API from "./api";

export const getSummaries = async () => {
  const response = await API.get(
    "/ai/summaries"
  );

  return response.data;
};

export const summarizeDocument = async (id) => {
  const response = await API.post(
    `/ai/summarize/${id}`
  );

  return response.data;
};