// GET /documents/{document_id}

import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";
import Document from "../../models/document";

export const ReturnDocumentHandler = async (req: Request, res: Response) => {
  // Get sub from auth
  const { sub } = req.auth!;

  // Check if document id isn't falsy
  const { documentId } = req.params;

  if(!documentId) {
    console.log("document id is null", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // Check if document exists in db and is owned by auth'd user

  const document = await collections.documents?.findOne({
    wallet_id: new ObjectId(sub),
    _id: new ObjectId(documentId)
  }) as Document;

  if(!document) {
    console.log("document doesn't exist", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // RE-ENCRYPTION

  res.status(200).send(document);
};
