// POST /documents         {type, JWT_token, payload }     (drivers license)

import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";
import Document from "../../models/document";

export type CreateDocumentRequest = {
  type: DocumentType;
  payload: string; // hex encoded payload
};

export const CreateDocumentHandler = async (req: Request, res: Response) => {
  // Check if request is null
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const { sub } = req.auth!;

  const wallet = await collections.wallets?.findOne({ _id: new ObjectId(sub) });

  // Check if wallet is
  if (!wallet) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const request: CreateDocumentRequest = req.body;

  const document: Document = {
    document_type: request.type,
    wallet_id: wallet._id,
    payload: request.payload
  };

  const id = await collections.documents?.insertOne(document);

  // Return types with 200 network status
  res.status(200).send({ id: id?.insertedId });
};
