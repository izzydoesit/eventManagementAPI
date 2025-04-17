import { createEventSchema, updateEventSchema } from '../../schemas/event.schema';

describe('Event Schemas', () => {
  describe('createEventSchema', () => {
    it('should validate a valid event', () => {
      const validEvent = {
        title: 'Tech Conference 2025',
        description: 'Annual technology conference',
        date: '2025-10-15T10:00:00Z',
        location: 'Convention Center',
        maxAttendees: 500,
        category: 'conference'
      };

      const result = createEventSchema.parse(validEvent);
      expect(result).toEqual({
        ...validEvent,
        date: expect.any(Date)
      });
      expect(result.date).toBeInstanceOf(Date);
    });

    it('should transform string date to Date object', () => {
      const newYearsEve = '2025-12-31';
      const event = {
        title: 'Date Test',
        description: 'Testing date transformation',
        date: newYearsEve,
        location: 'Test Location',
        category: 'workshop'
      };

      const result = createEventSchema.parse(event);
      expect(result.date).toBeInstanceOf(Date);
      expect(result.date.getFullYear()).toBe(2025);
      // December is 11 (zero-indexed)
      expect(result.date.getMonth()).toBe(11); 
      // Get local date instead of comparing exact day
      const localDate = new Date(newYearsEve);
      expect(result.date.getDate()).toBe(localDate.getDate());
    });

    it('should accept all valid categories', () => {
      const categories = ['conference', 'workshop', 'social', 'other'];
      
      categories.forEach(category => {
        const event = {
          title: 'Category Test',
          description: 'Testing categories',
          date: '2025-10-15',
          location: 'Test Location',
          category
        };
        
        expect(() => createEventSchema.parse(event)).not.toThrow();
      });
    });

    it('should make maxAttendees optional', () => {
      const eventWithoutMaxAttendees = {
        title: 'Optional Test',
        description: 'Testing optional fields',
        date: '2025-10-15',
        location: 'Test Location',
        category: 'conference'
      };

      expect(() => createEventSchema.parse(eventWithoutMaxAttendees)).not.toThrow();
    });

    describe('validation errors', () => {
      it('should reject empty title', () => {
        const event = {
          title: '',
          description: 'Valid description',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject title longer than 100 characters', () => {
        const event = {
          title: 'a'.repeat(101),
          description: 'Valid description',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject empty description', () => {
        const event = {
          title: 'Valid Title',
          description: '',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject description longer than 500 characters', () => {
        const event = {
          title: 'Valid Title',
          description: 'a'.repeat(501),
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject invalid date format', () => {
        const event = {
          title: 'Valid Title',
          description: 'Valid description',
          date: 'not-a-date',
          location: 'Test Location',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject empty location', () => {
        const event = {
          title: 'Valid Title',
          description: 'Valid description',
          date: '2025-10-15',
          location: '',
          category: 'conference'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject invalid category', () => {
        const event = {
          title: 'Valid Title',
          description: 'Valid description',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'invalid-category'
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject negative maxAttendees', () => {
        const event = {
          title: 'Valid Title',
          description: 'Valid description',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference',
          maxAttendees: -1
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });

      it('should reject zero maxAttendees', () => {
        const event = {
          title: 'Valid Title',
          description: 'Valid description',
          date: '2025-10-15',
          location: 'Test Location',
          category: 'conference',
          maxAttendees: 0
        };
        
        expect(() => createEventSchema.parse(event)).toThrow();
      });
    });
  });

  describe('updateEventSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        title: 'Updated Title',
        location: 'New Location'
      };
      
      expect(() => updateEventSchema.parse(partialUpdate)).not.toThrow();
    });

    it('should allow empty object (no updates)', () => {
      expect(() => updateEventSchema.parse({})).not.toThrow();
    });

    it('should still validate field constraints when provided', () => {
      const invalidUpdate = {
        title: '',
        category: 'invalid-category'
      };
      
      expect(() => updateEventSchema.parse(invalidUpdate)).toThrow();
    });

    it('should transform date field when provided', () => {
      const update = {
        date: '2026-01-15'
      };
      
      const result = updateEventSchema.parse(update);
      expect(result.date).toBeInstanceOf(Date);
      expect(result.date?.getFullYear()).toBe(2026);
    });
  });
});