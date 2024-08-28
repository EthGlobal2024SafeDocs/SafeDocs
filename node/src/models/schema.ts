import { ObjectId } from "mongodb";
import { DocumentTypes } from "../operations/documents/types";

export default class Schema {
    constructor(
        public schema_id: string,
        public document_type: DocumentTypes,
        public txHash?: string,
        public _id?: ObjectId
    ) {}
}