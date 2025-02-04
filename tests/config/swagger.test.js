var swaggerSpec = require('../../server/config/swagger');

describe('Tests de Configuration Swagger', function() {
    it('devrait avoir les informations de base correctes', function() {
        expect(swaggerSpec.openapi).toBe('3.0.0');
        expect(swaggerSpec.info).toBeDefined();
        expect(swaggerSpec.info.title).toBe('API Port de Plaisance');
        expect(swaggerSpec.info.version).toBe('1.0.0');
    });

    it('devrait avoir les chemins des fichiers de documentation', function() {
        expect(swaggerSpec.paths).toBeDefined();
        // Note: les chemins peuvent être vides au début
        expect(typeof swaggerSpec.paths).toBe('object');
    });

    it('devrait avoir les options de sécurité configurées', function() {
        expect(swaggerSpec.components.securitySchemes).toBeDefined();
        expect(swaggerSpec.components.securitySchemes.bearerAuth).toBeDefined();
        expect(swaggerSpec.components.securitySchemes.bearerAuth.type).toBe('http');
        expect(swaggerSpec.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
    });

    it('devrait définir les schémas des modèles', function() {
        expect(swaggerSpec.components.schemas).toBeDefined();
        expect(swaggerSpec.components.schemas.User).toBeDefined();
        expect(swaggerSpec.components.schemas.Catway).toBeDefined();
        expect(swaggerSpec.components.schemas.Reservation).toBeDefined();
    });
}); 