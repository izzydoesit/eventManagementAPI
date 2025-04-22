import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
import { IEvent } from './event.model';

export interface IRsvp extends Document {
    user: IUser['_id'];
    event: IEvent['_id'];
    status: 'attending' | 'maybe' | 'declined';
    timestamp: Date;
}

const rsvpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['attending', 'maybe', 'declined'],
        default: 'attending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const Rsvp = mongoose.model<IRsvp>('Rsvp', rsvpSchema);
