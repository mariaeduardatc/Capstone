const UserController = require('../../app/controllers/userController');
const UserModel = require('../../app/models/userModel');
const jwtUtils = require('../../app/utils/jwt');
const passport = require('passport');
const { UnauthorizedError } = require('../../app/utils/errors');

// Mock dependencies
jest.mock('../../app/models/userModel');
jest.mock('../../app/utils/jwt');
jest.mock('passport');
jest.mock('express-async-handler', () => (handler) => handler);

describe('UserController', () => {
    let userController;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        // Create a new instance of UserController
        userController = new UserController();

        // Reset mocks
        UserModel.mockClear();
        jwtUtils.appendCookieJwt.mockClear();
        passport.authenticate.mockClear();

        // Setup mock request, response, and next function
        mockReq = {
            body: {},
        };

        mockRes = {
            clearCookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();
    });

    describe('processLogout', () => {
        it('should clear JWT cookie and return 200 status', async () => {
            await userController.processLogout(mockReq, mockRes, mockNext);

            expect(mockRes.clearCookie).toHaveBeenCalledWith('jwt', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({});
        });
    });

    describe('processAuthentication', () => {
        it('should return user with 200 status when authentication succeeds', async () => {
            const mockUser = { id: '123', email: 'test@example.com' };

            // Mock passport authentication
            passport.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => {
                    callback(null, mockUser, null);
                };
            });

            await userController.processAuthentication(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUser);
        });

        it('should pass error to next middleware when authentication fails', async () => {
            // Mock passport authentication with error
            passport.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => {
                    callback(new Error('Authentication error'));
                };
            });

            await userController.processAuthentication(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should pass UnauthorizedError when no user is found', async () => {
            // Mock passport authentication with no user
            passport.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => {
                    callback(null, false, null);
                };
            });

            await userController.processAuthentication(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
        });
    });

    describe('processRegister', () => {
        it('should register user and append JWT cookie', async () => {
            const mockUserData = { 
                email: 'newuser@example.com', 
                password: 'password123' 
            };
            mockReq.body = mockUserData;

            const mockRegisterResponse = { 
                email: 'newuser@example.com', 
                id: '123' 
            };

            // Mock userModel register method
            userController.userModel.register = jest.fn()
                .mockResolvedValue(mockRegisterResponse);

            await userController.processRegister(mockReq, mockRes, mockNext);

            expect(userController.userModel.register)
                .toHaveBeenCalledWith(mockUserData);
            expect(jwtUtils.appendCookieJwt)
                .toHaveBeenCalledWith(mockRes, mockRegisterResponse.email);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockRegisterResponse);
        });
    });

    describe('processLogin', () => {
        it('should login user and append JWT cookie', async () => {
            const mockUserData = { 
                email: 'existinguser@example.com', 
                password: 'password123' 
            };
            mockReq.body = mockUserData;

            const mockLoginResponse = { 
                email: 'existinguser@example.com', 
                id: '123' 
            };

            // Mock userModel login method
            userController.userModel.login = jest.fn()
                .mockResolvedValue(mockLoginResponse);

            await userController.processLogin(mockReq, mockRes, mockNext);

            expect(userController.userModel.login)
                .toHaveBeenCalledWith(mockUserData);
            expect(jwtUtils.appendCookieJwt)
                .toHaveBeenCalledWith(mockRes, mockLoginResponse.email);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockLoginResponse);
        });
    });

    // Cleanup after all tests
    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
});