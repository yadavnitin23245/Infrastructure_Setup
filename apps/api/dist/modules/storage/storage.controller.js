"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
const swagger_1 = require("@nestjs/swagger");
let StorageController = class StorageController {
    constructor(svc) {
        this.svc = svc;
    }
    getPutUrl(key, contentType) {
        return this.svc.getPutUrl(key, contentType);
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'key', example: 'demo.txt' }),
    (0, swagger_1.ApiQuery)({ name: 'contentType', required: false, example: 'text/plain' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Pre-signed PUT URL (string)' }),
    (0, common_1.Get)('signed-put-url'),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Query)('contentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "getPutUrl", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('storage'),
    (0, common_1.Controller)('storage'),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map