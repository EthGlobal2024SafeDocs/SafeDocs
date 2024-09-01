import { ObjectId } from 'mongodb';
import { DocumentTypes } from '../../shared/types/components';

export default class Document {
    constructor(public wallet_id: ObjectId, public document_type: DocumentTypes, public payload: EncryptedPayload, public _id?: ObjectId) {}
}

export type EncryptedPayload = {
    key: string;
    cipher: string;
};

export interface DriverLicence {
    number: string;
    firstName: string;
    lastName: string;
    cardNumber: string;
}

export type UserDocument = DriverLicence;