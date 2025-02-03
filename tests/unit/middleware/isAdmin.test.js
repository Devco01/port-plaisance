const isAdmin = require('../../../server/middleware/isAdmin');

describe('isAdmin Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn(() => mockResponse)
        };
        nextFunction.mockClear();
    });

    it('should allow admin users to proceed', () => {
        mockRequest.user = { role: 'admin' };
        
        isAdmin(mockRequest, mockResponse, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should reject non-admin users with 403', () => {
        mockRequest.user = { role: 'user' };
        
        isAdmin(mockRequest, mockResponse, nextFunction);
        
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });

    it('should reject requests without user object', () => {
        mockRequest.user = null;
        
        isAdmin(mockRequest, mockResponse, nextFunction);
        
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });

    it('should reject requests with undefined user role', () => {
        mockRequest.user = { name: 'Test User' }; // pas de rôle défini
        
        isAdmin(mockRequest, mockResponse, nextFunction);
        
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });
}); 