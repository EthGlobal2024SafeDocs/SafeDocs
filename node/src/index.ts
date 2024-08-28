import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.services";
import { RegisterHandler } from "./operations/register";
import { LoginHandler } from "./operations/login";
import { ExpressJwt } from "./services/jwt";
import { HandleMe } from "./operations/me";
import { DocumentTypesHandler } from "./operations/documents/types";
import { CreateDocumentHandler } from "./operations/documents/create";
import { FindDocumentHandler } from "./operations/documents/find";
import { ShareDocumentHandler } from "./operations/documents/share";

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
    app.post("/login", LoginHandler);

    app.get("/me", ExpressJwt(), HandleMe);

    app.get("/documents/types", DocumentTypesHandler);
    app.post("/documents", ExpressJwt(), CreateDocumentHandler);
    app.get("/documents", ExpressJwt(), FindDocumentHandler);
    app.post('/documents/:documentId/share', ExpressJwt(), ShareDocumentHandler)
    

    // END OF API routes
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
