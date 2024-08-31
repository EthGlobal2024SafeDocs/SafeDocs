import axios from '../client/customAxios';
import Document from '../models/api/document';

const GET_DOCUMENTS = 'documents';
const GET_SHARED_DOCUMENTS = 'documents/shared';

const addToken = (token: string) => {
  return {
    headers: {
      Authorization: "Bearer " + token
   }
  }
}

export const getDocuments = async (token: string): Promise<Document[]> => {
  const config = addToken(token);
  const response = await axios.get(GET_DOCUMENTS, config);

  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
};

export const getSharedDocuments = async (token: string): Promise<Document[]> => {
  const config = addToken(token);
  const response = await axios.get(GET_SHARED_DOCUMENTS, config);

  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
}