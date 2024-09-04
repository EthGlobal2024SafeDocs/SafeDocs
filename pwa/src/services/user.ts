import { privateKeyToAccount } from "viem/accounts";
import { addUser, User } from "./db";
import Proxy from "@/lib/proxy";
import { toHex, createWalletClient, PrivateKeyAccount, Hex, http } from "viem";
import { LoginUser, RegisterUser } from "./api";
import { mainnet } from "viem/chains";

const signMessage = async (user: User) => {
  const pk = Proxy.private_key_from_bytes(Proxy.from_hex(user.key));

  const account = privateKeyToAccount(toHex(pk.to_bytes()));
  //email: string, pk:Hex
  const wallet = await createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  return await wallet.signMessage({ account, message: user.email });
};

export const LoginUserService = async (user: User) => {
  const signature = await signMessage(user);
  const result = await LoginUser(user.email, signature);

  return result.token;
};

export const RegisterUserService = async (username: string, email: string) => {
  const keys = Proxy.generate_key_pair();
  const pk = keys.get_private_key().to_bytes();

  const pkHex = Proxy.to_hex(pk);

  const user = await addUser(username, email, pkHex);

  if (!user) {
    throw Error("failed to create user!");
  }

  const signature = await signMessage(user);

  await RegisterUser(email, signature);

  const result = await LoginUser(email, signature);

  return result.token;
};
