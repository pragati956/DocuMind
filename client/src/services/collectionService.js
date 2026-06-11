import API from "./api";

// CREATE A NEW COLLECTION
export const createCollection = async (collectionData) => {
  const response = await API.post("/collections", collectionData);
  return response.data;
};
// GET ALL COLLECTIONS
export const getCollections = async () => {
  const response = await API.get("/collections");
  return response.data;
};
// TOGGLE STAR STATUS
export const toggleStarCollection = async (id) => {
  const response = await API.patch(`/collections/${id}/star`);
  return response.data;
};

// DELETE A COLLECTION
export const deleteCollection = async (id) => {
  const response = await API.delete(`/collections/${id}`);
  return response.data;
};

// ADD DOCUMENT TO COLLECTION
export const addDocumentToCollection = async (collectionId, documentId) => {
  const response = await API.post(`/collections/${collectionId}/documents`, { documentId });
  return response.data;
};