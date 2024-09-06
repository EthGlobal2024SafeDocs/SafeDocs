import { SignMessageReturnType } from "viem";

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

enum DocumentTypes {
  DriversLicense = "DriversLicense"
}

export type Document = {
  wallet_id: string;
  document_type: DocumentTypes;
  payload: EncryptedPayload;
  _id: string;
};

export const LoginUser = async (
  email: string,
  signature: SignMessageReturnType
): Promise<LoginResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/login`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const RegisterUser = async (
  email: string,
  signature: SignMessageReturnType
): Promise<RegisterResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/register`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const GetDocuments = async (auth: string): Promise<Array<Document>> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/documents`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const GetDocument = async (
  auth: string,
  documentId: string
): Promise<Document> => {
  const result = await fetch(
    `${import.meta.env.VITE_base_url}/documents/${documentId}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  if (result.status != 200) {
    throw Error(await result.json());
  }

  return await result.json();
};
