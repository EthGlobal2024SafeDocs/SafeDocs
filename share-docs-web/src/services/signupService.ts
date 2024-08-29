import { User } from "../models/user";
import Database from '../storage/db'
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, toHex } from "viem";
import { mainnet } from "viem/chains";

export const getSignature = async () => {
  // Step 1. - create Wallet -
  // Run following code until success
  // debugger
  // const kp_A = Proxy.generate_key_pair();
  // const sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
  // const pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());
  // console.log(`1 - ${sk_A} - 2 - ${pk_A}`);
  // const sk_acc = toHex(kp_A.get_private_key().to_bytes());

  // const account = privateKeyToAccount(sk_acc);
  // account can give me private and public keys!!! 
  // Store data in indexedDb

  // Step 2. - Need to create wallet
  // const wallet = await createWalletClient({
  //   account,
  //   chain: mainnet,
  //   transport: http()
  // });

  // Step 3. - Generate signature from email. Will also be a payload for the login endpoint
  // const message = "test-user@gmail.com";

  // const signature = await wallet.signMessage({
  //   account,
  //   message
  // });
  // console.log('+++++ ', signature);
  // Step 4. - This step is for Login into the system. Optional
  // We should get back jwt token and user is authenticated.
}

export const userExists = async (user: User): Promise<boolean> => {
  const foundUsers: User[]= await Database.users
    .where('username')
    .anyOfIgnoreCase(user.username)
    .or('email')
    .anyOfIgnoreCase(user.email)
    .toArray();
  return foundUsers.length > 0;
}

export const signupUser = async (user: User): Promise<boolean> => {
  getSignature();
  const exists = await userExists(user);
  if (exists) {
    return false;
  }
  const result = await Database.users.put(user);
  return result === user.username;
};