const bcrypt = require('bcrypt');
const User = require('../../app/models/userModel');
const { userDbClient } = require('../../database/db');
const { 
    BadRequestError, 
    UnauthorizedError, 
    NotFoundError 
} = require('../../app/utils/errors');

jest.mock('../../database/db', () => ({
    userDbClient: {
        query: jest.fn()
    }
}));
jest.mock('bcrypt');

describe('User Model', () => {
    let userModel;

    beforeEach(() => {
        userModel = new User();
        jest.clearAllMocks();
    });

    describe('Validation Methods', () => {
        describe('notEmptyCreds', () => {
            it('should throw BadRequestError if any credential is empty', () => {
                const creds = { email: '', password: 'valid' };
                expect(() => userModel.notEmptyCreds(creds)).toThrow(BadRequestError);
            });

            it('should not throw if all credentials are non-empty', () => {
                const creds = { email: 'test@example.com', password: 'valid' };
                expect(() => userModel.notEmptyCreds(creds)).not.toThrow();
            });
        });

        describe('isValidEmail', () => {
            it('should throw BadRequestError for invalid email', () => {
                expect(() => userModel.isValidEmail('invalid-email')).toThrow(BadRequestError);
            });

            it('should not throw for valid email', () => {
                expect(() => userModel.isValidEmail('valid@example.com')).not.toThrow();
            });
        });

        describe('isValidPassword', () => {
            it('should throw BadRequestError for invalid password', () => {
                expect(() => userModel.isValidPassword('short')).toThrow(BadRequestError);
                expect(() => userModel.isValidPassword('nouppercase123')).toThrow(BadRequestError);
                expect(() => userModel.isValidPassword('NoSpecialChar')).toThrow(BadRequestError);
            });

            it('should not throw for valid password', () => {
                expect(() => userModel.isValidPassword('ValidPass123!')).not.toThrow();
            });
        });
    });

    describe('Authentication Methods', () => {
        describe('login', () => {
            it('should successfully login with valid credentials', async () => {
                userDbClient.query
                    .mockResolvedValueOnce({ rows: [{ id: '1', email: 'test@example.com' }] }) // doesUserExist
                    .mockResolvedValueOnce({ rows: [{ password: 'hashedPassword' }] }) // fetchUserHashedPassword
                    .mockResolvedValueOnce({ rows: [{ id: '1', email: 'test@example.com' }] }); // retrieveUserObjByEmail

                bcrypt.compare.mockResolvedValue(true);

                const creds = { email: 'test@example.com', password: 'validPassword' };
                const result = await userModel.login(creds);

                expect(result).toEqual({ id: '1', email: 'test@example.com' });
            });

            it('should throw NotFoundError if user does not exist', async () => {
                userDbClient.query.mockResolvedValueOnce({ rows: [] });

                const creds = { email: 'nonexistent@example.com', password: 'password' };
                await expect(userModel.login(creds)).rejects.toThrow(NotFoundError);
            });

            it('should throw UnauthorizedError for incorrect password', async () => {
                userDbClient.query
                    .mockResolvedValueOnce({ rows: [{ id: '1', email: 'test@example.com' }] })
                    .mockResolvedValueOnce({ rows: [{ password: 'hashedPassword' }] });

                bcrypt.compare.mockResolvedValue(false);

                const creds = { email: 'test@example.com', password: 'wrongPassword' };
                await expect(userModel.login(creds)).rejects.toThrow(UnauthorizedError);
            });
        });

        describe('register', () => {
            it('should successfully register a new user', async () => {
                userDbClient.query.mockResolvedValueOnce({ rows: [] });

                bcrypt.genSalt.mockResolvedValue('salt');
                bcrypt.hash.mockResolvedValue('hashedPassword');

                userDbClient.query
                    .mockResolvedValueOnce() // INSERT query
                    .mockResolvedValueOnce({ rows: [{ id: '1', email: 'newuser@example.com' }] });

                const creds = { 
                    firstName: 'John', 
                    lastName: 'Doe', 
                    email: 'newuser@example.com', 
                    password: 'ValidPass123!' 
                };

                const result = await userModel.register(creds);

                expect(result).toEqual({ id: '1', email: 'newuser@example.com' });
            });

            it('should throw BadRequestError if email already exists', async () => {
                userDbClient.query.mockResolvedValueOnce({ rows: [{ email: 'existing@example.com' }] });

                const creds = { 
                    firstName: 'John', 
                    lastName: 'Doe', 
                    email: 'existing@example.com', 
                    password: 'ValidPass123!' 
                };

                await expect(userModel.register(creds)).rejects.toThrow(BadRequestError);
            });
        });
    });

    describe('Database Queries', () => {
        it('should fetch user by email', async () => {
            const mockUser = { id: '1', email: 'test@example.com' };
            userDbClient.query.mockResolvedValue({ rows: [mockUser] });

            const result = await userModel.fetchUserByEmail('test@example.com');
            expect(result).toEqual(mockUser);
        });

        it('should retrieve user object by ID', async () => {
            const mockUser = { id: '1', first_name: 'John', last_name: 'Doe', email: 'test@example.com' };
            userDbClient.query.mockResolvedValue({ rows: [mockUser] });

            const result = await userModel.retrieveUserObjById('1');
            expect(result).toEqual(mockUser);
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })
});