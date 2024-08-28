import { ObjectId } from "mongodb";

export default class Share {
  constructor(
    public attestation_id: string,
    public valid_until: number,
    public document_id: ObjectId,
    public wallet_id: ObjectId,
    public _id: ObjectId
  ) {}
}