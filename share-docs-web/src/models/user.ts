export interface User {
  username: string;
  email: string;
  sk_acc: string; // var sk_acc = toHex(kp_A.get_private_key().to_bytes());
  // check wallet.test.ts!!!
  signature: string; // will be passed for login purposes
  pkey: string;
}