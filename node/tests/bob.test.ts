import { mnemonicToAccount, privateKeyToAccount, publicKeyToAddress } from 'viem/accounts';
import { createWalletClient, http, toHex } from 'viem';
import { mainnet } from 'viem/chains';
import { IndexService } from '@ethsign/sp-sdk';
import { encryptData, Proxy, decryptData } from '../src/lib';

const bob_pk = 'dc56c79270bf13e92ba867581fc1cab1e2d0022d1e0ea88217b490d2f3cd2ae5';

describe('working with documents', () => {
    it('login with Bob', async () => {
        const bobPri = Proxy.private_key_from_bytes(Proxy.from_hex(bob_pk));
        const bobAccount = privateKeyToAccount(toHex(bobPri.to_bytes()));

        var wallet = await createWalletClient({
            account: bobAccount,
            chain: mainnet,
            transport: http(),
        });

        const message = 'bob@gmail.com';

        const signature = await wallet.signMessage({
            account: bobAccount,
            message,
        });

        console.log('signed message:', signature);
    });

    it('encrypt document payload', async () => {
        const bobPk = Proxy.private_key_from_bytes(Proxy.from_hex(bob_pk));
        var bobPub = Proxy.to_hex(bobPk.get_public_key().to_bytes());

        // encrypt the document payload with private key

        const payload = {
            number: '12345678',
            firstName: 'Bob',
            lastName: 'Brooks',
            cardNumber: '9999999999',
        };

        //JSON.stringify(payload)
        const encryptPayload = encryptData(bobPub, JSON.stringify(payload));
        console.log('encrypted payload', encryptPayload);
    });

    it('decrypt document payload', () => {
        const payload = {
          "key": "045b1499a579744b6d064400d167923f62bb3aa9727061f30150533808a155f479b063831ff619082923aa9bae9c4478aaa47e331c72505e95aeaaa031d2913e01046f825818489bb30bf16c38026d8b8349acf0dbdb9a3b3e27dba55055585dc99ef530c8d710346f6ccd1066e454e7dad307b80b5becba72f1d7e35b30cab9250409b0bd21450347852b4cc828ba505c70134af0b1271682635805534602b144b804706f178a877c0a44616c47b7df5c34df98126b82157115d7b6dbac7c574897d9c2db69db37b0d8c258b56746db53a42a52020074c14c34864f158d6feec7953b",
          "cipher": "Fst6gFtHZO7t/l78Qu3gsnHBpiYQcBLsDbnECTCyve/fXKylUHnnVPxAZAAfEX8rhItz1BgbuNRK8jyOR6/EpEe598RNkbDo7bUwUZFxkU2VQbGhR30tZ6UfPvaqRK9+"
      };

        const bobPk = Proxy.private_key_from_bytes(Proxy.from_hex(bob_pk));
        var bobPri = Proxy.to_hex(bobPk.to_bytes());
        const decryptedData = decryptData(bobPri, payload);
        console.log('decrypted payload:', JSON.parse(decryptedData));
    });

    it('share document with Bob', () => {});

    it('find all attestation for bob', async () => {
        // const bobPk = Proxy.private_key_from_bytes(Proxy.from_hex(bob_pk));

        // const address = publicKeyToAddress(toHex(bobPk.get_public_key().to_bytes()));

        // const indexService = new IndexService('testnet');
        // const attestations = await indexService.queryAttestationList({
        //     indexingValue: address,
        //     page: 1,
        // });

        // console.log('attestations', attestations);
    });
});
