import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { Rsvp } from '../models/rsvp.model';
import { env } from '../config/env';
import logger from './logger';

/**
 * Seed script for populating the database with initial data
 */
async function seed(): Promise<void> {
  try {
    logger.info('Starting database seed process...');
    
    // Connect to MongoDB
    const uri = env.MONGODB_URI;
    logger.info(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB successfully');

    // Clear existing data
    logger.info('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Rsvp.deleteMany({})
    ]);
    logger.info('Existing data cleared');

    // Create users
    logger.info('Creating users...');
    const saltRounds = 10;
    
    const users = await Promise.all([
      User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', saltRounds),
        role: 'admin'
      }),
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', saltRounds),
      }),
      User.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', saltRounds),
      }),
      User.create({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', saltRounds),
      }),
      User.create({
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', saltRounds),
      })
    ]);
    logger.info(`Created ${users.length} users`);

    // Create events
    logger.info('Creating events...');
    const events = await Promise.all([
      Event.create({
        title: 'Tech Conference 2025',
        description: 'A conference for developers to learn about the latest technologies',
        date: new Date('2025-09-15T09:00:00Z'),
        location: 'San Francisco Convention Center',
        organizer: users[0]._id,
        maxAttendees: 500,
        category: 'conference',
        status: 'published'
      }),
      Event.create({
        title: 'JavaScript Workshop',
        description: 'Learn about the latest JavaScript features and best practices',
        date: new Date('2025-05-05T14:00:00Z'),
        location: 'New York City Tech Hub',
        organizer: users[1]._id,
        maxAttendees: 50,
        category: 'workshop',
        status: 'published'
      }),
      Event.create({
        title: 'Summer Tech Mixer',
        description: 'Network with other professionals in the tech industry',
        date: new Date('2025-07-20T18:00:00Z'),
        location: 'Los Angeles Rooftop Lounge',
        organizer: users[2]._id,
        maxAttendees: 150,
        category: 'social',
        status: 'published'
      }),
      Event.create({
        title: 'Web Development Bootcamp',
        description: 'Intensive two-day workshop on full-stack web development',
        date: new Date('2025-05-10T09:00:00Z'),
        location: 'Chicago Innovation Center',
        organizer: users[3]._id,
        maxAttendees: 30,
        category: 'workshop',
        status: 'published'
      }),
      Event.create({
        title: 'API Design Best Practices',
        description: 'Learn how to design robust and scalable APIs',
        date: new Date('2025-06-15T10:00:00Z'),
        location: 'Austin Technical Campus',
        organizer: users[0]._id,
        maxAttendees: 75,
        category: 'conference',
        status: 'published'
      }),
      Event.create({
        title: 'Hackathon 2025',
        description: '48-hour coding challenge with prizes',
        date: new Date('2025-08-01T09:00:00Z'),
        location: 'Seattle Innovation Hub',
        organizer: users[1]._id,
        maxAttendees: 200,
        category: 'other',
        status: 'draft'
      })
    ]);
    logger.info(`Created ${events.length} events`);

    // Create RSVPs
    logger.info('Creating RSVPs...');
    const rsvps = await Promise.all([
      Rsvp.create({
        user: users[1]._id,
        event: events[0]._id,
        status: 'attending',
      }),
      Rsvp.create({
        user: users[2]._id,
        event: events[0]._id,
        status: 'attending',
      }),
      Rsvp.create({
        user: users[3]._id,
        event: events[0]._id,
        status: 'maybe',
      }),
      Rsvp.create({
        user: users[0]._id,
        event: events[1]._id,
        status: 'attending',
      }),
      Rsvp.create({
        user: users[3]._id,
        event: events[1]._id,
        status: 'attending',
      }),
      Rsvp.create({
        user: users[2]._id,
        event: events[2]._id,
        status: 'declined',
      }),
      Rsvp.create({
        user: users[1]._id,
        event: events[3]._id,
        status: 'attending',
      }),
      Rsvp.create({
        user: users[4]._id,
        event: events[3]._id,
        status: 'maybe',
      }),
    ]);
    logger.info(`Created ${rsvps.length} RSVPs`);

    // Update events with attendees
    logger.info('Updating events with attendee references...');
    for (const rsvp of rsvps) {
      if (rsvp.status === 'attending') {
        await Event.findByIdAndUpdate(
          rsvp.event,
          { $addToSet: { attendees: rsvp.user } },
          { new: true }
        );
      }
    }
    logger.info('Events updated with attendee references');

    logger.info('Database seeded successfully!');

    // Log summary of created data
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const rsvpCount = await Rsvp.countDocuments();

    logger.info('Seed Summary:');
    logger.info(`- ${userCount} users created`);
    logger.info(`- ${eventCount} events created`);
    logger.info(`- ${rsvpCount} RSVPs created`);

  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  }
}

// Execute the seed function if this file is run directly
if (require.main === module) {
  seed()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Unexpected error during seeding:', error);
      process.exit(1);
    });
}

export default seed;