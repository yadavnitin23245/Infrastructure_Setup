"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const prom_client_1 = require("prom-client");
const Sentry = __importStar(require("@sentry/node"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    (0, prom_client_1.collectDefaultMetrics)();
    // bind pino as Nest logger
    app.useLogger(app.get(nestjs_pino_1.Logger));
    // Swagger only outside production (ya always—your call)
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Hybrid API')
            .setDescription('NestJS + Prisma + MinIO demo')
            .setVersion('1.0')
            .addBearerAuth() // Authorization: Bearer <token>
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        console.log('Swagger UI: http://localhost:' + (process.env.API_PORT || 4000) + '/docs');
    }
    if (process.env.SENTRY_DSN) {
        Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
    }
    await app.listen(process.env.API_PORT || 4000);
    console.log(`API running on http://localhost:${process.env.API_PORT || 4000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map