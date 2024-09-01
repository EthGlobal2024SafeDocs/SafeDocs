import { UserDocument } from '../models/api/document';
import { DocumentTypes } from '../shared/types/components';
import { CreateDocumentRequest, CreateDocumentResponse, createDocumentApi } from './createDocumentApiServices';
import { generateEncryptedPayload } from './web3Services';

export const createDocument = async (token: string, pubKey : string, document: UserDocument): Promise<CreateDocumentResponse | undefined> => {
  const payload = generateEncryptedPayload(pubKey, document);
  if (!payload) {
    return undefined;
  }
  const request: CreateDocumentRequest = {
    type: DocumentTypes.DriversLicense,
    payload,
  };
  const result = await createDocumentApi(token, request);
  return result;
};