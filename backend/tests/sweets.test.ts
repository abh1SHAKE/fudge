import request from 'supertest';
import app from '../src/app.js';
import Sweet from '../src/models/Sweet.js';
import User from '../src/models/User.js';
import mongoose from 'mongoose';
import { generateToken } from '../src/utils/jwt.js';

describe('Sweet endpoints', () => {
  let token: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      role: 'admin'
    });

    token = generateToken(user._id);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  describe('POST /sweets', () => {
    it('should create a new sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Marshmallows',
          category: 'gummy',
          price: 15,
          quantity: 50,
          description: 'Soft and fluffy',
          imageUrl: 'http://example.com/marshmallows.jpg'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Marshmallows');

      const dbSweet = await Sweet.findOne({ name: 'Marshmallows' });
      expect(dbSweet).not.toBeNull();
    });

    it('should fail to create sweet with invalid category', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Random Sweet',
          category: 'invalid-category',
          price: 5,
          quantity: 10
        });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /sweets', () => {
    it('should return paginated sweets', async () => {
      await Sweet.create([
        { name: 'Fudge', category: 'fudge', price: 20, quantity: 10 },
        { name: 'Caramel Chocolate', category: 'chocolate', price: 30, quantity: 5 }
      ]);

      const res = await request(app)
        .get('/api/sweets?page=1&limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data.length).toBe(1);
      expect(res.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /sweets/search', () => {
    it('should filter sweets by name and category', async () => {
      await Sweet.create([
        { name: 'Caramel Chocolate', category: 'chocolate', price: 30, quantity: 5 },
        { name: 'Fudge', category: 'fudge', price: 20, quantity: 10 }
      ]);

      const res = await request(app)
        .get('/api/sweets/search?name=caramel&category=chocolate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data[0].name).toBe('Caramel Chocolate');
    });
  });

  describe('PUT /sweets/:id', () => {
    it('should update a sweet', async () => {
      const sweet = await Sweet.create({ name: 'Fudge', category: 'fudge', price: 20, quantity: 10 });

      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 25 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(25);
    });

    it('should return 404 for non-existing sweet', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/sweets/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 15 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /sweets/:id', () => {
    it('should delete a sweet', async () => {
      const sweet = await Sweet.create({ name: 'Marshmallows', category: 'gummy', price: 15, quantity: 50 });

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const dbSweet = await Sweet.findById(sweet._id);
      expect(dbSweet).toBeNull();
    });

    it('should return 404 for non-existing sweet', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/sweets/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /sweets/:id/purchase', () => {
    it('should purchase a sweet and reduce quantity', async () => {
      const sweet = await Sweet.create({ name: 'Fudge', category: 'fudge', price: 20, quantity: 10 });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 3 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(7);
    });

    it('should return 400 if insufficient quantity', async () => {
      const sweet = await Sweet.create({ name: 'Fudge', category: 'fudge', price: 20, quantity: 1 });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(400);
    });

    it('should return 404 if sweet not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${id}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /sweets/:id/restock', () => {
    it('should restock a sweet and increase quantity', async () => {
      const sweet = await Sweet.create({ name: 'Caramel Chocolate', category: 'chocolate', price: 30, quantity: 5 });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(10);
    });

    it('should return 400 for invalid quantity', async () => {
      const sweet = await Sweet.create({ name: 'Caramel Chocolate', category: 'chocolate', price: 30, quantity: 5 });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 0 });

      expect(res.status).toBe(400);
    });

    it('should return 404 if sweet not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${id}/restock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(404);
    });
  });
});

