import mongoose, { Document } from 'mongoose';
import { comparePasswords } from '../utils/password';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// This is the type we'll use for the document after it's created
export type IUserDocument = Document & IUser;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    }
}, {
    timestamps: true,
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return comparePasswords(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);