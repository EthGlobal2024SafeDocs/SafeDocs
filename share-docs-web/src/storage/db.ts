import Dexie, { Table } from "dexie";
import { User } from "../models/user";

class Database extends Dexie {
  users!: Table<User, string>;

  constructor() {
    super('share-docs-database');
    this.version(1).stores({
      users: 'username, email',
    });
  }
}

export default new Database();
