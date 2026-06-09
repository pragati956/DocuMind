import API from "./api";

export const uploadDocument = async (
  file,
  onUploadProgress
) => {
  const formData = new FormData();

  formData.append("document", file);

  const response = await API.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );

  return response.data;
};

export const fetchDocuments = async (
  page = 1,
  limit = 10
) => {
  const response = await API.get(
    `/documents/all?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const searchDocuments = async (
  query
) => {
  const response = await API.get(
    `/documents/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
};

export const getDocumentById = async (
  id
) => {
  const response = await API.get(
    `/documents/${id}`
  );

  return response.data;
};

export const updateDocument = async (
  id,
  updates
) => {
  const response = await API.put(
    `/documents/${id}`,
    updates
  );

  return response.data;
};

export const deleteDocument = async (
  id
) => {
  const response = await API.delete(
    `/documents/${id}`
  );

  return response.data;
};
export const toggleStarDocument =
 async (id) => {

 const response =
  await API.patch(
   `/documents/${id}/star`
  );

 return response.data;

};
export const getSearchStats =
 async () => {

  const response =
   await API.get(
    "/documents/stats"
   );

  return response.data;

 };
 export const getCategories =
async ()=>{

 const response =
  await API.get(
   "/documents/categories"
  );

 return response.data;

};
export const getDocumentsByType =
async(type)=>{

 const response =
 await API.get(
  `/documents/type/${type}`
 );

 return response.data;

};
export const getSuggestions =
async ()=>{

 const response =
  await API.get(
   "/documents/suggestions"
  );

 return response.data;

};
export const saveSearchHistory =
async(data)=>{

 const response =
  await API.post(
   "/documents/search-history",
   data
  );

 return response.data;

};
export const getSearchHistory =
async()=>{

 const response =
  await API.get(
   "/documents/search-history"
  );

 return response.data;

};
export const clearSearchHistory =
async()=>{

 const response =
  await API.delete(
   "/documents/search-history"
  );

 return response.data;

};
export const deleteSearchHistory =
async(id)=>{

 const response =
  await API.delete(
   `/documents/search-history/${id}`
  );

 return response.data;

};