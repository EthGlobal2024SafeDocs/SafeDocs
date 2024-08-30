// GET /documents/shared/{document_id}

import { Response } from 'express';
import { Request } from 'express-jwt';
import { collections } from '../../services/database.services';
import { ObjectId } from 'mongodb';
import Share from '../../models/share';
import PRE from '../../lib';
import Document from '../../models/document';
import { GetAttestation } from '../../services/sign-protocol';

export const GetSharedDocumentHandler = async (req: Request, res: Response) => {
    // Get sub from auth
    const { sub } = req.auth!;

    // Check if document id isn't falsy
    const { attestationId } = req.params;

    if (!attestationId) {
        console.log('attestation id is null', req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    // Get document from attestation id
    const shared = (await collections.shared?.findOne({
        attestation_id: attestationId,
        wallet_id: sub,
    })) as Share;

    // Check if attestation exists
    if (!shared) {
        console.log("attestation doesn't exist", req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    // Check if attestation is expired
    if (Date.now() > shared.valid_until) {
        console.log('attestation has expired', req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    // Return shared document

    const document = await collections.documents?.findOne<Document>({
        _id: new ObjectId(shared.document_id),
    });

    // Check if document doesn't exist
    if(!document) {
        console.log("Document doesn't exist", req.body);
        res.status(404).send("Document doesn't exist!");
        return;
    }

    const attestation = await GetAttestation(shared.attestation_id);
    const { proxy } = attestation.data as any;

    let v = document!.payload;
    PRE.reEncryption(proxy, v);

    const docs =  { ...document, payload: { ...v } };

    res.status(200).send(document);
};
