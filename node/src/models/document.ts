import { ObjectId } from "mongodb";

export default class Document {
  constructor(
    public wallet_id: ObjectId,
    public document_type: DocumentType,
    public payload: string,
    public _id?: ObjectId
  ) {}
}


