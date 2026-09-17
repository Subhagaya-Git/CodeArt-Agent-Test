const { app, request, registerUser } = require('./setup');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

const loginUser = async (email, password) =>
  request(app).post('/api/auth/login').send({ email, password });

describe('Order API', () => {
  let userToken, adminToken, product;

  beforeEach(async () => {
    const reg = await registerUser();
    userToken = reg.body.data.token;

    await registerUser({ email: 'admin@test.com', name: 'Admin' });
    await User.updateOne({ email: 'admin@test.com' }, { role: 'admin' });
    adminToken = (await loginUser('admin@test.com', 'password123')).body.data.token;

    product = await Product.create({ name: 'Item', description: 'd', price: 10, stock: 5, category: 'home' });
  });

  const checkoutPayload = () => ({
    items: [{ product: product._id.toString(), quantity: 2 }],
    shippingAddress: { address: '1 Main St', city: 'Town', postalCode: '12345', country: 'US' },
  });

  it('should create an order (checkout)', async () => {
    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`).send(checkoutPayload());
    expect(res.status).toBe(201);
    expect(res.body.data.totalPrice).toBe(20);
    expect(res.body.data.status).toBe('Paid');
    const updated = await Product.findById(product._id);
    expect(updated.stock).toBe(3);
  });

  it('should list my orders', async () => {
    await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`).send(checkoutPayload());
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${userToken}`);
    expect(res.body.data).toHaveLength(1);
  });

  it('should let admin list all orders & update status', async () => {
    await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`).send(checkoutPayload());
    const list = await request(app).get('/api/admin/orders').set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    const orderId = list.body.data[0]._id;
    const upd = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' });
    expect(upd.body.data.status).toBe('Shipped');
  });

  it('should return dashboard stats', async () => {
    await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`).send(checkoutPayload());
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalOrders).toBe(1);
    expect(res.body.data.totalProducts).toBe(1);
    expect(res.body.data.revenue).toBe(20);
  });

  it('should reject admin routes for normal user', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});