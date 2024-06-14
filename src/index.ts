import express, { Express, Request, Response, Router } from 'express';
import session from 'express-session';
import passport, { AuthenticateOptions } from 'passport';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes';
import './services/passport';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000; // default to port 3000

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
// app.use(authRoute);
// if (!process.env.MONDODB_URI) {
//     throw new Error("MongoDB URI couldn't be found!")
// }

/*
Default to empty string if the MongoDB envar can't be found,
catch the error during attempt to connect.
*/
const mongo_uri: string = process.env.MONGODB_URI ?? '';
mongoose
    .connect(mongo_uri, {
        /* 
        These settings will be deprecated in later versions of mongoose
        */
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => console.log('[server]: Connected to MongoDB'))
    .catch((err) => {
        throw new Error('[server]: Could not connect to MongoDB\n' + err);
    });

app.get('/', (req: Request, res: Response) => {
    res.send('TypeScript says Hello, World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running on http://localhost:${port}`);
});
