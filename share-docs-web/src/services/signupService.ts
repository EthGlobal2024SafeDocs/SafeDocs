import { User } from "../models/user";
import Database from '../storage/db'
import { registerUser } from "./registerApiServices";
import { getAccountDetails } from "./web3Services";

export const userExists = async (email: string, username: string): Promise<boolean> => {
  const foundUsers: User[]= await Database.users
    .where('username')
    .anyOfIgnoreCase(username)
    .or('email')
    .anyOfIgnoreCase(email)
    .toArray();
  return foundUsers.length > 0;
}

export const createUser = async (user: User): Promise<User | undefined> => {
  const accountDetails = await getAccountDetails(user.email);
  if (!accountDetails?.signature || !accountDetails.pkey || !accountDetails.sk_acc) {
    return undefined;
  }
  try {
    const response = await registerUser(user.email, accountDetails.signature);
    console.log('response from register = ', response);
  } catch (error) {
    console.log('Error from registerUserApi, error = ', error);
  }
  user.pkey = accountDetails.pkey;
  user.signature = accountDetails.signature;
  user.sk_acc = accountDetails.sk_acc;
  const result = await Database.users.put(user);
  return result === user.username ? user : undefined;
};