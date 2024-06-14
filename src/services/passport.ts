import { Request } from 'express';
import passport from 'passport';
import { SessionData } from 'express-session';
import {
    Strategy as SpotifyStrategy,
    Profile,
    VerifyCallback,
} from 'passport-spotify';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

export interface SessionDataWithAccessToken extends SessionData {
    accessToken?: string;
}

passport.use(
    new SpotifyStrategy(
        {
            /* 
            Casting these as strings prevents error "No overload matches
           this call" from the SpotifyStrategy type 
           */
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: process.env.CALLBACK_URL as string,
            passReqToCallback: true, // pass req to callback for saving access token to session
        },
        async (
            req: Request & { session: SessionDataWithAccessToken },
            accessToken: string,
            refreshToken: string,
            expires_in: number,
            profile: Profile,
            done: VerifyCallback
        ) => {
            /* 
            Store access token received from Spotify in session data
             We'll use it to match the user to their Spotify profile information
             saved in the database
            */
            req.session.accessToken = accessToken;

            await User.findOne({
                access_token: accessToken,
            }).then((user) => {
                if (user) {
                    console.log('existing user: ' + JSON.stringify(profile));
                    return done(null, profile);
                } else {
                    new User({
                        access_token: req.session.accessToken,
                        user_id: profile.id,
                    })
                        .save()
                        .then((user) => {
                            console.log('new user saved to database:');
                            return done(null, profile);
                        });
                }
            });
        }
    )
);
