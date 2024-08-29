import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http, toHex } from 'viem';
import { mainnet } from 'viem/chains';
import PRE,{ Proxy } from '../src/lib';

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
            key: '048150b4901e438b31ced229ec278b4bc1a0cb6ca99fb4d8ecf6023800f834cdcf2bcb5934c44c4e681acb9c7b1953391ea912be7440c876938bf7a859fb6f00080448f6db56bde64dc2e3c206ba9447415d1594418b4fc9b6dd315dadb020ee0c2f0f01a7071e1ed45b9401be96947178ac9eb105a002dfec691bb26a6ca483b96e001833d63eb3415ba13c023c64d5e20bafc2f7467eda575de01328bb9a9008e1',
            cipher: 'pESdTn0fv1koeKyP5MMqzqxiedV/WkGz1oGtX0WfaO5MFPquraghYVBNAyS4epmYofnYj/NrA2yvfuvdKmY0HgPTOBNNvpdjiGlcynyAJEkE4aP6qvSMDTqRXlhzfGGt',
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
