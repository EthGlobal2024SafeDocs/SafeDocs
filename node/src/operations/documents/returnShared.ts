// GET /documents/shared/{document_id}

import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";

export const ReturnSharedDocumentHandler = async (req: Request, res: Response) => {
  // Get sub from auth
  const { sub } = req.auth!;

  // Check if document id isn't falsy
  const { attestationId } = req.params;

  if(!attestationId) {
    console.log("attestation id is null", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // Get document from attestation id 

  // const shared = await collections.shared?.findOne({});

  res.status(200).send(document);
};
