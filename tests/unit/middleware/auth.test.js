const jwt = require('jsonwebtoken');
const auth = require('../../../server/middleware/auth');

describe('Auth Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            header: jest.fn()
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn(() => mockResponse)
        };
    });

    it('should add user to request object when valid token is provided', () => {
        const token = jwt.sign(
            { id: '123', role: 'user' },
            process.env.JWT_SECRET || 'test_secret'
        );
        mockRequest.header.mockReturnValue(token);

        auth(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.user).toBeDefined();
        expect(mockRequest.user.id).toBe('123');
    });

    it('should return 401 when no token is provided', () => {
        mockRequest.header.mockReturnValue(null);

        auth(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            msg: 'Pas de token, autorisation refusée'
        });
    });

    it('should return 401 when invalid token is provided', () => {
        mockRequest.header.mockReturnValue('invalid_token');

        auth(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            msg: 'Token invalide'
        });
    });
}); 