import { Document, model, Schema } from 'mongoose';

export type UserDocument = Document & {
    spotifyId: string;
    access_token: string;
};

const userSchema: Schema = new Schema<UserDocument>({
    spotifyId: String,
    access_token: String,
});

const User = model<UserDocument>('User', userSchema);
export default User;
