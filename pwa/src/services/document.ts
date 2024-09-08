import { DecryptPayload, DecryptPayloadBulk, EncryptPayload } from "./crypto";
import { getUserById } from "./db";
import { AddDocument, GetDocument, GetDocuments, GetEmailPublicKey, GetSharedDocuments, ShareDocument } from "./api";
import { RouterContext } from "@/routes/__root";
import { DriversLicenseType } from "@/app/Documents/Operations/DriversLicenseForm";
import { generateReEncrytionKey } from "@/lib";
import dayjs from "dayjs";

export enum DocumentTypes {
  DriversLicense = "DriversLicense",
}

export type Document<T> = {
  wallet_id: string;
  document_type: DocumentTypes;
  payload: T;
  _id: string;
};

export type SharedDocument<T> = {
  attestation_id: string;
  document_id: string;
  document_type: DocumentTypes;
  payload: T;
};

export const createNewDocument = async (context: RouterContext, type: DocumentTypes, payload: string) => {
  const { userId, token } = context;
  if (!userId) throw Error("user not logged-in!");

  const user = await getUserById(userId);
  if (!user) throw Error("user not found!");

  const encrypted = await EncryptPayload(user.key, payload);

  const response = await AddDocument(token!, type, encrypted);

  return response;
};

export const getDocuments = async (context: RouterContext) => {
  const { userId, token } = context;
  if (!userId) throw Error("user not logged-in!");

  const user = await getUserById(userId);
  if (!user) throw Error("user not found!");

  const docs = await GetDocuments(token!);

  const payloads = await DecryptPayloadBulk(
    user.key,
    docs.map((i) => ({ key: i._id, payload: i.payload })),
  );

  return payloads.map((i) => {
    const doc = docs.find((d) => d._id == i?.key);
    if (doc) {
      if (doc.document_type === DocumentTypes.DriversLicense) {
        return {
          ...doc,
          payload: JSON.parse(i!.payload),
        } as Document<DriversLicenseType>;
      }
    }
  });
};

export const getDocument = async (context: RouterContext, id: string) => {
  const { userId, token } = context;
  if (!userId) throw Error("user not logged-in!");

  const user = await getUserById(userId);
  if (!user) throw Error("user not found!");

  const doc = await GetDocument(token!, id);
  if (doc.document_type === DocumentTypes.DriversLicense) {
    return {
      ...doc,
      payload: JSON.parse(await DecryptPayload(user.key, doc.payload)),
    } as Document<DriversLicenseType>;
  }
};

export const shareDocument = async (context: RouterContext, id: string, email: string, expiry: Date) => {
  const { userId, token } = context;
  if (!userId) throw Error("user not logged-in!");

  const user = await getUserById(userId);
  if (!user) throw Error("user not found!");

  // get the public key of the recipient email
  const pubKeyResult = await GetEmailPublicKey(token!, email);

  // generate a proxy key
  const proxy = generateReEncrytionKey(user.key, pubKeyResult.public_key.substring(1));

  const expiryDate = dayjs(expiry);

  return await ShareDocument(token!, id, email, expiryDate.unix(), proxy);
};

export const getSharedDocuments = async (context: RouterContext) => {
  const { userId, token } = context;
  if (!userId) throw Error("user not logged-in!");

  const user = await getUserById(userId);
  if (!user) throw Error("user not found!");

  const docs = await GetSharedDocuments(token!);

  const payloads = await DecryptPayloadBulk(
    user.key,
    docs.map((i) => ({ key: i.attestation_id, payload: i.payload })),
  );

  return payloads.map((i) => {
    const doc = docs.find((d) => d.attestation_id == i?.key);
    if (doc) {
      if (doc.document_type === DocumentTypes.DriversLicense) {
        return {
          attestation_id: doc.attestation_id,
          document_id: doc.document_id,
          document_type: doc.document_type,
          payload: JSON.parse(i!.payload),
        } as SharedDocument<DriversLicenseType>;
      }
    }
  });
};
