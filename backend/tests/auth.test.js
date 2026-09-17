const { app, request, registerUser, loginUser } = require('./setup');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await registerUser();
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe('jane@test.com');
      expect(res.body.data.role).toBe('user');
    });

    it('should not register duplicate email', async () => {
      await registerUser();
      const res = await registerUser();
      expect(res.status).toBe(409);
    });

    it('should validate input', async () => {
      const res = await request(app).post('/api/auth/register').send({ name: 'a', email: 'bad', password: '123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await registerUser();
      const res = await loginUser('jane@test.com', 'password123');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      await registerUser();
      const res = await loginUser('jane@test.com', 'wrongpassword');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user', async () => {
      const reg = await registerUser();
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${reg.body.data.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('jane@test.com');
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});