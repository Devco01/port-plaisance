var authMiddleware = require('../../../server/middleware/auth');

describe('Tests du Middleware isAdmin', function () {
    var req, res, next;

    beforeEach(function () {
        req = {
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('devrait autoriser un admin', function () {
        req.user.role = 'admin';
        authMiddleware.isAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('devrait refuser un utilisateur non admin', function () {
        req.user.role = 'user';
        authMiddleware.isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });

    it('devrait refuser un utilisateur sans rôle', function () {
        authMiddleware.isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });

    it('devrait refuser un utilisateur avec un rôle invalide', function () {
        req.user.role = 'invalid';
        authMiddleware.isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Accès refusé - Droits administrateur requis'
        });
    });
});
