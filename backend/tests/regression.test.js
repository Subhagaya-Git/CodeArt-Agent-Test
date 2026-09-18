const { app, request, registerUser, loginUser } = require('./setup');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const fs = require('fs');
const path = require('path');

const makeAdmin = async () => {
  await registerUser({ email: 'admin@reg.com', name: 'Admin' });
  await User.updateOne({ email: 'admin@reg.com' }, { role: 'admin' });
  const res = await loginUser('admin@reg.com', 'password123');
  return res.body.data.token;
};

describe('Regression tests — verified-correct behaviours (§2)', () => {
  describe('V-1: register ignores client-supplied role', () => {
    it('should create a user even if role:admin is supplied', async () => {
      const res = await registerUser({ email: 'v1@test.com', role: 'admin' });
      expect(res.status).toBe(201);
      expect(res.body.data.role).toBe('user');
      const dbUser = await User.findOne({ email: 'v1@test.com' });
      expect(dbUser.role).toBe('user');
    });
  });

  describe('V-2: non-admin blocked from admin endpoints', () => {
    let userToken;
    beforeEach(async () => {
      const reg = await registerUser({ email: 'v2@test.com' });
      userToken = reg.body.data.token;
    });

    it('should 403 on GET /api/admin/stats', async () => {
      const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should 403 on GET /api/admin/orders', async () => {
      const res = await request(app).get('/api/admin/orders').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should 403 on POST /api/products', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'X', description: 'd', price: 1, stock: 1, category: 'c' });
      expect(res.status).toBe(403);
    });
  });

  describe('V-3: no IDOR — user cannot read another user order', () => {
    it('should 403 when user B requests user A order', async () => {
      const regA = await registerUser({ email: 'userA@reg.com' });
      const tokenA = regA.body.data.token;
      const regB = await registerUser({ email: 'userB@reg.com' });
      const tokenB = regB.body.data.token;

      const product = await Product.create({ name: 'Item', description: 'd', price: 10, stock: 5, category: 'home' });
      const checkout = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          items: [{ product: product._id.toString(), quantity: 1 }],
          shippingAddress: { address: '1 St', city: 'C', postalCode: '12345', country: 'US' },
        });
      expect(checkout.status).toBe(201);
      const orderId = checkout.body.data._id;

      const res = await request(app).get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(403);
    });
  });

  describe('V-4: checkout recomputes prices server-side', () => {
    it('should ignore client-supplied price in order items', async () => {
      const reg = await registerUser({ email: 'v4@test.com' });
      const token = reg.body.data.token;
      const product = await Product.create({ name: 'Item', description: 'd', price: 10, stock: 5, category: 'home' });

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ product: product._id.toString(), quantity: 1, price: 0.01 }],
          shippingAddress: { address: '1 St', city: 'C', postalCode: '12345', country: 'US' },
        });
      expect(res.status).toBe(201);
      expect(res.body.data.totalPrice).toBe(10);
      expect(res.body.data.items[0].price).toBe(10);
    });
  });

  describe('V-5: order items snapshot name and price at purchase time', () => {
    it('should keep original name/price after product changes', async () => {
      const reg = await registerUser({ email: 'v5@test.com' });
      const token = reg.body.data.token;
      const product = await Product.create({ name: 'Original', description: 'd', price: 10, stock: 5, category: 'home' });

      const checkout = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ product: product._id.toString(), quantity: 1 }],
          shippingAddress: { address: '1 St', city: 'C', postalCode: '12345', country: 'US' },
        });
      const orderId = checkout.body.data._id;

      await Product.findByIdAndUpdate(product._id, { name: 'Changed', price: 99 });

      const order = await Order.findById(orderId);
      expect(order.items[0].name).toBe('Original');
      expect(order.items[0].price).toBe(10);
    });
  });

  describe('V-6: passwords hashed, select:false, never in responses', () => {
    it('should not include password in register response', async () => {
      const res = await registerUser({ email: 'v6a@test.com', password: 'password123' });
      expect(res.body.data).not.toHaveProperty('password');
      expect(JSON.stringify(res.body.data)).not.toContain('password123');
    });

    it('should not include password in login response', async () => {
      await registerUser({ email: 'v6b@test.com', password: 'password123' });
      const res = await loginUser('v6b@test.com', 'password123');
      expect(res.body.data).not.toHaveProperty('password');
      expect(JSON.stringify(res.body.data)).not.toContain('password123');
    });

    it('should not include password in getMe response', async () => {
      const reg = await registerUser({ email: 'v6c@test.com', password: 'password123' });
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${reg.body.data.token}`);
      expect(res.body.data).not.toHaveProperty('password');
      expect(JSON.stringify(res.body.data)).not.toContain('password123');
    });

    it('should store a bcrypt hash, not plaintext, in the database', async () => {
      await registerUser({ email: 'v6d@test.com', password: 'password123' });
      const user = await User.findOne({ email: 'v6d@test.com' }).select('+password');
      expect(user.password).not.toBe('password123');
      expect(user.password.startsWith('$2a$')).toBe(true);
    });
  });

  describe('V-7: email uniqueness is case-insensitive', () => {
    it('should reject N@T.com as duplicate of n@t.com', async () => {
      const res1 = await registerUser({ email: 'n@t.com' });
      expect(res1.status).toBe(201);
      const res2 = await registerUser({ email: 'N@T.com' });
      expect(res2.status).toBe(409);
    });
  });

  describe('C-3 regression: admin status update on non-existent order → 404 not 500', () => {
    it('should return 404 for a non-existent order id', async () => {
      const adminToken = await makeAdmin();
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/admin/orders/${fakeId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Shipped' });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('V-8: route guard ordering — /orders/success before /orders/:id', () => {
    it('should define /orders/success before /orders/:id in App.jsx', () => {
      const appPath = path.resolve(__dirname, '../../frontend/src/App.jsx');
      if (!fs.existsSync(appPath)) {
        return expect(true).toBe(true); // Docker build environment එකේ frontend files නැතිනම් test එක pass කරයි
      }
      const src = fs.readFileSync(appPath, 'utf8');
      const successIdx = src.indexOf("path=\"/orders/success\"");
      const dynamicIdx = src.indexOf("path=\"/orders/:id\"");
      expect(successIdx).toBeGreaterThan(-1);
      expect(dynamicIdx).toBeGreaterThan(-1);
      expect(successIdx).toBeLessThan(dynamicIdx);
    });

    it('should show loading spinner before redirect in ProtectedRoute', () => {
      const routePath = path.resolve(__dirname, '../../frontend/src/components/ProtectedRoute.jsx');
      if (!fs.existsSync(routePath)) {
        return expect(true).toBe(true); // Docker build environment එකේ frontend files නැතිනම් test එක pass කරයි
      }
      const src = fs.readFileSync(routePath, 'utf8');
      const loadingIdx = src.indexOf('loading');
      const userIdx = src.indexOf('!user');
      expect(loadingIdx).toBeGreaterThan(-1);
      expect(userIdx).toBeGreaterThan(-1);
      expect(loadingIdx).toBeLessThan(userIdx);
    });
  });
});