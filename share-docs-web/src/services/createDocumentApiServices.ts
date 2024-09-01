/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import axios from '../client/customAxios';
import { DocumentTypes } from '../shared/types/components';
import { EncryptedPayload } from '../models/api/document';

const POST_DOCUMENTS = 'documents';

const addToken = (token: string) => {
  return {
    headers: {
      Authorization: "Bearer " + token
   }
  }
}

export interface LoginResponse {
  token: string;
  expiryIn: number;
}

export type CreateDocumentRequest = {
  type: DocumentTypes;
  payload: EncryptedPayload; // hex encoded payload
};

export interface CreateDocumentResponse {
  _id?: ObjectId;
}

export const createDocumentApi = async (token: string, request: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
  const config = addToken(token);
  const response = await axios.post(POST_DOCUMENTS, request, config);
  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
};
