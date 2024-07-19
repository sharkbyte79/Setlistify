import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI not found in environment variables');
}

const mongo_uri: string = process.env.MONGODB_URI;

mongoose
    .connect(mongo_uri, {} as ConnectOptions)
    .then(() => {
        console.log('[server]: Connected to MongoDB');
    })
    .catch((err) => {
        throw new Error('[server]: Could not connect to MongoDB\n' + err);
    });
