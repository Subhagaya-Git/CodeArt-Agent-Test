const { app, request, registerUser } = require('./setup');
const Product = require('../src/models/Product');

describe('Cart API', () => {
  let token, productId;

  beforeEach(async () => {
    const reg = await registerUser();
    token = reg.body.data.token;
    const p = await Product.create({ name: 'Item', description: 'd', price: 10, stock: 5, category: 'home' });
    productId = p._id.toString();
  });

  it('should get empty cart', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  it('should update item quantity', async () => {
    await request(app).post('/api/cart/items').set('Authorization', `Bearer ${token}`).send({ productId, quantity: 1 });
    const res = await request(app)
      .put('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 3 });
    expect(res.body.data.items[0].quantity).toBe(3);
  });

  it('should remove item', async () => {
    await request(app).post('/api/cart/items').set('Authorization', `Bearer ${token}`).send({ productId, quantity: 1 });
    const res = await request(app).delete(`/api/cart/items/${productId}`).set('Authorization', `Bearer ${token}`);
    expect(res.body.data.items).toHaveLength(0);
  });

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });
});