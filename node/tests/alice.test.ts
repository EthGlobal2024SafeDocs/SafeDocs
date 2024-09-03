import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http, toHex } from 'viem';
import { mainnet } from 'viem/chains';
import PRE, { Proxy, encryptData } from '../src/lib';

const mnemonic = 'airport put edge nurse orange struggle scene account math shiver script angry';
const alice_pk = '459c8af7d3b50b31f859db099eb12b21385b3c4505b3fde82cd7bcfe3db74997';
const bob_pk = 'dc56c79270bf13e92ba867581fc1cab1e2d0022d1e0ea88217b490d2f3cd2ae5';

describe('working with documents', () => {
    it('login with Alice', async () => {
        const alicePri = Proxy.private_key_from_bytes(Proxy.from_hex(alice_pk));
        const aliceAccount = privateKeyToAccount(toHex(alicePri.to_bytes()));

        var wallet = await createWalletClient({
            account: aliceAccount,
            chain: mainnet,
            transport: http(),
        });

        const message = 'alice@gmail.com';

        const signature = await wallet.signMessage({
            account: aliceAccount,
            message,
        });

        console.log('signed message:', signature);
    });

    it('encrypt document payload', async () => {
        const alicePk = Proxy.private_key_from_bytes(Proxy.from_hex(alice_pk));
        var alicePub = Proxy.to_hex(alicePk.get_public_key().to_bytes());

        // encrypt the document payload with private key

        const payload = {
            number: '12345678',
            firstName: 'Alice',
            lastName: 'Brooks',
            cardNumber: '9999999999',
        };

        //JSON.stringify(payload)
        const encryptPayload = PRE.encryptData(alicePub, JSON.stringify(payload));
        console.log('encrypted payload', encryptPayload);
    });

    it('decrypt document payload', () => {
        const payload = {
            key: '04ef2a434ebc1684b0c4e2a7f59c3dcf669f821eb2adfe846a442dc9a4e523339781a40bf422ad9a605ed0bfe1ff19563fd5faca837f2771e40788666884184a8304504dbff4bd2628f8f3c6c365d0edf80f17e7c19de17e1c2ca6980aa8e6d308f284fab6e97b268e5fcc78664209065dc5a02440c7fba8c0145490566aa69b3e30439493ea1f4e0d7951b34ffbdea0b7aaf842efcd18f8f3fbea0519bdca9702ec0416feaf7849e2a6570eb6fc43a6d722d129b16e5b05d2c5755344a5f3e7bfa08e0673339ee7d194d3a9a14b96cbc24c5d1df4e985eb1ada3b7ffb9df0ac34e6dc',
            cipher: 'cQJGIjBG4hphN81Fjgvt3Q==',
        };

        const alicePk = Proxy.private_key_from_bytes(Proxy.from_hex(alice_pk));
        var alicePri = Proxy.to_hex(alicePk.to_bytes());
        const decryptedData = PRE.decryptData(alicePri, payload);
        console.log('decrypted payload:', JSON.parse(decryptedData));
    });

    it('share document with Bob', () => {
        // part of sharing with bob, Alice needs to generate a proxy key using her private key and bob public key

        const alicePk = Proxy.private_key_from_bytes(Proxy.from_hex(alice_pk));
        var alicePri = Proxy.to_hex(alicePk.to_bytes());

        const bobPk = Proxy.private_key_from_bytes(Proxy.from_hex(bob_pk));
        const bobPub = Proxy.to_hex(bobPk.get_public_key().to_bytes());

        const proxyKey = PRE.generateReEncrytionKey(alicePri, bobPub);

        console.log('proxy key to Bob:', proxyKey);
    });
});
