import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  let svc: AuthService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',           // <— provide a real string here
          signOptions: { expiresIn: '1h' }
        }),
      ],
      providers: [
        AuthService,
        { provide: 'Prisma', useValue: prismaMock },
      ],
    }).compile();

    svc = moduleRef.get(AuthService);
    jest.resetAllMocks();
  });

  it('register should create user and return token', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hash' });
    const res = await svc.register('a@b.com', 'secret12');
    expect(res.access_token).toBeDefined();
  });

  it('login should fail for wrong user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(svc.login('x@y.com', 'secret')).rejects.toThrow();
  });
});
