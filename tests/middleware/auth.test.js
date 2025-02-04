var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var auth = require('../../server/middleware/auth');
var User = require('../../server/models/user');

describe('Auth Middleware', function() {
    var mockReq;
    var mockRes;
    var nextFunction;

    beforeEach(function() {
        mockReq = {
            cookies: {},
            params: {},
            headers: {}
        };
        mockRes = {
            status: function() { return mockRes; },
            json: function() { return mockRes; }
        };
        nextFunction = function() {};
    });

    describe('auth middleware', function() {
        it('should verify valid token', function(done) {
            var token = jwt.sign({ id: 'test123' }, process.env.JWT_SECRET || 'test_secret');
            mockReq.headers.authorization = 'Bearer ' + token;

            auth.auth(mockReq, mockRes, function() {
                expect(mockReq.user).toBeDefined();
                done();
            });
        });

        it('should reject invalid token', function(done) {
            mockReq.headers.authorization = 'Bearer invalid_token';

            auth.auth(mockReq, mockRes, function(err) {
                expect(err).toBeDefined();
                done();
            });
        });

        it('should reject missing token', function(done) {
            auth.auth(mockReq, mockRes, function(err) {
                expect(err).toBeDefined();
                done();
            });
        });
    });

    describe('isAdmin middleware', function() {
        it('should allow admin access', function(done) {
            mockReq.user = { role: 'admin' };

            auth.isAdmin(mockReq, mockRes, function() {
                expect(true).toBe(true);
                done();
            });
        });

        it('should reject non-admin access', function(done) {
            mockReq.user = { role: 'user' };

            auth.isAdmin(mockReq, mockRes, function(err) {
                expect(err).toBeDefined();
                done();
            });
        });
    });

    describe('isOwnerOrAdmin middleware', function() {
        it('should allow owner access', function(done) {
            var email = 'test@test.com';
            mockReq.user = { email: email, role: 'user' };
            mockReq.params.email = email;

            auth.isOwnerOrAdmin()(mockReq, mockRes, function() {
                expect(true).toBe(true);
                done();
            });
        });

        it('should allow admin access', function(done) {
            mockReq.user = { role: 'admin' };
            mockReq.params.email = 'other@test.com';

            auth.isOwnerOrAdmin()(mockReq, mockRes, function() {
                expect(true).toBe(true);
                done();
            });
        });
    });
}); 