const passport = require('passport');
const { UnauthorizedError } = require('../../app/utils/errors');
const { authenticateRequest, jwtStrategy } = require('../../app/middlewares/authMiddleware');
const User = require('../../app/models/userModel');
const jwt = require('jsonwebtoken');
const CONFIG = require('../../app/config/config');

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;
  let userModel;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      headers: {},
      cookies: {}
    };
    mockRes = {};
    mockNext = jest.fn();
    
    // Create a mock User model
    userModel = {
      retrieveUserObjByEmail: jest.fn()
    };
    
    // Replace the User constructor with our mock
    jest.spyOn(User.prototype, 'retrieveUserObjByEmail').mockImplementation(
      userModel.retrieveUserObjByEmail
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cookieJwtExtractor', () => {
    const { cookieJwtExtractor } = require('../../app/middlewares/authMiddleware');

    it('should extract token from cookie when present', () => {
      const req = {
        headers: {
          cookie: 'jwt=sample.token.here'
        }
      };
      const token = cookieJwtExtractor(req);
      expect(token).toBe('sample.token.here');
    });

    it('should return null when no cookie is present', () => {
      const req = { headers: {} };
      const token = cookieJwtExtractor(req);
      expect(token).toBeNull();
    });
  });

  describe('JWT Strategy', () => {
    let verifyCallback;

    beforeEach(() => {
      // Extract the verify callback from the JWT strategy
      verifyCallback = jwtStrategy._verify;
    });

    it('should successfully verify a user when email exists', async () => {
      const mockUser = { 
        email: 'test@example.com', 
        id: '123' 
      };
      
      // Mock the user retrieval
      userModel.retrieveUserObjByEmail.mockResolvedValue(mockUser);

      // Create a mock done callback
      const mockDone = jest.fn();

      // Prepare a mock JWT payload
      const jwtPayload = {
        sub: 'test@example.com'
      };

      // Call the verify callback
      await verifyCallback(jwtPayload, mockDone);

      // Assertions
      expect(userModel.retrieveUserObjByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should call done with false when no user is found', async () => {
      // Mock the user retrieval to return null
      userModel.retrieveUserObjByEmail.mockResolvedValue(null);

      // Create a mock done callback
      const mockDone = jest.fn();

      // Prepare a mock JWT payload
      const jwtPayload = {
        sub: 'nonexistent@example.com'
      };

      // Call the verify callback
      await verifyCallback(jwtPayload, mockDone);

      // Assertions
      expect(userModel.retrieveUserObjByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(mockDone).toHaveBeenCalledWith(null, false);
    });

    it('should handle errors during user retrieval', async () => {
      // Simulate an error during user retrieval
      const retrievalError = new Error('Database connection failed');
      userModel.retrieveUserObjByEmail.mockRejectedValue(retrievalError);

      // Create a mock done callback
      const mockDone = jest.fn();

      // Prepare a mock JWT payload
      const jwtPayload = {
        sub: 'test@example.com'
      };

      // Call the verify callback
      await verifyCallback(jwtPayload, mockDone);

      // Assertions
      expect(userModel.retrieveUserObjByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockDone).toHaveBeenCalledWith(retrievalError, false);
    });

    it('should handle payload without sub', async () => {
      // Create a mock done callback
      const mockDone = jest.fn();

      // Prepare a mock JWT payload without sub
      const jwtPayload = {};

      // Call the verify callback
      await verifyCallback(jwtPayload, mockDone);

      // Assertions
      expect(userModel.retrieveUserObjByEmail).toHaveBeenCalledWith('');
      expect(mockDone).toHaveBeenCalledWith(null, false);
    });
  });

  describe('authenticateRequest middleware', () => {
    it('should call next without error when authentication is successful', () => {
      // Mock passport authentication
      jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          // Simulate successful authentication
          callback(null, { id: 'user123', email: 'test@example.com' });
        };
      });

      // Call the middleware
      authenticateRequest(mockReq, mockRes, mockNext);

      // Verify next was called without an error
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with UnauthorizedError when no user is found', () => {
      // Mock passport authentication
      jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          // Simulate failed authentication (no user)
          callback(null, false);
        };
      });

      // Call the middleware
      authenticateRequest(mockReq, mockRes, mockNext);

      // Verify next was called with UnauthorizedError
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext.mock.calls[0][0].message).toBe('Unauthorized.');
    });

    it('should call next with error when authentication process fails', () => {
      const authenticationError = new Error('Authentication failed');

      // Mock passport authentication
      jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          // Simulate authentication error
          callback(authenticationError);
        };
      });

      // Call the middleware
      authenticateRequest(mockReq, mockRes, mockNext);

      // Verify next was called with the original error
      expect(mockNext).toHaveBeenCalledWith(authenticationError);
    });
  });
});