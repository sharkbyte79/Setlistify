import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import { routes } from './routes';
import './services/mongo';
import './services/passport';

dotenv.config();

if (!process.env.PORT) {
    throw new Error('Port not found in environment variables');
}

const port: number = parseInt(process.env.PORT);

const app: Express = express();

app.use(
    session({
        secret: crypto.randomBytes(32).toString('hex'),
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }, // 'secure = false' for local/dev environment
    })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get('/', (req: Request, res: Response) => {
    res.send('TypeScript says Hello, World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running on http://localhost:${port}`);
});
