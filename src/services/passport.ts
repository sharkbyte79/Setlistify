import dotenv from 'dotenv';
import { Request } from 'express';
import passport from 'passport';
import {
    Profile,
    Strategy as SpotifyStrategy,
    VerifyCallback,
} from 'passport-spotify';

import User from '../models/user';

dotenv.config();

passport.serializeUser(async function (user: any, done) {
    console.log('making it to serialize');
    done(null, user.spotifyId);
});

passport.deserializeUser(async function (id, done) {
    console.log('starting deserialize...');
    await User.findOne({ spotifyId: id }).then((user) => {
        console.log('making it to deserialize');
        done(null, user);
    });
});

passport.use(
    new SpotifyStrategy(
        {
            /**
             * Casting these as strings prevents error "No overload matches this
             * call" from the SpotifyStrategy type.
             */
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: process.env.CALLBACK_URL as string,
            passReqToCallback: true,
        },
        async (
            req: Request,
            accessToken: string,
            refreshToken: string,
            expires_in: number,
            profile: Profile,
            done: VerifyCallback
        ) => {
            // If a user matching that
            let user = await User.updateOne(
                {
                    spotifyId: profile.id,
                    accessToken: accessToken,
                },
                { upsert: true }
            );

            console.log('right after db');
            done(null, user);
        }
    )
);
