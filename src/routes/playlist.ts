import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';

import User from '../models/user';

export const router: Router = Router();

dotenv.config();

if (!process.env.SETLIST_FM_API_KEY) {
    throw new Error('Setlist.fm API key not found in environment variables');
}

const setlistKey: string = process.env.SETLIST_FM_API_KEY;

router.get('/playlist/create', async (req: Request, res: Response) => {
    // query database for access token
    const spotifyId: string = req.user?.spotifyId!;
    console.log('the id is:' + spotifyId);
    let accessToken: string = '';

    await getAccessToken(spotifyId).then((value) => {
        accessToken = value;
    });

    if (accessToken === null) {
        throw new Error('[server]: Access token could not be acquired from DB');
    }

    console.log('we got the access token: ' + accessToken);

    //  const user_id: string = req.user?.spotifyId ?? '';
    // const access_token: string = req.user?.access_token ?? '';

    await axios
        .post(
            `https://api.spotify.com/v1/users/${spotifyId}/playlists`,
            {
                name: 'New Setlistify Playlist',
                description: 'Created with Setlistify',
                public: false, // default to private playlist
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            console.log('[server]: Playlist successfully created');
            console.log(accessToken);

            /*
             * TODO: This call to populatePlaylist should be placed in a separate route.
             * Also using dummy placeholder playlist and song uris to test hitting the
             * Spotify API
             *
             * Ideally the new playlist id will be stored server side to refer to n route
             */
            populatePlaylist('0kBDWahmTDRVOTMl87ae2K', accessToken);
            res.sendStatus(response.status);
        })
        .catch((err) => {
            throw new Error(
                '[server]: Error occurred creating playlist\n' + err
            );
        });
});

async function populatePlaylist(
    playlist_id: string,
    accessToken: string
    // songs: any
) {
    await axios
        .post(
            // 'spotify:playlist:' prefix must be stripped from playlist id. NOT so
            // for song id
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                uris: ['spotify:track:5kfE9Jig5bwEqb5IVDZXrF'],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            console.log('[server]: Song added');
        })
        .catch((err) => {
            throw new Error(
                '[server]: Error occurred appending to playlist\n' + err
            );
        });
}

function parseSetlistURL(setlist_url: string): string {
    if (!setlist_url) {
        throw new Error('Setlist ID cannot be parsed without url');
    }

    return setlist_url.split('/').pop()?.split('-').pop()?.split('.')[0] ?? '';
}

async function searchTrackURI(track_title: string, access_token: string) {
    const url: string = 'https://api.spotify.com/v1/search';

    try {
        const response = await axios.post(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
}

async function getAccessToken(id: string): Promise<string | null> {
    try {
        let user = await User.findOne(
            { spotifyId: id },
            { _id: 0, accessToken: 1 } // mongo projects the object _id by default
        );

        if (!user) {
            throw new Error('[server]: Spotify ID not found in Database');
        }

        console.log('[server]: Successfully queried Spotify user ID');

        return user.accessToken;
    } catch (error: unknown) {
        return null;
    }
}
