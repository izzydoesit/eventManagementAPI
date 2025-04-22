import { User } from '../../models/user.model';
import { comparePasswords } from '../../utils/password';

jest.mock('../../utils/password');

describe('User Model', () => {

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should create a user successfully', async () => {
        const validUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        const user = await User.create(validUser);

        expect(user.name).toBe(validUser.name);
        expect(user.email).toBe(validUser.email);
        expect(user.password).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    });

    it('should fail to create user without required fields', async () => {
        const invalidUser = {};

        await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should fail to create user with invalid email', async () => {
        const invalidUser = {
            name: 'Test User',
            email: 'invalid-email',
            password: 'password123'
        };

        await expect(User.create(invalidUser)).rejects.toThrow();
    });

    describe('comparePassword method', () => {
        it('should return true for valid password', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            (comparePasswords as jest.Mock).mockResolvedValue(true);

            const isValid = await user.comparePassword('password123');
            expect(isValid).toBe(true);
        });

        it('should return false for invalid password', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            (comparePasswords as jest.Mock).mockResolvedValue(false);

            const isValid = await user.comparePassword('wrongpassword');
            expect(isValid).toBe(false);
        });
    });
});