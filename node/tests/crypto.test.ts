import { log } from 'console';
import PRE, { Proxy, encryptData, generateReEncrytionKey } from '../src/lib';
import { encodeAbiParameters } from 'viem'

it('test crypto', () => {
    const pk = '0489b89014bea62671f3e9e85fc56ce272b5f5094819f45954b7897eefcffab45fd730203ad1e8b50fa529ec2c7a859ccac9c119ffcaa7b4d47ee875e5b610734c';
    const pv = '17d87eb1a1aefa329926c404560a4442c475a9e95a19e5a388932d22e5684793';

    const sk = Proxy.public_key_from_bytes(Proxy.from_hex(pk));
    const pvk = Proxy.private_key_from_bytes(Proxy.from_hex(pv));

    const reencrypt = Proxy.generate_re_encryption_key(pvk, sk)
    console.log(Proxy.to_hex(reencrypt.to_bytes()));
    console.log(Proxy.to_hex(reencrypt.to_bytes()).length);
    console.log(reencrypt.to_bytes());
    console.log(reencrypt.to_bytes().length);
    const back = Proxy.re_encryption_key_from_bytes(reencrypt.to_bytes());
    console.log(Proxy.to_hex(back.to_bytes()));

    const encoded = encodeAbiParameters([{ name: 'key', type: 'bytes' }], [reencrypt.to_bytes()]);
    console.log(encoded);

    // console.log(Proxy.to_hex(sk.to_bytes()));

    // console.log(sk);
});
