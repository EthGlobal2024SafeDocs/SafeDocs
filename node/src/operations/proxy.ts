// GET /proxy { privatekey, shared_email } return proxy re-encryption key

import { Response } from 'express';
import { Request } from 'express-jwt';
import { collections } from '../services/database.services';
import { ObjectId } from 'mongodb';
import Wallet from '../models/wallet';
import { generateReEncrytionKey } from '../lib';

export type GenerateProxyKeyRequest = {
    privateKey: string,
    recipientEmail: string
}

export const GenerateProxyKeyHandler = async (req: Request, res: Response) => {
    // Check if request is null

    if (!req.body) {
        console.log('error body is null:', req.body);
        res.status(400).send('Invalid request!');
        return;
    }
    
    const { sub } = req.auth!;

    const request:GenerateProxyKeyRequest = req.body;

    // Look up if recipient has an account and get his public key

    const recipientWallet = await collections.wallets?.findOne<Wallet>({
        email: request.recipientEmail
    });

    if(!recipientWallet) {
        console.log("Recipient wallet doesn't exist", req.body);
        res.status(400).send('Invalid request!');
        return;
    }

    // Recipient exists, get his public key

    const recipientPub = recipientWallet.public_key;

    // Use proxy to generate proxy re-encryption key

    try {
        const proxyKey = generateReEncrytionKey(request.privateKey, recipientPub);
        res.status(200).send({ proxy_key: proxyKey });
    } catch(e) {
        console.log(e);
        console.log("Invalid private key given", req.body);
        res.status(400).send('Invalid request!');
        return;
    }
}