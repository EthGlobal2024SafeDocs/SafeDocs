// POST /documents         {type, JWT_token, payload }     (drivers license)

import { Response } from 'express';
import { Request } from 'express-jwt';
import { collections } from '../../services/database.services';
import { ObjectId } from 'mongodb';
import Document, { EncryptedPayload } from '../../models/document';
import { DocumentTypes } from './types';

export type CreateDocumentRequest = {
    type: DocumentTypes;
    payload: EncryptedPayload; // hex encoded payload
};

export const CreateDocumentHandler = async (req: Request, res: Response) => {
    // Check if request is null
    if (!req.body) {
        console.log('error body is null:', req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    const { sub } = req.auth!;

    const wallet = await collections.wallets?.findOne({ _id: new ObjectId(sub) });

    // Check if wallet exists
    if (!wallet) {
        console.log("Wallet doesn't exist", req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    // Check if document already exists for same wallet
    const request: CreateDocumentRequest = req.body;

    let document = await collections.documents?.findOne<Document>({
        $and: [
            { wallet_id: new ObjectId(sub) },
            {
                'payload.cipher': request.payload.cipher,
            },
        ],
    });

    let _id = document?._id;

    if (document) {
        console.log('document already exists for wallet', document);
    } else {
        document = {
            document_type: request.type,
            wallet_id: wallet._id,
            payload: request.payload,
        };

        const id = await collections.documents?.insertOne(document);

        _id = id?.insertedId;
    }

    // Return types with 200 network status
    res.status(200).send({ _id });
};
