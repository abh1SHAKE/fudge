import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import mongoose from 'mongoose';

describe('Auth endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /register', () => {
    it('should register a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test', email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('test@example.com');

      const dbUser = await User.findOne({ email: 'test@example.com' });
      expect(dbUser).not.toBeNull();
    });

    it('should not register user with existing email', async () => {
      await User.create({ username: 'test', email: 'test@example.com', password: 'password' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test', email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'test', email: 'test@example.com', password: 'password' });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
