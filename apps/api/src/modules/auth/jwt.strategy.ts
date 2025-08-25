import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = { sub: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Better than casting: fail fast if misconfigured
      throw new Error('JWT_SECRET is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,      // <-- now definitely a string
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    // What you attach here becomes req.user
    return { sub: payload.sub, email: payload.email };
  }
}
