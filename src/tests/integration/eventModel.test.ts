import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Event } from '../../models/event.model';

describe('Event Model', () => {
  let mongoServer: MongoMemoryServer;
  
  const mockUserId = new mongoose.Types.ObjectId();
  const anotherUserId = new mongoose.Types.ObjectId();
  
  const validEventData: {
    title: string;
    description: string;
    date: Date;
    location: string;
    organizer: mongoose.Types.ObjectId;
    category?: string;
    status: string;
  } = {
    title: 'Test Event',
    description: 'This is a test event',
    date: new Date(Date.now() + 86400000), // Tomorrow
    location: 'Test Location',
    organizer: mockUserId,
    category: 'workshop',
    status: 'draft'
  };

  beforeAll(async () => {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
      }
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  describe('Event Schema Validation', () => {
    it('should create an event with valid data', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      
      expect(savedEvent._id).toBeDefined();
      expect(savedEvent.title).toBe(validEventData.title);
      expect(savedEvent.description).toBe(validEventData.description);
      expect(savedEvent.date).toEqual(validEventData.date);
      expect(savedEvent.location).toBe(validEventData.location);
      expect(savedEvent.organizer).toEqual(validEventData.organizer);
      expect(savedEvent.category).toBe(validEventData.category);
      expect(savedEvent.status).toBe(validEventData.status);
      expect(savedEvent.attendees).toEqual([]);
      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeDefined();
    });

    it('should set default values when not provided', async () => {
      const { status, ...eventWithoutDefaults } = validEventData;
      
      const event = new Event(eventWithoutDefaults);
      const savedEvent = await event.save();
      
      expect(savedEvent.status).toBe('draft');
    });

    it('should store attendees correctly', async () => {
      const eventWithAttendees = {
        ...validEventData,
        attendees: [mockUserId, anotherUserId]
      };
      
      const event = new Event(eventWithAttendees);
      const savedEvent = await event.save();
      
      expect(savedEvent.attendees).toHaveLength(2);
      expect(savedEvent.attendees[0]).toEqual(mockUserId);
      expect(savedEvent.attendees[1]).toEqual(anotherUserId);
    });

    it('should allow setting maxAttendees', async () => {
      const eventWithMaxAttendees = {
        ...validEventData,
        maxAttendees: 100
      };
      
      const event = new Event(eventWithMaxAttendees);
      const savedEvent = await event.save();
      
      expect(savedEvent.maxAttendees).toBe(100);
    });
  });

  describe('Field Validations', () => {
    it('should require title', async () => {
      const eventWithoutTitle = { ...validEventData } as Partial<typeof validEventData>;
      delete eventWithoutTitle.title;
      
      const event = new Event(eventWithoutTitle);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate title length', async () => {
      const eventWithLongTitle = {
        ...validEventData,
        title: 'a'.repeat(101)
      };
      
      const event = new Event(eventWithLongTitle);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should require description', async () => {
      const { description, ...eventWithoutDescription } = validEventData;
      
      const event = new Event(eventWithoutDescription);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate description length', async () => {
      const eventWithLongDescription = {
        ...validEventData,
        description: 'a'.repeat(501)
      };
      
      const event = new Event(eventWithLongDescription);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should require date', async () => {
      const eventWithoutDate = { ...validEventData } as Partial<typeof validEventData>;
      delete eventWithoutDate.date;
      
      const event = new Event(eventWithoutDate);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate date is in the future', async () => {
      const eventWithPastDate = {
        ...validEventData,
        date: new Date(Date.now() - 86400000) // Yesterday
      };
      
      const event = new Event(eventWithPastDate);
      
      await expect(event.save()).rejects.toThrow(/Event date must be in the future/);
    });

    it('should require location', async () => {
      const eventWithoutLocation = { ...validEventData } as Partial<typeof validEventData>;
      delete eventWithoutLocation.location;
      
      const event = new Event(eventWithoutLocation);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should require organizer', async () => {
      const eventWithoutOrganizer = { ...validEventData } as Partial<typeof validEventData>;
      delete eventWithoutOrganizer.organizer;
      
      const event = new Event(eventWithoutOrganizer);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should require category', async () => {
      const eventWithoutCategory = { ...validEventData };
      delete eventWithoutCategory.category;
      
      const event = new Event(eventWithoutCategory);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate category enum values', async () => {
      const eventWithInvalidCategory = {
        ...validEventData,
        category: 'invalid-category'
      };
      
      const event = new Event(eventWithInvalidCategory);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate status enum values', async () => {
      const eventWithInvalidStatus = {
        ...validEventData,
        status: 'invalid-status'
      };
      
      const event = new Event(eventWithInvalidStatus);
      
      await expect(event.save()).rejects.toThrow();
    });

    it('should validate maxAttendees minimum value', async () => {
      const eventWithZeroMaxAttendees = {
        ...validEventData,
        maxAttendees: 0 // Invalid value
      };
      
      const event = new Event(eventWithZeroMaxAttendees);
      
      await expect(event.save()).rejects.toThrow(/Maximum attendees must be at least 1/);
    });
  });

  describe('Event Document Methods', () => {
    it('should update fields correctly', async () => {
      const event = new Event(validEventData);
      await event.save();
      
      event.title = 'Updated Title';
      event.description = 'Updated Description';
      await event.save();
      
      const updatedEvent = await Event.findById(event._id);
      expect(updatedEvent?.title).toBe('Updated Title');
      expect(updatedEvent?.description).toBe('Updated Description');
    });

    it('should add attendees correctly', async () => {
      const event = new Event(validEventData);
      await event.save();
      
      event.attendees.push(anotherUserId);
      await event.save();
      
      const updatedEvent = await Event.findById(event._id);
      expect(updatedEvent?.attendees).toHaveLength(1);
      expect(updatedEvent?.attendees[0]).toEqual(anotherUserId);
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      
      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeDefined();
      expect(savedEvent.createdAt).toBeInstanceOf(Date);
      expect(savedEvent.updatedAt).toBeInstanceOf(Date);
    });

    it('should update the updatedAt timestamp when modified', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      
      const originalUpdatedAt = savedEvent.updatedAt;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      event.title = 'New Title';
      const updatedEvent = await event.save();
      
      expect(updatedEvent.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
