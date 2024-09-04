import { Document, Schema, model } from 'mongoose';

export type PlaylistDocument = Document & {
    id: string;
    title: string;
};

const playlistSchema: Schema = new Schema<PlaylistDocument>({
    id: String,
    title: String,
});

const Playlist = model<PlaylistDocument>('Playlist', playlistSchema);
export default Playlist;
