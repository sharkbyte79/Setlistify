import express, { Request } from 'express';
import passport from 'passport';
import {
    Strategy as SpotifyStrategy,
    StrategyOptionsWithRequest,
    Profile,
    VerifyCallback,
} from 'passport-spotify';
import dotenv from 'dotenv';
import User, {IUser} from '../models/user';

dotenv.config();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
})

// passport.deserializeUser(()) {

// }

passport.use(
    new SpotifyStrategy(
        {
            /* 
             * Casting these as strings prevents error "No overload matches
           this call" from the SpotifyStrategy type 
           */
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: process.env.CALLBACK_URL as string,
        },
        async (
            accessToken: string,
            refreshToken: string,
            expires_in: number,
            profile: Profile,
            done: VerifyCallback
        ) => {
            process.nextTick(() => {
                User.findOne({ user_id: profile.id }).then((currentUser) => {
                    if (currentUser) {
                        console.log(`[server]: existing user: ${currentUser}`);
                    } else {
                        let user = new User({
                            user_id: profile.id,
                        })
                            .save()
                            .then(() => {
                                console.log(
                                    `[server]: new user created: ${user}`
                                );
                                done(null)
                            });
                    }
                    console.log(profile);
                });
            });
        }
    )
);
