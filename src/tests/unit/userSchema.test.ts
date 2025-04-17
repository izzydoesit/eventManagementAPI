import { registerUserSchema } from '../../schemas/user.schema';

describe('User Schemas', () => {
  describe('registerUserSchema', () => {
    it('should validate valid user registration data', () => {
      const validUser = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      };

      const result = registerUserSchema.parse(validUser);
      expect(result).toEqual(validUser);
    });

    it('should accept minimum valid values', () => {
      const minimalUser = {
        body: {
          name: 'Jo', // Minimum 2 characters
          email: 'j@x.co', // Minimal valid email
          password: '12345678', // Minimum 8 characters
        },
      };

      expect(() => registerUserSchema.parse(minimalUser)).not.toThrow();
    });

    describe('name validation', () => {
      it('should reject empty name', () => {
        const user = {
          body: {
            name: '',
            email: 'test@example.com',
            password: 'password123',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Name must be at least 2 characters');
        }
      });

      it('should reject name with only one character', () => {
        const user = {
          body: {
            name: 'A',
            email: 'test@example.com',
            password: 'password123',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Name must be at least 2 characters');
        }
      });

      it('should reject name that is not a string', () => {
        const user = {
          body: {
            name: 123,
            email: 'test@example.com',
            password: 'password123',
          },
        };

        expect(() => registerUserSchema.parse(user)).toThrow();
      });
    });

    describe('email validation', () => {
      it('should reject missing @ symbol', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 'johndoeexample.com',
            password: 'password123',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Invalid email format');
        }
      });

      it('should reject missing domain', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 'johndoe@',
            password: 'password123',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Invalid email format');
        }
      });

      it('should reject missing username', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: '@example.com',
            password: 'password123',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Invalid email format');
        }
      });

      it('should reject email that is not a string', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 123,
            password: 'password123',
          },
        };

        expect(() => registerUserSchema.parse(user)).toThrow();
      });
    });

    describe('password validation', () => {
      it('should reject password shorter than 8 characters', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: '1234567',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Password must be at least 8 characters');
        }
      });

      it('should reject empty password', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: '',
          },
        };

        try {
          registerUserSchema.parse(user);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error.errors[0].message).toBe('Password must be at least 8 characters');
        }
      });

      it('should reject password that is not a string', () => {
        const user = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 12345678,
          },
        };

        expect(() => registerUserSchema.parse(user)).toThrow();
      });
    });

    describe('structure validation', () => {
      it('should reject missing body property', () => {
        const invalidUser = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        };

        expect(() => registerUserSchema.parse(invalidUser)).toThrow();
      });

      it('should reject missing required fields', () => {
        const missingFields = {
          body: {
            name: 'John Doe',
            // missing email
            password: 'password123',
          },
        };

        expect(() => registerUserSchema.parse(missingFields)).toThrow();
      });

      it('should reject null values', () => {
        const nullValues = {
          body: {
            name: null,
            email: 'john@example.com',
            password: 'password123',
          },
        };

        expect(() => registerUserSchema.parse(nullValues)).toThrow();
      });
    });
  });
});
