import { User } from "../models/user";
import Database from '../storage/db'

export const signupUser = async (user: User): Promise<boolean> => {
  const foundUser: User | undefined = await Database.users.get(user.username);
  if (foundUser) {
    return false;
  }
  Database.users.put(user);
  return true;
};