import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

class RegisterDto {
  @ApiProperty({ example: 'demo@example.com' }) @IsEmail() email!: string;
  @ApiProperty({ minLength: 6, example: 'secret12' }) @MinLength(6) password!: string;
}
class LoginDto {
  @ApiProperty({ example: 'demo@example.com' }) @IsEmail() email!: string;
  @ApiProperty({ minLength: 6, example: 'secret12' }) @MinLength(6) password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'JWT access token' })
  @Post('register') register(@Body() dto: RegisterDto) { return this.svc.register(dto.email, dto.password); }

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'JWT access token' })
  @Post('login')    login(@Body() dto: LoginDto)       { return this.svc.login(dto.email, dto.password); }
}
