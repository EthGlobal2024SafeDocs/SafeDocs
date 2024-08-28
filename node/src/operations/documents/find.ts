// GET /documents

import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";

export const FindDocumentHandler = async (req: Request, res: Response) => {
  // Get sub from auth
  const { sub } = req.auth!;

  // Check if wallet exists
  const wallet = await collections.wallets?.findOne({ _id: new ObjectId(sub) });

  if (!wallet) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const documents = await collections.documents
    ?.find({ wallet_id: new ObjectId(sub) }, { batchSize: 1000 })
    .toArray();

  // Check if no owned or shared documents

  res.status(200).send(documents);
};
