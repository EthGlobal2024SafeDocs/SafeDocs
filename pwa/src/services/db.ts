import Dexie, { type EntityTable } from "dexie";

interface User {
  id: number;
  username: string;
  email: string;
  key: string;
}

const db = new Dexie("UsersDatabase") as Dexie & {
  users: EntityTable<User, "id">;
};

db.version(1).stores({
  users: "++id, username, email"
});

export type { User };

export const getUserByUsername = async (username: string) => {
  return await db.users.where("username").equalsIgnoreCase(username).first();
};

export const addUser = async (username: string, email: string, key: string) => {
  const userId = await db.users.add({ username, email, key });
  return await db.users.get(userId);
};

export const getKeyByUsername = async (username: string) => {
  return await db.users
    .where("username")
    .equalsIgnoreCase(username)
    .first()
    .then((user) => {
      return user?.key;
    });
};

export const getUserById = async (userId: number) => {
  return await db.users.get(userId);
};
