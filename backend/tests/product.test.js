const { app, request, registerUser } = require('./setup');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

const loginUser = async (email, password) =>
  request(app).post('/api/auth/login').send({ email, password });

const makeAdmin = async () => {
  await registerUser({ email: 'admin@test.com', name: 'Admin' });
  await User.updateOne({ email: 'admin@test.com' }, { role: 'admin' });
  const res = await loginUser('admin@test.com', 'password123');
  return res.body.data.token;
};

const makeUser = async () => {
  const res = await registerUser({ email: 'user@test.com', name: 'User' });
  return res.body.data.token;
};

describe('Product API', () => {
  let adminToken, userToken;

  beforeEach(async () => {
    adminToken = await makeAdmin();
    userToken = await makeUser();
  });

  it('should list products with pagination', async () => {
    await Product.insertMany(
      Array.from({ length: 15 }, (_, i) => ({
        name: `P${i}`,
        description: 'desc',
        price: 10,
        stock: 5,
        category: 'electronics',
      }))
    );
    const res = await request(app).get('/api/products?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.pagination.total).toBe(15);
    expect(res.body.pagination.pages).toBe(2);
  });

  it('should filter by category and search', async () => {
    await Product.insertMany([
      { name: 'Red Shirt', description: 'shirt', price: 10, stock: 5, category: 'clothing' },
      { name: 'Blue Phone', description: 'phone', price: 100, stock: 5, category: 'electronics' },
    ]);
    const cat = await request(app).get('/api/products?category=clothing');
    expect(cat.body.data).toHaveLength(1);
    const search = await request(app).get('/api/products?search=phone');
    expect(search.body.data).toHaveLength(1);
    expect(search.body.data[0].name).toBe('Blue Phone');
  });

  it('should get a single product', async () => {
    const p = await Product.create({ name: 'Item', description: 'd', price: 5, stock: 1, category: 'home' });
    const res = await request(app).get(`/api/products/${p._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Item');
  });

  it('should allow admin to create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New', description: 'desc', price: 10, stock: 5, category: 'electronics' });
    expect(res.status).toBe(201);
  });

  it('should reject non-admin create', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'New', description: 'desc', price: 10, stock: 5, category: 'electronics' });
    expect(res.status).toBe(403);
  });

  it('should allow admin to update & delete', async () => {
    const p = await Product.create({ name: 'Item', description: 'd', price: 5, stock: 1, category: 'home' });
    const upd = await request(app)
      .put(`/api/products/${p._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 20 });
    expect(upd.body.data.price).toBe(20);
    const del = await request(app).delete(`/api/products/${p._id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(200);
  });

  it('should add a review', async () => {
    const p = await Product.create({ name: 'Item', description: 'd', price: 5, stock: 1, category: 'home' });
    const res = await request(app)
      .post(`/api/products/${p._id}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ rating: 4, comment: 'Great' });
    expect(res.status).toBe(201);
    const updated = await Product.findById(p._id);
    expect(updated.numReviews).toBe(1);
    expect(updated.rating).toBe(4);
  });
});
