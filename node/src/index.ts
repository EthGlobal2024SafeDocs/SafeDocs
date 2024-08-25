import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { collections, connectToDatabase } from "./services/database.services";
import Wallet from "./models/wallet";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.get("/", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    app.post("/register", async (req: Request, res: Response) => {
      if (!req.body) {
        console.log("body", req.body);
        res.status(400).send("Invalid request!");
        return;
      }

      // check if we already have the email address or public key so we don't create duplicate
      const wallet: Wallet = req.body;

      const walletExists = await collections.wallets?.findOne<Wallet>({
        $or: [
          {
            email: wallet.email
          },
          {
            public_key: wallet.public_key
          }
        ]
      });

      if (walletExists) {
        console.log("duplicate wallet");
        res.status(400).send("Invalid request!");
        return;
      }

      const result = await collections.wallets?.insertOne(wallet);

      result
        ? res.status(200).send({ ...wallet, _id: result.insertedId } as Wallet)
        : res.status(500);
    });

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
