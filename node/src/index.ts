import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './services/database.services';
import { RegisterHandler } from './operations/register';
import { LoginHandler } from './operations/login';
import { ExpressJwt } from './services/jwt';
import { HandleMe } from './operations/me';
import { DocumentTypesHandler } from './operations/documents/types';
import { CreateDocumentHandler } from './operations/documents/create';
import { FindDocumentHandler } from './operations/documents/find';
import { ShareDocumentHandler } from './operations/documents/share';
import { FindSharedDocumentHandler } from './operations/documents/findShared';
import { CreateSchemaHandler } from './operations/schemas/create';
import { GetDocumentHandler } from './operations/documents/document';
import { GetPublicKeyHandler } from './operations/email';
import { GenerateProxyKeyHandler } from './operations/proxy';
import { GetSharedDocumentHandler } from './operations/documents/documentShared';
import cors from 'cors';
import { ErrorRegistry, BaseError } from 'new-error';

dotenv.config();

const app: Express = express();
app.use(express.json({limit:'50mb'}));
app.use(cors());

const port = process.env.PORT || 3000;

const tryCatch = async (req: Request, res: Response, next: NextFunction, func: any) => {
    try {
        await func(req, res);
    } catch (err: any) {
        next(err);
    }
};

connectToDatabase()
    .then(() => {
        app.get('/', (req: Request, res: Response) => {
            res.send('Express + TypeScript Server');
        });

        //
        // API routes
        //

        app.post('/register', (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, RegisterHandler));
        app.post('/login', (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, LoginHandler));

        app.get('/me', ExpressJwt(), (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, HandleMe));

        app.get('/documents/types', (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, DocumentTypesHandler));
        app.post('/documents', ExpressJwt(), (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, CreateDocumentHandler));
        app.get('/documents', ExpressJwt(), (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, FindDocumentHandler));
        app.post('/documents/:documentId/share', ExpressJwt(), (req: Request, res: Response, next: NextFunction) =>
            tryCatch(req, res, next, ShareDocumentHandler)
        );
        app.get('/documents/shared', ExpressJwt(), (req: Request, res: Response, next: NextFunction) =>
            tryCatch(req, res, next, FindSharedDocumentHandler)
        );
        app.get('/documents/:documentId', ExpressJwt(), (req: Request, res: Response, next: NextFunction) =>
            tryCatch(req, res, next, GetDocumentHandler)
        );
        app.get('/documents/shared/:attestationId', ExpressJwt(), (req: Request, res: Response, next: NextFunction) =>
            tryCatch(req, res, next, GetSharedDocumentHandler)
        );

        app.get('/publicKeys/:email', ExpressJwt(), (req: Request, res: Response, next: NextFunction) =>
            tryCatch(req, res, next, GetPublicKeyHandler)
        );

        // app.get('/proxy', ExpressJwt(), GenerateProxyKeyHandler);

        app.post('/schemas', ExpressJwt(), (req: Request, res: Response, next: NextFunction) => tryCatch(req, res, next, CreateSchemaHandler));

        app.use((err: any, req: any, res: any, next: any) => {
            // error was sent from middleware
            if (err) {
                console.log(err);
                // check if the error is a generated one
                if (err instanceof BaseError) {
                    // generate an error id
                    // you'll want to use a library like 'nanoid' instead
                    // this is just an example
                    err.withErrorId(Math.random().toString(36).slice(2));

                    // log the error
                    // the "null, 2" options formats the error into a readable structure
                    console.error(JSON.stringify(err.toJSON(), null, 2));

                    // get the status code, if the status code is not defined, default to 500
                    res.status(err.getStatusCode() ?? 500);
                    // spit out the error to the client
                    return res.json({
                        err: err.toJSONSafe(),
                    });
                }

                // You'll need to modify code below to best fit your use-case
                // err.message could potentially expose system internals
                return res.json({
                    err: {
                        message: err.message,
                    },
                });
            }

            // no error, proceed
            next();
        });

        // END OF API routes
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error('Database connection failed', error);
        process.exit();
    });
