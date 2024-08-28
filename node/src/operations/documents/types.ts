// GET - Return documents types that we can store

import { Request, Response } from "express";

export enum DocumentTypes {
  DriversLicense = "DriversLicense"
}

export const DocumentTypesHandler = async (req: Request, res: Response) => {
  // Check if request is null
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const values: Array<DocumentTypes> = [DocumentTypes.DriversLicense];

  // Return types with 200 network status
  res.status(200).send(values);
};
