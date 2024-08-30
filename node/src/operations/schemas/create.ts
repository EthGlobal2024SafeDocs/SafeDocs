import { Response } from "express";
import { Request } from "express-jwt";
import { CreateSchema } from "../../services/sign-protocol";
import { DocumentTypes } from "../documents/types";

export type CreateSchemaRequest = {
  type: DocumentTypes;
};

export const CreateSchemaHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const request: CreateSchemaRequest = req.body;
  const schema = await CreateSchema(request.type);

  res.status(200).send(schema);
};
