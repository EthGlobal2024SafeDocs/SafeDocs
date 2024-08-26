import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.services";
import { RegisterHandler } from "./operations/register";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.get("/", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    //
    // API routes
    //

    app.post("/register", RegisterHandler);


    // END OF API routes
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
