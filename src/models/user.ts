import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    user_id: string;
}

const userSchema = new Schema<IUser>({
    user_id: { 
        type: String,
        required: [ true, "user cannot be resolved without Spotify user ID"]
    }
});

export default (mongoose.models.Location as unknown as Model<IUser> || mongoose.model<IUser>("User", userSchema))