import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    organizer: IUser['_id'];
    attendees: IUser['_id'][];
    maxAttendees?: number;
    category: string;
    status: 'draft' | 'published' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(value: Date) {
                return value > new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Organizer is required']
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxAttendees: {
        type: Number,
        min: [1, 'Maximum attendees must be at least 1']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['conference', 'workshop', 'social', 'other']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled'],
        default: 'draft'
    }
}, {
    timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);
