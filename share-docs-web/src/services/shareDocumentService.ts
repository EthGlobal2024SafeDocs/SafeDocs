import { getPublicKeyApi } from './getPubKeyApiServices';
import { ShareDocumentResponse, ShareRequest, shareDocumentApi } from './shareDocumentApiServices';
import { generateProxyKey } from './web3Services';

export type ShareDocumentRequest = {
  token: string;
  documentId: string;
  priKey: string;
  email: string;
  expiresIn: number;
}

export const shareDocument = async (shareDocumentRequest: ShareDocumentRequest): Promise<ShareDocumentResponse | undefined> => {
  const { email, expiresIn, priKey, token, documentId } = shareDocumentRequest;
  const pubKey = await getPublicKeyApi(token, email);
  if (!pubKey) {
    return undefined;
  }
  const proxyKey = generateProxyKey(priKey, pubKey.public_key);
  if (!proxyKey) {
    return undefined;
  }
  const request: ShareRequest = {
    email,
    expiry: expiresIn,
    proxyKey
  };
  const result = await shareDocumentApi(token, documentId, request);
  return result;
};