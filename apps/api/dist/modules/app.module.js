"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma.module");
const auth_module_1 = require("./auth/auth.module");
const storage_module_1 = require("./storage/storage.module");
const health_controller_1 = require("./health.controller");
const nestjs_pino_1 = require("nestjs-pino");
const metrics_module_1 = require("./metrics/metrics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: { target: 'pino-pretty', options: { singleLine: true } },
                },
                // optional: request id
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                // envFilePath: ['.env', '../../.env'],
                // Try specific env first, then fall back:
                envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', '../../.env'],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            storage_module_1.StorageModule,
            metrics_module_1.MatricsModule
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map