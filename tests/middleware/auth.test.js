const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { requireAuth, requireAdmin, requireUserOrAdmin, requireSameUser } = require('../../server/middleware/auth');
const User = require('../../server/models/User');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        mockReq = {
            cookies: {},
            params: {}
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    describe('requireAuth', () => {
        test('devrait rejeter une requête sans token', async () => {
            await requireAuth(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Authentification requise'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        test('devrait rejeter un token invalide', async () => {
            mockReq.cookies.token = 'invalid_token';

            await requireAuth(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Token invalide'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        test('devrait accepter un token valide', async () => {
            const user = new User({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test123!',
                role: 'user'
            });
            await user.save();

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            );
            mockReq.cookies.token = token;

            await requireAuth(mockReq, mockRes, nextFunction);

            expect(mockReq.user).toBeDefined();
            expect(mockReq.user.email).toBe(user.email);
            expect(nextFunction).toHaveBeenCalled();
        });
    });

    describe('requireAdmin', () => {
        test('devrait autoriser un admin', () => {
            mockReq.user = { role: 'admin' };

            requireAdmin(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        test('devrait rejeter un utilisateur non admin', () => {
            mockReq.user = { role: 'user' };

            requireAdmin(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Accès non autorisé'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('requireUserOrAdmin', () => {
        test('devrait autoriser un admin', () => {
            mockReq.user = { role: 'admin' };

            requireUserOrAdmin(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        test('devrait autoriser un utilisateur', () => {
            mockReq.user = { role: 'user' };

            requireUserOrAdmin(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        test('devrait rejeter un rôle invalide', () => {
            mockReq.user = { role: 'invalid' };

            requireUserOrAdmin(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('requireSameUser', () => {
        test('devrait autoriser un admin à accéder aux ressources d\'autres utilisateurs', () => {
            mockReq.user = { role: 'admin', email: 'admin@test.com' };
            mockReq.params.email = 'user@test.com';

            requireSameUser(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        test('devrait autoriser un utilisateur à accéder à ses propres ressources', () => {
            const email = 'user@test.com';
            mockReq.user = { role: 'user', email };
            mockReq.params.email = email;

            requireSameUser(mockReq, mockRes, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        test('devrait rejeter l\'accès aux ressources d\'autres utilisateurs', () => {
            mockReq.user = { role: 'user', email: 'user1@test.com' };
            mockReq.params.email = 'user2@test.com';

            requireSameUser(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
}); 