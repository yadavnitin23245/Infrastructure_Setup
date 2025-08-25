import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
export declare class AuthService {
    private jwt;
    private prisma;
    constructor(jwt: JwtService, prisma: PrismaClient);
    register(email: string, password: string): Promise<{
        access_token: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    private sign;
}
