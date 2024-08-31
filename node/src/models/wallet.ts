import { ObjectId } from "mongodb";

export default class Wallet {
  constructor(
    public email: string,
    public public_key: string,
    public _id?: ObjectId
  ) {}
}
