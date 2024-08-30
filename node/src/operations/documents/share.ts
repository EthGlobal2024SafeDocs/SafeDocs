// /documents/:documentId/share

import { Response } from 'express';
import { Request } from 'express-jwt';
import { collections } from '../../services/database.services';
import { ObjectId } from 'mongodb';
import { publicKeyToAddress } from 'viem/accounts';
import { ShareDocument, GetAttestation } from '../../services/sign-protocol';
import Share from '../../models/share';
import Document from '../../models/document';
import Wallet from '../../models/wallet';
import { Hex } from 'viem';
import { SendShareEmail } from '../../services/email';

export type ShareRequest = {
    email: string;
    expiry: number;
    proxyKey: string;
};

export const ShareDocumentHandler = async (req: Request, res: Response) => {
    if (!req.body) {
        console.log('error body is null:', req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    const request: ShareRequest = req.body;

    // check if we have a wallet with this email address

    const recipientWallet = await collections.wallets?.findOne<Wallet>({
        email: request.email,
    });

    if (!recipientWallet) {
        console.log('unable to find recipient email:', request.email);
        res.status(400).send('Invalid request!');
        return;
    }

    // make sure proxy key is not null or empty

    if (!request.proxyKey) {
        console.log('proxy key given was null or empty:', request.proxyKey);
        res.status(400).send('Invalid request!');
        return;
    }

    const { sub } = req.auth!;
    const { documentId } = req.params;

    // Get owner's wallet address using document's wallet_id
    const owner = await collections.wallets?.findOne<Wallet>({
        _id: new ObjectId(sub),
    });

    if (!owner) {
        console.log("unable to find document's owner", documentId);
        res.status(400).send('Invalid request!');
        return;
    }

    const document = await collections.documents?.findOne<Document>({
        wallet_id: new ObjectId(sub),
        _id: new ObjectId(documentId),
    });

    if (!document) {
        console.log("document doesn't exist", req.body);
        res.status(404).send('Document not found!');
        return;
    }

    // Create attestation with Sign protocol

    const expiry_in_unix_time = Math.round((Date.now() / 1000) + request.expiry);

    const recipientAddress = publicKeyToAddress(recipientWallet.public_key as Hex);

    const shared = await ShareDocument(
        owner.public_key as Hex,
        document.document_type,
        document._id!.toString(),
        request.proxyKey,
        expiry_in_unix_time,
        recipientAddress
    );
    const { attestationId } = shared;

    const attestation = await GetAttestation(attestationId);

    // Upload instance of share into db
    const result = await collections.shared?.insertOne({
        attestation_id: attestationId,
        valid_until: attestation.validUntil,
        document_id: document._id,
        wallet_id: owner._id,
        recipient_wallet_id: recipientWallet._id,
    } as Share);

    // Send email to intended recipient

    await SendShareEmail(owner.email, recipientWallet.email);

    res.status(200).send({ _id: result?.insertedId });
};
