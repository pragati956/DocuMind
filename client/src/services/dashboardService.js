import API from "./api";

export const getDashboardStats = async () => {
  const response = await API.get(
    "/dashboard/stats"
  );

  return response.data;
};
export const getActivities =
async () => {

  const response =
    await API.get(
      "/dashboard/activities"
    );

  return response.data;
};
export const submitBugReport = async (bugData) => {
  const response = await API.post("/dashboard/report-bug", bugData);
  return response.data;
};