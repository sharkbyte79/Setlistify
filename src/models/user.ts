import { Document, Schema, model } from 'mongoose';

export type UserDocument = Document & {
    spotifyId: string;
    accessToken: string;
    username?: string;
};

const userSchema: Schema = new Schema<UserDocument>({
    spotifyId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    username: { type: String, unique: false },
});

const User = model<UserDocument>('User', userSchema);
export default User;
