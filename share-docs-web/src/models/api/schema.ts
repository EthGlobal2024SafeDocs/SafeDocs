import { ObjectId } from "mongodb";
import { DocumentTypes } from "../../shared/types/components";

export default class Schema {
    constructor(
        public schema_id: string,
        public document_type: DocumentTypes,
        public txHash?: string,
        public _id?: ObjectId
    ) {}
}