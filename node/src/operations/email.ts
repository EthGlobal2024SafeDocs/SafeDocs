// GET /{email}/publickey

import { Response } from 'express';
import { Request } from 'express-jwt';
import { collections } from '../services/database.services';
import Wallet from '../models/wallet';

export const GetPublicKeyHandler = async (req: Request, res: Response) => {
    const { email } = req.params;

    // Check if email is falsy

    if (!email) {
        console.log('email parameter is invalid', req.params);
        res.status(400).send('Invalid request!');
        return;
    }

    const wallet = await collections.wallets?.findOne<Wallet>({
        email: email,
    });

    // Check if there is no wallet attached to that email

    if (!wallet) {
        console.log('cannot find wallet with that email', req.params);
        res.status(404).send('Email not found!');
        return;
    }

    const publicKey = wallet!.public_key;

    res.status(200).send({ public_key: publicKey });
};
