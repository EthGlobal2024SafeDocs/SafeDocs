/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import axios from '../client/customAxios';

const POST_DOCUMENTS = 'documents/:documentId/share';

const addToken = (token: string) => {
  return {
    headers: {
      Authorization: "Bearer " + token
   }
  }
}

export type ShareRequest = {
  email: string;
  expiry: number;
  proxyKey: string;
};

export interface ShareDocumentResponse {
  _id?: ObjectId;
}

export const shareDocumentApi = async (token: string, documentId: string, request: ShareRequest): Promise<ShareDocumentResponse> => {
  const config = addToken(token);
  const SHARE_DOC_URL = POST_DOCUMENTS.replace(':documentId', documentId);
  const response = await axios.post(SHARE_DOC_URL, request, config);
  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
};
