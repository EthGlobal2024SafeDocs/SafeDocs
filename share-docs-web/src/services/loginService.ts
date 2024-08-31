import { User } from '../models/user'
import Database from '../storage/db'
import { LoginResponse, loginUserApi } from './loginApiServices';
import { getSignature } from './web3Services';

export interface LoginResults {
  user: User;
  response: LoginResponse;
}

const getUser = async (username: string): Promise<User | undefined> => {
  const users: User[] = await Database.users
    .where('username')
    .anyOf(username)
    .toArray();
  return users.length > 0 ? users[0] : undefined;
}

export const loginUser = async (username: string): Promise<LoginResults | undefined> => {
  const user = await getUser(username);
  if (!user) {
    return undefined;
  }
  const signature = await getSignature(user.email, user.sk_acc);
  if (!signature) {
    return undefined;
  }
  const loginResponse = await loginUserApi(user.email, signature);
  return { user, response: loginResponse };
};