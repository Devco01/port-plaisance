var jwt = require('jsonwebtoken');
var authMiddleware = require('../../../server/middleware/auth');

describe('Tests Unitaires des Middlewares Auth', function () {
    var mockReq;
    var mockRes;
    var mockNext;
    var validToken;

    beforeEach(function () {
        mockReq = {
            headers: {},
            cookies: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        validToken = jwt.sign(
            { id: '123', role: 'user' },
            process.env.JWT_SECRET || 'test_secret'
        );
    });

    describe('Middleware auth', function () {
        it('devrait valider un token JWT valide', function () {
            mockReq.headers.authorization = 'Bearer ' + validToken;
            authMiddleware.auth(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
        });

        it('devrait rejeter une requête sans token', function () {
            authMiddleware.auth(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Token non fourni'
            });
        });

        it('devrait rejeter un token invalide', function () {
            mockReq.headers.authorization = 'Bearer invalid_token';
            authMiddleware.auth(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Token invalide'
            });
        });
    });

    describe('Middleware isAdmin', function () {
        it('devrait autoriser un admin', function () {
            mockReq.user = { role: 'admin' };
            authMiddleware.isAdmin(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        it('devrait rejeter un utilisateur non admin', function () {
            mockReq.user = { role: 'user' };
            authMiddleware.isAdmin(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Accès refusé - Droits administrateur requis'
            });
        });
    });

    describe('Middleware isOwnerOrAdmin', function () {
        it('devrait autoriser l\'accès au propriétaire', function () {
            var email = 'test@test.com';
            mockReq.user = { email: email, role: 'user' };
            mockReq.params.email = email;

            authMiddleware.isOwnerOrAdmin()(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        it('devrait autoriser l\'accès à un admin', function () {
            mockReq.user = { role: 'admin' };
            mockReq.params.email = 'autre@test.com';

            authMiddleware.isOwnerOrAdmin()(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
