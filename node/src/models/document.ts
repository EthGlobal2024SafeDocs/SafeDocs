import { ObjectId } from 'mongodb';
import { DocumentTypes } from '../operations/documents/types';

export default class Document {
    constructor(public wallet_id: ObjectId, public document_type: DocumentTypes, public payload: EncryptedPayload, public _id?: ObjectId) {}
}

export type EncryptedPayload = {
    key: string;
    cipher: string;
};
