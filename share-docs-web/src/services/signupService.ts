import { User } from "../models/user";
import Database from '../storage/db'

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
  const exists = await userExists(user);
  if (exists) {
    return false;
  }
  const result = await Database.users.put(user);
  return result === user.username;
};