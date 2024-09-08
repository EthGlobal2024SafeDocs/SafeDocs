import { Hex, SignMessageReturnType } from "viem";
import { DocumentTypes } from "./document";

export type LoginResponse = {
  token: string;
  expiryIn: number;
};

type RegisterResponse = {
  _id: string;
};

type EncryptedPayload = {
  key: string;
  cipher: string;
};

export type DocumentApi = {
  wallet_id: string;
  document_type: DocumentTypes;
  payload: EncryptedPayload;
  _id: string;
};

export type SharedDocumentApi = {
  attestation_id: string;
  document_type: DocumentTypes;
  document_id: string;
  payload: EncryptedPayload;
};

type DocumentAddedResponse = {
  _id: string;
};
type DocumentSharedResponse = {
  _id: string;
};

type PublicKeyResponse = {
  public_key: Hex;
};

export const LoginUser = async (email: string, signature: SignMessageReturnType): Promise<LoginResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/login`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const RegisterUser = async (email: string, signature: SignMessageReturnType): Promise<RegisterResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/register`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const GetDocuments = async (auth: string): Promise<Array<DocumentApi>> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const GetDocument = async (auth: string, documentId: string): Promise<DocumentApi> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents/${documentId}`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }

  return await result.json();
};

export const AddDocument = async (
  auth: string,
  documentType: DocumentTypes,
  payload: EncryptedPayload,
): Promise<DocumentAddedResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents`, {
    method: "post",
    body: JSON.stringify({ type: documentType, payload }),
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }

  return await result.json();
};

export const ShareDocument = async (
  auth: string,
  documentId: string,
  email: string,
  expiry: number,
  proxy: string,
): Promise<DocumentSharedResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents/${documentId}/share`, {
    method: "post",
    body: JSON.stringify({ email, expiry, proxyKey: proxy }),
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }

  return await result.json();
};

export const GetEmailPublicKey = async (auth: string, email: string): Promise<PublicKeyResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/publicKeys/${encodeURI(email)}`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }

  return await result.json();
};

export const GetSharedDocuments = async (auth: string): Promise<Array<SharedDocumentApi>> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents/shared`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const GetSharedDocument = async (auth: string, attestationId: string): Promise<SharedDocumentApi> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents/shared/${attestationId}`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};
