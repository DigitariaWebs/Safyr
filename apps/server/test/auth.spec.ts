import { describe, it, expect, beforeAll, afterAll, beforeEach, mock } from "bun:test";
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { EmailService } from '../src/email/email.service';

// Store captured data from mocked email service
let lastOtp: string | null = null;
let lastMagicLink: string | null = null;

// Mock the email templates to avoid parsing JSX
mock.module('@/email/templates/magic-link', () => ({
  MagicLinkEmail: () => 'MagicLinkEmailMock',
}));
mock.module('@/email/templates/otp', () => ({
  OtpEmail: () => 'OtpEmailMock',
}));

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        checkConnection: async () => ({ status: 'up' }),
        sendMagicLink: async (to: string, { url }: { url: string }) => {
          lastMagicLink = url;
        },
        sendOtp: async (to: string, otp: string) => {
          lastOtp = otp;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    app.setGlobalPrefix('api', { exclude: ['health'] });

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cleanDb();
    await prisma.seedDb();
    lastOtp = null;
    lastMagicLink = null;
  });

  describe('Authentication Flows', () => {
    const testEmail = 'test@example.com';

    it('OTP flow: should send OTP and then sign in', async () => {

      // 1. Request OTP
      await supertest(app.getHttpServer())
        .post('/api/auth/email-otp/send-verification-otp')
        .send({ email: testEmail, type: 'sign-in' })
        .expect(200);

      expect(lastOtp).not.toBeNull();
      const otp = lastOtp!;

      // 2. Verify OTP and Sign In
      const response = await supertest(app.getHttpServer())
        .post('/api/auth/sign-in/email-otp')
        .send({ email: testEmail, otp })
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);

      const cookie = response.get('Set-Cookie');

      // 3. Get session
      const sessionResponse = await supertest(app.getHttpServer())
        .get('/api/auth/get-session')
        .set('Cookie', cookie!)
        .expect(200);

      expect(sessionResponse.body.user.email).toBe(testEmail);
    });

    it('Magic Link flow: should send Magic Link and sign in', async () => {

      // 1. Request Magic Link
      await supertest(app.getHttpServer())
        .post('/api/auth/sign-in/magic-link')
        .send({ email: testEmail, callbackURL: 'http://localhost:3000/dashboard' })
        .expect(200);

      expect(lastMagicLink).not.toBeNull();

      // 2. Verify Magic Link
      const url = new URL(lastMagicLink!);
      const pathAndQuery = url.pathname + url.search;

      const response = await supertest(app.getHttpServer())
        .get(pathAndQuery)
        .expect(302);

      const cookie = response.get('Set-Cookie');

      // 3. Verify session
      const sessionResponse = await supertest(app.getHttpServer())
        .get('/api/auth/get-session')
        .set('Cookie', cookie!)
        .expect(200);

      expect(sessionResponse.body.user.email).toBe(testEmail);
    });

    it('Session management: should handle unauthenticated and logout', async () => {

      // 1. Unauthenticated session check
      const unauthResponse = await supertest(app.getHttpServer())
        .get('/api/auth/get-session');

      expect(!unauthResponse.body || Object.keys(unauthResponse.body).length === 0).toBe(true);

      // 2. Sign in to test logout
      await supertest(app.getHttpServer())
        .post('/api/auth/email-otp/send-verification-otp')
        .send({ email: testEmail, type: 'sign-in' })
        .expect(200);

      const loginResponse = await supertest(app.getHttpServer())
        .post('/api/auth/sign-in/email-otp')
        .send({ email: testEmail, otp: lastOtp! })
        .expect(200);

      const cookie = loginResponse.get('Set-Cookie');

      // 3. Logout
      await supertest(app.getHttpServer())
        .post('/api/auth/sign-out')
        .set('Cookie', cookie!)
        .send({})
        .expect(200);


      // 4. Verify session is gone
      const finalSessionResponse = await supertest(app.getHttpServer())
        .get('/api/auth/get-session')
        .set('Cookie', cookie!)
        .expect(200);

      expect(!finalSessionResponse.body || Object.keys(finalSessionResponse.body).length === 0).toBe(true);
    });
  });

  describe('Health check', () => {
    it('/health (GET)', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body.status).toBeDefined();
    });
  });
});
