// GET /documents

import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";

export const FindSharedDocumentHandler = async (req: Request, res: Response) => {
  // Get sub from auth
  const { sub } = req.auth!;

  // Check if wallet exists
  const wallet = await collections.wallets?.findOne({ _id: new ObjectId(sub) });

  if (!wallet) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // Get current timestamp
  const currentTime = Date.now();

  // Find and return shared documents

  const shared = await collections.shared
    ?.find( { $and: [
        { wallet_id: new ObjectId(sub) },
        { valid_until: { $gt: currentTime } }
        ] }, { batchSize: 1000 })
    .toArray();

  // Check if documents are expired and map to documents

  if(!shared) {
    res.status(200).send("No shared documents");
    return;
  }

  const documents = shared!.map((x) => {
    collections.documents
    ?.findOne({ _id: x.document_id })
  });

  res.status(200).send(documents);
};
