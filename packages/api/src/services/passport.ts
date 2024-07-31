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

passport.serializeUser(async function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    await User.findById(id).then((user) => {
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
            // let user = await User.findOne({ spotifyId: profile.id });
            // if (!user) {
            //     user = await User.create({
            //         spotifyId: profile.id,
            //         access_token: accessToken,
            //     });
            // }
            //
            const user = await User.create({
                spotifyId: profile.id,
                access_token: accessToken,
            });

            done(null, user);
        }
    )
);

