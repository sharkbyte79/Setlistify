import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session'
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000; // default to port 3000

app.use(express.json());
app.use(express.urlencoded());

app.use(passport.initialize());
app.use(passport.session());

// if (process.env.MONDODB_URI) {
//     throw new Error("MongoDB URI couldn't be found!")
// } 

/*
Default to empty string if the MongoDB envar can't be found,
catch the error during attempt to connect.
*/
const mongo_uri: string = process.env.MONGODB_URI ?? '';
mongoose
    .connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    } as ConnectOptions).then(() => console.log('[server]: Connected to MongoDB'))
    .catch((err) =>
        console.error('[server]: Could not connect to MongoDB:', err)
);


app.get('/', (req: Request, res: Response) => {
    res.send('TypeScript says Hello, World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running on http://localhost:${port}`);
});
